from fastapi import APIRouter, HTTPException, Form, Depends, Request, Query, status
from app.models.models import (
    Feedback,
)

from app.schemas.form import (
    FeedbackFilter,
    FeedbackUpdate,
    PaginatedFeedback,
    FeedbackCreate,
)

from app.crud.form import (
    get_feedback_page,
    update_feedback_by_id,
    add_feedback,
    remove_feedback,
)
from typing import List
from sqlmodel import Session
from db.db import get_session
from redis import q

router = APIRouter(prefix="/feedback")


# Routes
@router.get("", response_model=PaginatedFeedback)
def get_feedback_endpoint(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1),
    filter: FeedbackFilter = Depends(),
    session: Session = Depends(get_session),
):
    items, total = get_feedback_page(filter, session, page, limit)

    total_pages = (total + limit - 1) // limit
    return {
        "items": items,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": total_pages,
    }


@router.get("/{feedback_id}", response_model=Feedback)
def get_feedback_by_id(feedback_id: int, session: Session = Depends(get_session)):
    feedback: Feedback = session.get(Feedback, feedback_id)
    if not feedback:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback


@router.put("/{feedback_id}", response_model=Feedback)
def update_feedback_by_id_endpoint(
    feedback_id: int,
    feedbackUpdate: FeedbackUpdate,
    session: Session = Depends(get_session),
):
    feedback = update_feedback_by_id(feedback_id, feedbackUpdate, session)
    if feedback is None:
        raise HTTPException(status_code=404, detail="Feedback not found")
    return feedback


@router.patch("/{feedback_id}/like", response_model=Feedback)
def like_feedback(id: int, session: Session = Depends(get_session)):
    feedback = get_feedback_by_id(id, session)
    feedback.likes += 1
    res = add_feedback(feedback, session)
    return res


@router.post("", response_model=Feedback, status_code=status.HTTP_201_CREATED)
def add_feedback_endpoint(
    feedback: FeedbackCreate,
    session: Session = Depends(get_session),
):
    print(q)
    res = add_feedback(feedback, session)
    return res


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_feedback_endpoint(
    id: int,
    session: Session = Depends(get_session),
):
    feedback = get_feedback_by_id(id, session)
    remove_feedback(feedback, session)
    return
