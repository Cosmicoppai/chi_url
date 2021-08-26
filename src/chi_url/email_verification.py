import random
from db import session
from fastapi import status, APIRouter, HTTPException, BackgroundTasks
from datetime import timedelta, datetime
from pydantic import EmailStr
from session_token import SECRET_KEY, ALGORITHM
from jose import jwt

router = APIRouter()


def create_email_verification_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def send_verification_code(user: str, user_email:EmailStr, background_tasks:BackgroundTasks):
    verification_code = random.randrange(100000, 1000000)
    session.execute(f"UPDATE user SET verification_code='{verification_code}' WHERE user_name='{user}';")
    verification_token = create_email_verification_token(data={'user':user, "verification_code": verification_code})
    background_tasks.add_task(send_email, token=verification_token, user=user, email=user_email)

    return {"status":status.HTTP_200_OK, "message":"Email Sent"}



def send_email(token:str, user:str, email:EmailStr):
    pass



@router.get('/verify/', tags=["users"])
async def verify_acc(token):
    """
    Payload Format
    {'user': 'user', 'verification_code': 3000, 'exp': 1587960}  :- Demo Data
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, ALGORITHM)
    except jwt.ExpiredSignatureError:  # check if token expired or not
        return HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page Not Found"
        )
    _user: str = payload.get('user')  # get the username from the token
    verification_code_from_jwt: str = payload.get('verification_code')  # get the verification code
    _verification_code = session.execute(f"SELECT verification_code FROM user WHERE user_name='{_user}'").one()[0]  # get the verification code from the database

    if verification_code_from_jwt == int(_verification_code):  # check if both tokens are same or not
        session.execute(f"UPDATE user SET disabled=FALSE WHERE user_name='{_user}'")  # Activate the user
        return {"status": status.HTTP_201_CREATED, "message": "Email Successfully verified"}

    return {"status":status.HTTP_400_BAD_REQUEST, "message":"Verification code not valid"}