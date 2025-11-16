# middleware/logging_middleware.py
import time
import logging
from fastapi import Request

logger = logging.getLogger(__name__)


async def logging_middleware(request: Request, call_next):
    start_time = time.time()

    # Log incoming request
    logger.info(f"Incoming request: {request.method} {request.url}")

    # Process request
    response = await call_next(request)

    # Log response
    process_time = time.time() - start_time
    logger.info(
        f"Completed: {request.method} {request.url} "
        f"Status: {response.status_code} "
        f"Duration: {process_time:.2f}s"
    )

    return response
