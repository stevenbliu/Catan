from fastapi import HTTPException
from sqlalchemy.exc import IntegrityError, NoResultFound, DataError


def handle_db_exceptions(func):
    """
    Wraps a CRUD function and maps known DB exceptions to HTTPException.
    """

    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except IntegrityError as e:
            msg = str(e.orig)  # underlying DB message
            if "UNIQUE constraint failed: feedback.email" in msg:
                raise HTTPException(status_code=400, detail="Email already exists")
            raise HTTPException(status_code=400, detail="Database integrity error")
        except NoResultFound:
            raise HTTPException(status_code=404, detail="Item not found")
        except DataError:
            raise HTTPException(status_code=400, detail="Invalid data provided")

    return wrapper
