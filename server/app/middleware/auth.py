from fastapi import Request
from fastapi.responses import JSONResponse


async def auth_middleware(request: Request, call_next):
    token = request.headers.get("Authorization")
    if not token or token != "Bearer secret-token":
        return JSONResponse(status_code=401, content={"detail": "Unauthorized"})
    response = await call_next(request)
