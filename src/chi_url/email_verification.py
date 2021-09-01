import ssl, random, smtplib
from db import session
from fastapi import status, APIRouter, HTTPException
from datetime import timedelta, datetime
from pydantic import EmailStr
from session_token import SECRET_KEY, ALGORITHM
from jose import jwt
from email.header import Header
from email.utils import formataddr
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import EmailSettings
from functools import lru_cache

router = APIRouter()


@lru_cache()
def email_cred():
    return EmailSettings()


_cred = email_cred()

_email_address = _cred.email
_password = _cred.password


def create_email_verification_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({'exp': expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def send_verification_code(user: str, user_email:EmailStr):
    verification_code = random.randrange(100000, 1000000)
    verification_token = create_email_verification_token(data={'user':user, "verification_code": verification_code})
    mail_sent_status = send_email(token=verification_token, user=user, user_email=user_email)  # send the mail
    session.execute(f"UPDATE user SET verification_code='{verification_code}' WHERE user_name='{user}';")  # update the verification code in the database
    await mail_sent_status  # await for the status

    return {"status":status.HTTP_200_OK, "message":"Email Sent"}



async def send_email(token:str, user:str, user_email:EmailStr):
    context = ssl.create_default_context()
    message = MIMEMultipart('alternative')
    with smtplib.SMTP_SSL('smtp.gmail.com', 587, context=context) as server:
        server.login(_email_address, _password)

    message['Subject'] = 'Verify Email'
    message['From'] = formataddr(str(Header('小 URL', 'utf-8')), _email_address)
    message['To'] = user_email

    html = f"""
    <h2>Thanks {user} for signing up</h2>
    <p>Verify Your email</p>
    <a href="http://localhost/{token}">Verify</a>
    """
    message.attach(MIMEText(html, 'html'))
    server.send(message)



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