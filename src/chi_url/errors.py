from fastapi import HTTPException
from starlette import status

HTTP_400_BAD_REQUEST = HTTPException(
        status_code=status.HTTP_400_BAD_REQUEST,
        detail="username already exists, please choose a different username"
    )


HTTP_401_UNAUTHORIZED = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": 'Bearer'}
    )

HTTP_404_NOT_FOUND = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page Not Found"
        )

HTTP_500_INTERNAL_SERVER_ERROR = HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Try again Later"
        )