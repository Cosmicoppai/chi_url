from fastapi import APIRouter, Path, status, BackgroundTasks
import logging
from pydantic import BaseModel, EmailStr
from db import session
from session_token import get_password_hash
import email_verification
from errors import HTTP_EMAIL_ERROR,HTTP_USERNAME_ERROR

# Error log
logging.basicConfig(handlers=[logging.FileHandler(filename="../logs/main.log", encoding="utf-8")], level=logging.ERROR)
user_add_stmt = session.prepare("INSERT INTO user (user_name, disabled, email, hashed_password) VALUES (?, TRUE, ?, ?)")  # prepared statement to add user


router = APIRouter()


class User(BaseModel):
    username: str
    email: EmailStr
    password: str



@router.post("/add_user", tags=["users"], status_code=status.HTTP_201_CREATED)
async def add_user(user: User,  background_tasks:BackgroundTasks):
    exist = await check_user(user.username, user.email)
    if not exist:
        _password = get_password_hash(user.password)
        session.execute(user_add_stmt, [user.username, user.email, _password])  # replace the pre_stmt with the actual values
        background_tasks.add_task(email_verification.send_verification_code, user.username, user.email)
        return True


@router.get("/get_user/check/{username}", tags=["users"])
async def check_user(username:str = Path(..., title="username", description="username of the user"), email:str = None):  # Check if user exists or not.
    try:
        if email:
            if session.execute(f"SELECT user_name FROM user WHERE email='{email}'").one():
                raise HTTP_EMAIL_ERROR
        if session.execute(f"SELECT user_name FROM user WHERE user_name='{username}'").one():
            raise HTTP_USERNAME_ERROR
        else:
            return False
    except TypeError:
        return False