import pytest
from practice.top_k_frequent import TopK


def test_top_k_basic():
    tk = TopK()
    tk.add("apple")
    tk.add("banana")
    tk.add("apple")
    assert tk.top(2) == ["apple", "banana"]


def test_top_k_tie_breaking():
    tk = TopK()
    tk.add("apple")
    tk.add("banana")
    tk.add("apple")
    tk.add("banana")
    tk.add("cherry")
    # apple and banana both freq=2 → alphabetical order
    assert tk.top(2) == ["apple", "banana"]


def test_top_k_less_than_k():
    tk = TopK()
    tk.add("apple")
    assert tk.top(5) == ["apple"]  # k > number of words
