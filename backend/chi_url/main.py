from fastapi import FastAPI
import session_token, url_routing, email_verification, users
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache
from config import OriginSettings



app = FastAPI(
    title='小 URL',
    description='An URL Shortener written in python',
    version='0.1',
    contact={
        "name": "CosmicOppai",
        "url": "https://github.com/Cosmicoppai/chi_url",
        "email": "oppaiharem69@gmail.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    # docs_url=None,
    # redoc_url=None
)


@lru_cache()
def get_origin():
    return OriginSettings()


_origins = get_origin()


origin = [_origins.origin, ]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origin,
    allow_credentials=True,
    allow_headers=['*', ],
    allow_methods=['*', ]
)

app.include_router(session_token.router)
app.include_router(users.router)
app.include_router(email_verification.router)
app.include_router(url_routing.router)