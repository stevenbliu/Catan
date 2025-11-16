from sqlmodel import SQLModel, Field, Session, create_engine, select
from sqlalchemy.orm import sessionmaker

import os

# Database setup
db_url = os.getenv("DATABASE_URL", "sqlite:///./app.db")
engine = create_engine(
    db_url,
    echo=False,
    pool_size=10,  # number of persistent connections
    max_overflow=20,  # extra connections if needed
    pool_pre_ping=True,  # ensures connections are alive
)

SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

Base = SQLModel


# Dependency
def get_session():
    with Session(engine) as session:
        yield session


def init_db():
    SQLModel.metadata.drop_all(engine)  # Drop all tables (WARNING: deletes all data)

    SQLModel.metadata.create_all(engine)
