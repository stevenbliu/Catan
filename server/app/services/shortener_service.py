import logging

logger = logging.getLogger(__name__)


def base62_encode(num: int) -> str:
    """Convert number to base62"""
    logging.info(f"bas52 encode {num}")
    try:
        if not isinstance(num, int):
            raise TypeError(f"Expected int, got {type(num).__name__}")

        if num < 0:
            raise ValueError(f"Cannot encode negative number: {num}")

        if num == 0:
            return "0"

        chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
        result = []

        while num > 0:
            result.append(chars[num % 62])
            num = num // 62

        return "".join(reversed(result))
    except Exception as e:
        logging.error(Exception)
        raise e


def base62_decode(code: str) -> int:
    """Convert base62 to number"""
    chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    num = 0
    for char in code:
        num = num * 62 + chars.index(char)
    return num
