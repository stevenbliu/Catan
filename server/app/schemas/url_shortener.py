from pydantic import HttpUrl
from sqlmodel import SQLModel


class ShortURLRequest(SQLModel):
    original_url: HttpUrl  # Validates URL format
    user_id: int


class ShortURLResponse(SQLModel):
    id: int
    short_code: str
    original_url: str
    # short_url: str
