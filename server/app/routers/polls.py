from fastapi import APIRouter, HTTPException, Form, Depends, Request, Query, status
from schemas.poll import (
    PollCreate,
)

from crud.poll import get_polls, add_poll

from typing import List
from sqlmodel import Session
from db.db import get_session
from redis import q

router = APIRouter(prefix="/poll")
# route_name = "poll"


# Routes
@router.get("/")
def get_polls_endpoint(
    session: Session = Depends(get_session),
):

    return get_polls(session)


# @router.get("/feedback/{feedback_id}", response_model=Feedback)
# def get_feedback_by_id(feedback_id: int, session: Session = Depends(get_session)):
#     feedback: Feedback = session.get(Feedback, feedback_id)
#     if not feedback:
#         raise HTTPException(status_code=404, detail="Feedback not found")
#     return feedback


# @router.put("/feedback/{feedback_id}", response_model=Feedback)
# def update_feedback_by_id_endpoint(
#     feedback_id: int,
#     feedbackUpdate: FeedbackUpdate,
#     session: Session = Depends(get_session),
# ):
#     feedback = update_feedback_by_id(feedback_id, feedbackUpdate, session)
#     if feedback is None:
#         raise HTTPException(status_code=404, detail="Feedback not found")
#     return feedback


# @router.patch("/feedback/{feedback_id}/like", response_model=Feedback)
# def like_feedback(id: int, session: Session = Depends(get_session)):
#     feedback = get_feedback_by_id(id, session)
#     feedback.likes += 1
#     res = add_feedback(feedback, session)
#     return res


@router.post("/", response_model=PollCreate, status_code=status.HTTP_201_CREATED)
def add_poll_endpoint(
    poll: PollCreate,
    session: Session = Depends(get_session),
):
    res = add_poll(poll, session)
    return res


# @router.delete("/feedback/{id}", status_code=status.HTTP_204_NO_CONTENT)
# def remove_feedback_endpoint(
#     id: int,
#     session: Session = Depends(get_session),
# ):
#     feedback = get_feedback_by_id(id, session)
#     remove_feedback(feedback, session)
#     return
