# from sqlalchemy
from models.models import Feedback

from schemas.form import FeedbackFilter, FeedbackUpdate, FeedbackCreate

from db.utils import handle_db_exceptions
from fastapi import Form, Depends

# from fastapi import Depends, Query
from typing import Optional
from sqlmodel import Session, select
from sqlalchemy import func
from redis import q


def get_feedback_page(filter: FeedbackFilter, session: Session, page: int, limit: int):
    # Base query
    stmt = select(Feedback)

    # Apply filters
    # if filter.status:
    #     stmt = stmt.where(Feedback.status == filter.status)
    # if getattr(filter, "category", None):
    #     stmt = stmt.where(Feedback.category == filter.category)

    # Apply sorting
    allowed_sort_fields = {
        "rating": Feedback.rating,
        # "date": Feedback.created_at,
        "id": Feedback.id,
    }

    # Default to Feedback.rating if invalid
    sort_field = allowed_sort_fields.get(filter.sortby, Feedback.rating)

    # Apply order (default descending)
    if getattr(filter, "order", "desc").lower() == "asc":
        stmt = stmt.order_by(sort_field.asc())
    else:
        stmt = stmt.order_by(sort_field.desc())

    # Count total items efficiently
    total_stmt = select(func.count()).select_from(stmt.subquery())
    total = session.exec(total_stmt).one()

    # Pagination
    offset = (page - 1) * limit
    items = session.exec(stmt.offset(offset).limit(limit)).all()

    return items, total


@handle_db_exceptions
def update_feedback_by_id(
    feedback_id: int, feedback_update: FeedbackUpdate, session: Session
):
    try:
        feedback = session.get(Feedback, feedback_id)
        if not feedback:
            return None

        update_data = feedback_update.dict(exclude_unset=True)
        for key, val in update_data.items():
            setattr(feedback, key, val)

        session.commit()
        session.refresh(feedback)
        return feedback
    except Exception as e:
        session.rollback()
        raise e


@handle_db_exceptions
def add_feedback(
    feedback: FeedbackCreate,
    session: Session,
):
    try:
        print(q)
        q.append(10)

        feedback = Feedback.model_validate(feedback)
        session.add(feedback)
        session.commit()
        session.refresh(feedback)
        return feedback
    except Exception as e:
        session.rollback()
        raise e


@handle_db_exceptions
def remove_feedback(feedback: Feedback, session: Session):
    try:
        # Optional: save a copy to return
        # deleted_feedback = Feedback(
        #     id=feedback.id,
        #     name=feedback.name,
        #     message=feedback.message,
        #     email=feedback.email,
        #     # likes=feedback.likes,
        # )

        session.delete(feedback)
        session.commit()

        # return deleted_feedback  # returns object snapshot before deletion
    except Exception as e:
        session.rollback()
        raise e
