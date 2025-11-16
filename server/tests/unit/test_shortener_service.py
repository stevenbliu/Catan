import pytest

from services.shortener_service import base62_decode, base62_encode


def test_edge_case():
    assert base62_encode(0) == "0"


def test_encode_numbers():
    assert base62_encode(1) == "1"
    assert base62_encode(12) == "c"


def test_base62_encode_multi_digit():
    assert base62_encode(62) == "10"
    assert base62_encode(1000) == "g8"


def test_encode_negative_error():
    with pytest.raises(ValueError, match="Cannot encode negative"):
        base62_encode(-1)


def test_encode_type_error():
    with pytest.raises(TypeError, match="Expected int"):
        base62_encode("asdsa")
