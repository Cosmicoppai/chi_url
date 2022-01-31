from fastapi import status, APIRouter, Depends, BackgroundTasks
from session_token import get_current_active_user, User
import time
from pydantic import BaseModel
from db import session
import errors
import logging

logging.basicConfig(handlers=[logging.FileHandler(filename="../logs/add_url.log", encoding="utf-8")], level=logging.ERROR)

router = APIRouter()

url_add_stmt = session.prepare("Insert INTO url_map (short_url, created_on, url, user) VALUES (?, toTimestamp(now()), ?, ?)")
check_short_url_stmt = session.prepare("SELECT url FROM url_map WHERE short_url=?")  # whether the url already exists or not

BASE_ALPH = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+="
BASE_LEN = 64


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
             description="It'll accept a long url and save the hashed url in the database", tags=["url"],
             status_code=status.HTTP_201_CREATED, response_description="Short Url successfully created")
async def add_url(background_tasks: BackgroundTasks, raw_url: Url, _user: User = Depends(get_current_active_user)):
    _user = _user.get('username', None)

    if _user:
        _time = str(time.time_ns())[::-1]  # get the current time
        hex_num = int((_user + _time).encode().hex(), 16)  # unique string consist of username+current_time

        """
        Check if the short url already exist in DB or not.
        If exist check for the next value until its unique.
        return server Error if all possible values are checked
        """
        for tri in range(10):
            hashed_url = encoding(hex_num)[tri:7 + tri]
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

        raise errors.HTTP_500_INTERNAL_SERVER_ERROR

    raise errors.HTTP_401_UNAUTHORIZED


def add_resolve_count(url: str, short_url: str, user: str):
    session.execute(f"UPDATE resolve_count SET resolves=resolves+1 WHERE user='{user}' AND url='{url}' AND short_url='{short_url}'")