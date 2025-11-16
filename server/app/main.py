# server/main.py
from fastapi import FastAPI, Depends, Form, Query, HTTPException, Request
from fastapi.responses import JSONResponse
from typing import Optional, List
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware
from app.db.db import init_db

# from app.routers.forms import router as form_router
# from app.routers.polls import router as poll_router
# from app.routers.url_shortener import router as url_shortener_router

from app.middleware.logging import logging_middleware

from app.catan.router import router as catan_router


# from redis import q


import logging

logging.basicConfig(
    level=logging.INFO,  # Show INFO messages
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

load_dotenv()

app = FastAPI()


# CORS
origins = [
    "http://localhost:5173",  # React dev server
    "http://localhost:3000",  # if using CRA
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # or ["*"] to allow all
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE
    allow_headers=["*"],  # any headers
)

app.middleware("http")(logging_middleware)


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # fallback for uncaught exceptions
    print("Error found:", str(exc))
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "path": request.url.path,
            "method": request.method,
            "client": request.client.host,
        },
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    # Optional: log minimal info
    # logger.info(f"HTTP {exc.status_code} at {request.url.path}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )


# Create tables
# @app.on_event("startup")
# def on_startup():
init_db()


app.include_router(router=catan_router)
# app.include_router(router=poll_router)
# app.include_router(router=url_shortener_router)
