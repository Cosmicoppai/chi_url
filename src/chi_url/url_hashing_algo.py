import logging
import time
from fastapi import HTTPException, status, APIRouter, Path, Depends, BackgroundTasks
from pydantic import BaseModel
from starlette.responses import RedirectResponse
from db import session
from session_token import get_current_user, User

logging.basicConfig(handlers=[logging.FileHandler(filename="../../logs/url_hashing.log", encoding="utf-8")], level=logging.ERROR)

url_add_stmt = session.prepare("Insert INTO url_map (short_url, created_on, url, user) VALUES (?, toTimestamp(now()), ?, ?)")
url_get_stmt = session.prepare("SELECT url,user From url_map WHERE short_url=?")
check_short_url_stmt = session.prepare("SELECT url FROM url_map WHERE short_url=?")  # whether the url already exists or not

BASE_ALPH = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz+="
BASE_LEN = 64

router = APIRouter()


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
async def add_url(background_tasks: BackgroundTasks, raw_url: Url, _user: User = Depends(get_current_user)):
    _user = _user.username

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
            if session.execute(check_short_url_stmt, [hashed_url]).one():
                continue
            else:
                try:
                    session.execute(check_short_url_stmt, [hashed_url])
                    # raw_url is pydantic model, therefore the only url part is seperated from the key
                    session.execute(url_add_stmt, [hashed_url, raw_url.url, _user])
                    background_tasks.add_task(add_resolve_count, raw_url, hashed_url, _user)
                    return {"short url": hashed_url}

                except Exception as e:
                    with open("../../logs/db_error.log", 'a') as f:
                        f.write(str(e))

            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": 'Bearer'}
            )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Try again Later"
        )


@router.get("/{hashed_url}", tags=["url"])
async def get_url(background_tasks: BackgroundTasks,
        hashed_url: str = Path(..., title="hashed url", description="Hashed url which is stored in the DB as key")):

    _url = session.execute(url_get_stmt, [hashed_url]).one()
    try:
        background_tasks.add_task(add_resolve_count, _url[0], hashed_url, _url[1])  # update the resolveCount in the background
        return RedirectResponse(url=f"{_url[0]}")  # Redirect to the mapped url from the DB♥
    except IndexError or TypeError:
        raise HTTPException(status_code=404, detail="Url not Found")


def add_resolve_count(url:str, short_url:str, user: str):
    print(short_url, user, url)
    session.execute(f"UPDATE resolve_count SET resolves=resolves+1 WHERE user='{user}' AND url='{url}' AND short_url='{short_url}'")