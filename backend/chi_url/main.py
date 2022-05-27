from functools import lru_cache
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import add_url
import delete_url
import email_verification
import session_token
import url_routing
import url_stats
import users
from config import OriginSettings

app = FastAPI(
    title='小 URL',
    description='An URL Shortener written in python',
    version='0.1',
    contact={
        "name": "CosmicOppai",
        "url": "https://github.com/Cosmicoppai/chi_url",
        "email": "comsicoppai@protonmail.com",
    },
    license_info={
        "name": "MIT",
        "url": "https://www.apache.org/licenses/LICENSE-2.0.html"
    },
    docs_url=None,
    redoc_url=None
)


@lru_cache()
def get_origin():
    return OriginSettings()


_origins = get_origin()


origin = [_origins.origin, _origins.origin2, _origins.origin3]

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
app.include_router(add_url.router)
app.include_router(url_stats.router)
app.include_router(delete_url.router)
app.include_router(url_routing.router)
