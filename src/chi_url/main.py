from fastapi import FastAPI, Path, status, BackgroundTasks
import logging
from pydantic import BaseModel, EmailStr
import session_token, url_hashing_algo
from db import session
from session_token import get_password_hash
import email_verification

# Error log
logging.basicConfig(handlers=[logging.FileHandler(filename="../../logs/main.log", encoding="utf-8")], level=logging.ERROR)
user_add_stmt = session.prepare("INSERT INTO user (user_name, disabled, email, hashed_password) VALUES (?, TRUE, ?, ?)")  # prepared statement to add user

app = FastAPI()

app.include_router(session_token.router)
app.include_router(url_hashing_algo.router)
app.include_router(email_verification.router)


class User(BaseModel):
    username: str
    email: EmailStr
    password: str


@app.get("/", tags=["home"])
async def home():
    return {"message": "yo yo"}


@app.post("/add_user", tags=["users"], status_code=status.HTTP_201_CREATED)
async def add_user(user: User,  background_tasks:BackgroundTasks):
    exist = await check_user(user.username)
    if not exist:
        _password = get_password_hash(user.password)
        session.execute(user_add_stmt, [user.username, user.email, _password])  # replace the pre_stmt with the actual values
        background_tasks.add_task(email_verification.send_verification_code, user.username, user.email)

        return True
    return False


@app.get("/get_user/check/{username}", tags=["users"])
async def check_user(username:str = Path(..., title="username", description="username of the user")):  # Check if user exists or not.
    try:
        if session.execute(f"SELECT user_name FROM user WHERE user_name='{username}'").one()[0] == username:
            return True
        return False
    except Exception as e:
        print(f"Exception {e}")