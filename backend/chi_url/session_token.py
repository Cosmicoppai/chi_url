from fastapi import Depends, HTTPException, status, APIRouter
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import Optional
from passlib.context import CryptContext
from datetime import datetime, timedelta
from jose import jwt, JWTError
from config import JWT_Settings
from functools import lru_cache
from db import session  # Cassandra Database session
from errors import HTTP_401_UNAUTHORIZED


@lru_cache()
def cached_keys():
    return JWT_Settings()


_keys = cached_keys()  # Load the keys from the .env

SECRET_KEY = _keys.secret_key  # Load the secret key from env var
ALGORITHM = _keys.algorithm  # Load the hashing algo from the env var
ACCESS_TOKEN_EXPIRE_MINUTES = 10080


router = APIRouter()


class Token(BaseModel):
    access_token: str
    token_type: str


class User(BaseModel):
    username: str
    disable: Optional[bool] = False


class UserInDB(User):
    hashed_password: str


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="get_token")
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


# This func will hash the password using defined or set Algorithm
def get_password_hash(password):
    return pwd_context.hash(password)


# This func will compare the user typed password with the password stored in the database.
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)


def get_user(username: str):
    try:
        _user = session.execute(f"SELECT user_name, hashed_password, disabled From user WHERE user_name='{username}'").one()
        if _user:
            return UserInDB(username=_user[0], disable=_user[2], hashed_password=_user[1])
    except TypeError or IndexError:
        return False


# This function will verify the user credentials...
def authenticate_user(username: str, password: str):
    _user = get_user(username)
    if not _user or not verify_password(password, _user.hashed_password):
        return False
    """if not verify_password(password, _user.hashed_password):
        return False"""
    return _user


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta  # If token already exists, renew it
    else:
        expire = datetime.utcnow() + timedelta(days=7)  # else assign a new token
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=ALGORITHM)
        username: str = payload.get("sub")
        if username is None:
            raise HTTP_401_UNAUTHORIZED
    except JWTError:
        raise HTTP_401_UNAUTHORIZED
    _user = get_user(username=username)
    if _user is None:
        raise HTTP_401_UNAUTHORIZED
    return _user


async def get_current_active_user(current_user: User = Depends(get_current_user)):
    if current_user.disable:  # if disable == True(i.e user id not active then raise inactive user flag)
        raise HTTPException(status_code=403, detail="Inactive user")
    return {"username": current_user.username}


# To generate a new token after logging in
@router.post("/get_token", tags=["users"], status_code=status.HTTP_200_OK)
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    _user = authenticate_user(form_data.username, form_data.password)  # Verify the credentials
    if not _user:
        raise HTTPException(status_code=403, detail="Incorrect Username or Password", headers={"WWW-Authenticate": "Bearer"})
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    # Create an access token with data containing username of the user and the expire time of the token
    access_token = create_access_token(
        data={"sub": _user.username}, expires_delta=access_token_expires
    )
    # _user = await get_current_user(access_token)
    is_active = False if _user.disable else True
    return {"access_token": access_token, "token_type": "bearer", "is_active":is_active}
