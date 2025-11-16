from models.url_shortener import ShortURL

# from schemas.poll import PollCreate

from db.utils import handle_db_exceptions
from fastapi import Form, Depends, HTTPException

# from fastapi.responses import

# from fastapi import Depends, Query
from typing import Optional
from sqlmodel import Session, select
from sqlalchemy import func
from redis import q


def get_record_by_id(id: int, session: Session):
    try:
        record = session.get(ShortURL, id)

        if record is None:
            raise HTTPException(status_code=404, detail="Short code not found")

        return record
    except Exception as e:
        raise e


def get_url_by_short_code(
    short_code: str, session: Session, lock: bool = False
) -> ShortURL:
    """
    Fetch ShortURL by short_code. Optionally locks the row for update if updating later.
    """

    stmt = select(ShortURL).where(ShortURL.short_code == short_code)
    if lock:
        stmt = stmt.with_for_update()

    record = session.exec(stmt).first()

    if record is None:
        raise HTTPException(status_code=404, detail="Short code not found")

    return record


def update_record_by_id(id: int, update: dict, session: Session):
    try:
        record = get_record_by_id(id, session)

        for key, val in update:
            setattr(record, key, val)

        session.commit()
        session.refresh(record)

    except Exception as e:
        session.rollback()
        raise e


def create_record(shortURL: ShortURL, session: Session):
    try:
        shortURL = ShortURL.model_validate(shortURL)
        session.add(shortURL)
        session.commit()
        session.refresh(shortURL)
        return shortURL
    except Exception as e:
        session.rollback()
        raise e
