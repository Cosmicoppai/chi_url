import logging
import time
from functools import lru_cache
from config import OriginSettings
from fastapi import status, APIRouter, Path, Depends, BackgroundTasks
from pydantic import BaseModel
from starlette.responses import RedirectResponse
from db import session
from cassandra.query import SimpleStatement
from session_token import get_current_active_user, User
import binascii
from errors import HTTP_404_NOT_FOUND, HTTP_500_INTERNAL_SERVER_ERROR, HTTP_401_UNAUTHORIZED
import redis


logging.basicConfig(handlers=[logging.FileHandler(filename="../logs/url_hashing.log", encoding="utf-8")], level=logging.ERROR)

url_add_stmt = session.prepare("Insert INTO url_map (short_url, created_on, url, user) VALUES (?, toTimestamp(now()), ?, ?)")
url_get_stmt = session.prepare("SELECT url,user From url_map WHERE short_url=?")
check_short_url_stmt = session.prepare("SELECT url FROM url_map WHERE short_url=?")  # whether the url already exists or not

BASE_ALPH = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+="
BASE_LEN = 64

cache = redis.Redis(host='redis')

router = APIRouter()


@lru_cache()
def get_host_name():
    return OriginSettings()


class Host(BaseModel):
    host: str = get_host_name().host


class Url(BaseModel):
    url: str


def encoding(_id):
    if not _id:
        return BASE_ALPH[0]
    _short_url = ''
    while _id:
        _id, rem = divmod(_id, BASE_LEN)
        _short_url = BASE_ALPH[rem] + _short_url
    return _short_url


@router.post("/add_url",
             description="It'll accept a long url and save the hashed url in the database",
             tags=["url"],
             status_code=status.HTTP_201_CREATED,
             response_description="Short Url successfully created")
async def add_url(background_tasks: BackgroundTasks, raw_url: Url, _user: User = Depends(get_current_active_user)):
    _user = _user.get('username', None)

    if _user:
        _time = str(time.time_ns())  # get the current time
        hex_num = int((_user + _time).encode().hex(), 16)  # unique string consist of username+current_time

        """
        Check if a the short url already exist in DB or not.
        If exist check for the next value until its unique.
        return server Error if all possible values are checked
        """
        for tri in range(10):
            hashed_url = encoding(hex_num)[tri:7+tri]
            if session.execute(check_short_url_stmt, [hashed_url]).one():  # check if url already exists o not
                continue
            else:
                try:
                    # raw_url is pydantic model, separate the url part
                    session.execute(url_add_stmt, [hashed_url, raw_url.url, _user])
                    background_tasks.add_task(add_resolve_count, raw_url.url, hashed_url, _user)
                    return {"short_url": hashed_url}

                except Exception as e:
                    with open("../logs/db_error.log", 'a') as f:
                        f.write(str(e))
                    

        raise HTTP_500_INTERNAL_SERVER_ERROR

    raise HTTP_401_UNAUTHORIZED


@router.get("/url-stats", tags=["url"], status_code=status.HTTP_200_OK)
async def url_stats(paging_state=None, _user=Depends(get_current_active_user)):
    _user = _user.get('username', None)
    if _user:
        statement = SimpleStatement(f"SELECT * FROM resolve_count WHERE user='{_user}'", fetch_size=25)
        ps = binascii.unhexlify(paging_state) if paging_state else None  # check if paging state exists or not
        results = session.execute(statement, paging_state=ps)
        # web_session = {'paging_state': results.paging_state}
        data = []
        for stat in results.current_rows:
            data.append(
                {"url": stat.url,
                 "short_url": f"{Host().host}/{stat.short_url}",
                 "resolves": stat.resolves}
            )
        paging_state = binascii.hexlify(results.paging_state).decode() if results.paging_state else None  # fi all results are queried set paging_state as None
        return {"stats": data, "paging_state": paging_state}  # return the data and the paging state

    raise HTTP_401_UNAUTHORIZED


@router.get("/{hashed_url}", tags=["url"])
async def get_url(background_tasks: BackgroundTasks,
        hashed_url: str = Path(..., title="hashed url", description="Hashed url which is stored in the DB as key")):

    try:
        _url = cache.get(hashed_url)  # check the cache
        if not _url:
            _url = session.execute(url_get_stmt, [hashed_url])
            background_tasks.add_task(add_cache, _url[0][0], _url[0][1])  # cache the result
    except redis.exceptions.ConnectionError:  # If Redis backend is not available hit the Database
        _url = session.execute(url_get_stmt, [hashed_url])

    try:
        background_tasks.add_task(add_resolve_count, _url[0][0], hashed_url, _url[0][1])  # update the resolveCount in the background
        return RedirectResponse(url=f"{_url[0][0]}")  # Redirect to the mapped url from the DB ♥
    except IndexError or TypeError:
        raise HTTP_404_NOT_FOUND


def add_resolve_count(url:str, short_url:str, user: str):
    session.execute(f"UPDATE resolve_count SET resolves=resolves+1 WHERE user='{user}' AND url='{url}' AND short_url='{short_url}'")


def add_cache(url:str, short_url:str):
    cache.set(name=short_url, value=url)
