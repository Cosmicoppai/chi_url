from pydantic import BaseSettings


class Settings(BaseSettings):
    db_username: str
    db_password: str
    keyspace: str

    class Config:
        env_file = '.env'
        env_file_encoding = 'utf-8'


class JWT_Settings(BaseSettings):
    secret_key: str
    algorithm: str

    class Config:
        env_file = ".env"


class EmailSettings(BaseSettings):
    email: str
    email_password: str

    class Config:
        env_file = '.env'


class OriginSettings(BaseSettings):
    origin: str
    origin2: str
    host: str

    class Config:
        env_file = '.env'