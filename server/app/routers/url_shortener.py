from fastapi import APIRouter, HTTPException, Form, Depends, Request, Query, status

import logging

logger = logging.getLogger(__name__)

from crud.url_shortener import (
    get_record_by_id,
    update_record_by_id,
    create_record,
    get_url_by_short_code,
)
from services.shortener_service import base62_encode, base62_decode

from models.url_shortener import ShortURL
from schemas.url_shortener import ShortURLRequest, ShortURLResponse

from typing import List
from sqlmodel import Session
from db.db import get_session
from redis import q

router = APIRouter(prefix="/url_shortener")
# route_name = "poll"


@router.post("/", response_model=ShortURLResponse)
def post_url(body: ShortURLRequest, session: Session = Depends(get_session)):
    logging.info(str(body))
    try:
        createRecord = ShortURL(
            user_id=body.user_id,
            original_url=str(body.original_url),
        )
        record = create_record(createRecord, session)
        short_code = base62_encode(record.id)

        record.short_code = short_code
        session.commit()
        session.refresh(record)

        logging.info(record.model_dump_json())
        return record
    except Exception as e:
        session.rollback()
        logger.info(f"excp {e}")
        raise e


@router.get("/{short_code}")
def get_url(short_code: str, session: Session = Depends(get_session)):
    logging.info(f"Fetching URL {short_code}", extra={"short_code": short_code})
    try:
        # Fetch record with row-level lock to safely increment click_count
        record = get_url_by_short_code(short_code, session, lock=True)

        # Increment counter

        record.click_count += 1
        session.commit()
        session.refresh(record)

        # logging.info("Updated record", extra={"record": record})
        return record

    except HTTPException:
        # 404 already handled in helper
        raise
    except Exception as e:
        session.rollback()
        logging.exception(f"Exception fetching URL for short_code={short_code}")
        raise HTTPException(status_code=500, detail="Internal server error")
