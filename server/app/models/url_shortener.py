from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime


class ShortURL(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field()
    original_url: str = Field()
    short_code: Optional[str] = Field(index=True, unique=True, default="")
    click_count: Optional[int] = Field(default=0)
    created_at: Optional[datetime] = Field(default_factory=datetime.now)


class ShortURLCreate(SQLModel):
    user_id: int = Field()
    original_url: str = Field()
