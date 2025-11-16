from sqlmodel import Field, SQLModel, Relationship


# Polling Schemas
class PollCreate(SQLModel):
    title: str
    description: str


# class PollResponse(SQLModel):
# poll_id: int
# name: str


class OptionCreate(SQLModel):
    poll_id: int
    name: str
