from typing import Optional

from sqlmodel import Field, SQLModel, Relationship
from typing import List


# data Models
class Feedback(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    name: Optional[str] = Field(default=None)
    message: Optional[str] = Field(default=None)
    email: str = Field(index=True, unique=True, nullable=False)
    rating: int = Field(nullable=False, default=0)
    likes: Optional[int] = Field(default=0)


# Polling Tables
class Poll(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    title: str = Field(default=None, unique=True)
    description: str = Field(default=None)
    link: str = Field(unique=True, default=None, nullable=True)
    # poll is one to many
    options: List["Options"] = Relationship(back_populates="poll")


class Options(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    poll_id: int = Field(
        foreign_key="poll.id"
    )  # specify the table and column it references
    name: str = Field(unique=True)
    value: int = Field(default=0)

    # is the many to one
    poll: Optional[Poll] = Relationship(back_populates="options")
