# tests/integration/test_shortener_api.py
import pytest
from fastapi.testclient import TestClient
from sqlmodel import Session, SQLModel, create_engine
from sqlmodel.pool import StaticPool
from sqlalchemy import select, text

from main import app  # Your FastAPI app
from db.db import get_session
from models.url_shortener import ShortURLCreate, ShortURL


@pytest.fixture(name="session")
def session_fixture():
    """Create in-memory test database"""
    engine = create_engine(
        "sqlite:///:memory:",
        connect_args={"check_same_thread": False},
        poolclass=StaticPool,
    )
    SQLModel.metadata.create_all(engine)

    with Session(engine) as session:
        yield session


@pytest.fixture(name="client")
def client_fixture(session: Session):
    """Create test client with test database"""

    def get_session_override():
        return session

    app.dependency_overrides[get_session] = get_session_override
    client = TestClient(app, base_url="http://testserver/url_shortener")
    yield client
    app.dependency_overrides.clear()


def test_create_short_url(client: TestClient):
    """Test POST /url_shortener creates a short URL"""
    response = client.post(
        "/",
        json={"original_url": "https://example.com/very/long/url", "user_id": 1},
    )

    assert response.status_code == 200
    data = response.json()

    assert "short_code" in data
    assert "id" in data
    assert data["original_url"] == "https://example.com/very/long/url"
    assert len(data["short_code"]) > 0  # Should have a short code


def test_redirect_short_url(client: TestClient, session: Session):
    """Test GET /{short_code} redirects to original URL"""
    # First, create a short URL
    create_response = client.post(
        "/", json={"original_url": "https://example.com/test", "user_id": 1}
    )

    print(create_response)
    short_code = create_response.json()["short_code"]

    # Then, access the short URL
    response = client.get(f"/{short_code}")

    assert response.status_code == 200
    data = response.json()
    assert data["original_url"] == "https://example.com/test"

    # Verify click count was incremented
    # stmt = select(ShortURL).where(ShortURL.short_code == short_code)
    # url_record = session.exec(stmt).first()
    assert data["click_count"] == 1


def test_redirect_nonexistent_short_url(client: TestClient):
    """Test GET /{short_code} returns 404 for invalid code"""
    response = client.get("/nonexistent")
    assert response.status_code == 404


def test_multiple_urls_get_unique_codes(client: TestClient):
    """Test that multiple URLs get different short codes"""
    response1 = client.post(
        "/", json={"original_url": "https://example.com/1", "user_id": 1}
    )
    response2 = client.post(
        "/", json={"original_url": "https://example.com/2", "user_id": 1}
    )

    code1 = response1.json()["short_code"]
    code2 = response2.json()["short_code"]

    assert code1 != code2


def test_click_count_increments(client: TestClient, session: Session):
    """Test that click count increments on each access"""
    # Create URL
    create_response = client.post(
        "/", json={"original_url": "https://example.com", "user_id": 1}
    )
    short_code = create_response.json()["short_code"]

    # Access it multiple times
    for _ in range(3):
        get_response = client.get(f"/{short_code}")

    # Check click count

    assert get_response.json()["click_count"] == 3
