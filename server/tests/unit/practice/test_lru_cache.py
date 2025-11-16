import pytest
from practice.lru_cache import LRUCache
from unittest.mock import patch, MagicMock


@pytest.fixture
def small_cache():
    c = LRUCache(2)
    c.put("a", 1)
    c.put("b", 2)
    return c


def test_basic_put_get(small_cache):
    c = small_cache
    assert c.get(1) is None
    c.put(1, 1)
    assert c.get(1) == 1
    c.put(2, 2)
    assert c.get(2) == 2


@pytest.mark.parametrize(
    "inp,expected",
    [
        ([1, 2, 3], 6),
        ([0], 0),
        ([], 0),
    ],
)
def test_basic_put_get(inp, expected):
    c = LRUCache(4)
    assert c.get(1) is None

    for i in inp:
        c.put(i, i)
        assert c.get(i) == i


@patch("practice.lru_cache.LRUCache.put", return_value=50, name="mock_put")
@patch("practice.lru_cache.LRUCache.get", return_value=32, name="mock_get")
def test_get_and_put_mocked(mock_get, mock_put):  # without name, order is reversed.
    c = LRUCache(4)

    result_put = c.put(123)
    result_get = c.get("abc")

    error_message = "thi is wrong"

    assert result_put == 50, error_message
    assert result_get == 32

    mock_put.assert_called_once_with(123)
    mock_get.assert_called_once_with("abc")


def test_invalid_lru_capacity():
    from practice.lru_cache import LRUCache

    with pytest.raises(AssertionError) as exc:
        LRUCache(0)  # capacity must be > 0
    assert str(exc.value) == "capacity must be > 0"


def test_eviction_order():
    c = LRUCache(2)
    c.put("a", 1)
    c.put("b", 2)
    # access a to make it recently used
    assert c.get("a") == 1
    # insert c, should evict b
    c.put("c", 3)
    assert c.get("b") is None
    assert c.get("a") == 1
    assert c.get("c") == 3


def test_overwrite_value():
    c = LRUCache(1)
    c.put(1, 10)
    c.put(1, 20)
    assert c.get(1) == 20


def test_capacity_one_eviction():
    c = LRUCache(1)
    c.put(1, "x")
    c.put(2, "y")
    assert c.get(1) is None
    assert c.get(2) == "y"
