from fastapi import FastAPI
import session_token, url_hashing_algo, email_verification, users



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

app.include_router(session_token.router)
app.include_router(email_verification.router)
app.include_router(users.router)
app.include_router(url_hashing_algo.router)