from add_url import add_resolve_count
from fastapi import APIRouter, Path, BackgroundTasks
from starlette.responses import RedirectResponse
from db import session
import errors
from cache_backend import cache
import redis

url_get_stmt = session.prepare("SELECT url,user From url_map WHERE short_url=?")

router = APIRouter()


@router.get("/{hashed_url}", tags=["url"])
async def get_url(background_tasks: BackgroundTasks,
                  hashed_url: str = Path(..., title="hashed url", description="Hashed url which is stored in the DB as key")):

    try:
        _url = cache.lrange(hashed_url, 0, 1)  # check the cache
        if _url:
            url, user = _url[0].decode("utf-8"), _url[1].decode("utf-8")
        else:
            url, user = get_url_from_db(hashed_url)
            background_tasks.add_task(add_cache, hashed_url, *[user, url])  # cache the result using tail push
    except redis.exceptions.ConnectionError:  # If Redis backend is not available hit the Database
        url,user = get_url_from_db(hashed_url)

    background_tasks.add_task(add_resolve_count, url, hashed_url, user)  # update the resolveCount in the background
    return RedirectResponse(url=f"{url}")  # Redirect to the mapped url from the DB ♥



def add_cache(short_url: str, *values):
    cache.lpush(short_url, *values)


def get_url_from_db(short_url: str):
    try:
        _url = session.execute(url_get_stmt, [short_url])[0]
        return _url[0], _url[1]
    except IndexError or TypeError:
        raise errors.HTTP_404_NOT_FOUND