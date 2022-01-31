from fastapi import status, APIRouter, Body, Depends, BackgroundTasks
from session_token import get_current_active_user, User
from db import session
import errors
from cache_backend import cache
from pydantic import BaseModel, Field

# Prepared Statement

delete_url_stmt = session.prepare("DELETE FROM url_map WHERE short_url=?")
delete_url_stat_stmt = session.prepare("DELETE FROM resolve_count WHERE user=? AND short_url=?")

router = APIRouter()


class Url(BaseModel):
    short_url: str = Field(title="Hashed URL", description="URL which has to be deleted", max_length=7, min_length=7)


@router.post("/delete_url", status_code=status.HTTP_200_OK, tags=['url'], description="Route to delete the url",
             response_description="URL Successfully deleted")
async def delete_url(background_tasks: BackgroundTasks,
                     url: Url,
                     _user: User = Depends(get_current_active_user)):
    short_url = url.short_url
    _user = _user.get("username", None)
    if not _user:
        return errors.HTTP_401_UNAUTHORIZED
    session.execute(delete_url_stmt, [short_url])
    session.execute(delete_url_stat_stmt, [_user, short_url])
    background_tasks.add_task(delete_url_from_cache, short_url)


def delete_url_from_cache(short_url: str):
    cache.lpop(short_url)
