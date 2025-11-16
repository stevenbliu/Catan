from sqlmodel import Field, SQLModel, Relationship
from typing import Optional, List
from models.models import Feedback


# response models
class FeedbackFilter(SQLModel):
    category: str | None = None
    sortby: Optional[str] = "ratings"
    order: Optional[str] = "desc"  # "asc" or "desc"
    # page: Optional[int] = 1
    # limit: Optional[int] = 10


class FeedbackCreate(SQLModel):
    name: str | None = None
    message: str | None = None
    email: str
    rating: int


class FeedbackUpdate(SQLModel):
    name: str | None = None
    message: str | None = None
    email: str | None = None


class PaginatedFeedback(SQLModel):
    items: List[Feedback]
    total: int
    page: int
    limit: int
    totalPages: int
