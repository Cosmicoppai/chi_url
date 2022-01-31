from fastapi import APIRouter, status, Depends
from session_token import get_current_active_user
import binascii, errors
from db import session
from functools import lru_cache
from config import OriginSettings
from pydantic import BaseModel
import logging


logging.basicConfig(handlers=[logging.FileHandler(filename="../logs/url_stats.log", encoding="utf-8")], level=logging.ERROR)

router = APIRouter()

url_stats_stmt = session.prepare("SELECT * FROM resolve_count WHERE user=?")  # Get URL Stats
url_stats_stmt.fetch_size = 25  # set the pagination 25


@lru_cache()
def get_host_name():
    return OriginSettings()


class Host(BaseModel):
    host: str = get_host_name().host




@router.get("/url-stats", tags=["url"], status_code=status.HTTP_200_OK)
async def url_stats(paging_state=None, _user=Depends(get_current_active_user)):
    _user = _user.get('username', None)
    if _user:
        # statement = SimpleStatement(f"SELECT * FROM resolve_count WHERE user='{_user}'", fetch_size=25)
        ps = binascii.unhexlify(paging_state) if paging_state else None  # check if paging state exists or not
        results = session.execute(url_stats_stmt, [_user], paging_state=ps)
        data = []
        for stat in results.current_rows:
            data.append(
                {"url": stat.url,
                 "short_url": f"{Host().host}/{stat.short_url}",
                 "resolves": stat.resolves}
            )
        paging_state = binascii.hexlify(results.paging_state).decode() if results.paging_state else None  # fi all results are queried set paging_state as None
        return {"stats": data, "paging_state": paging_state}  # return the data and the paging state

    raise errors.HTTP_401_UNAUTHORIZED