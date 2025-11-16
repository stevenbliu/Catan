from typing import Optional
from typing import Optional


class Node:
    __slots__ = ("key", "val", "prev", "next")

    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None


class LRUCache:
    def __init__(self, capacity: int):
        assert capacity > 0, "capacity must be > 0"
        self.capacity = capacity
        self.map = {}  # key -> Node
        # dummy head/tail
        self.head = Node(None, None)
        self.tail = Node(None, None)
        self.head.next = self.tail
        self.tail.prev = self.head

    def _remove(self, node: Node) -> None:
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def _add_to_head(self, node: Node) -> None:
        node.next = self.head.next
        node.prev = self.head
        self.head.next.prev = node
        self.head.next = node

    def get(self, key) -> Optional[int]:
        node = self.map.get(key)
        if not node:
            return None
        # move to head
        self._remove(node)
        self._add_to_head(node)
        return node.val

    def put(self, key, value) -> None:
        if key in self.map:
            node = self.map[key]
            node.val = value
            self._remove(node)
            self._add_to_head(node)
            return
        if len(self.map) >= self.capacity:
            # evict tail.prev
            to_remove = self.tail.prev
            self._remove(to_remove)
            del self.map[to_remove.key]
        node = Node(key, value)
        self._add_to_head(node)
        self.map[key] = node
