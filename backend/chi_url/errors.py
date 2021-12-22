from fastapi import HTTPException
from starlette import status

HTTP_USERNAME_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Username already exists."
    )


HTTP_EMAIL_ERROR = HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Email already exists."
    )

HTTP_401_UNAUTHORIZED = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": 'Bearer'}
    )

HTTP_401_EXPIRED_JWT = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token Expired",
    )

HTTP_404_NOT_FOUND = HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Page Not Found"
        )

HTTP_500_INTERNAL_SERVER_ERROR = HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Try again Later"
        )