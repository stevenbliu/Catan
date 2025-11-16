import heapq


class TopK:
    def __init__(self):
        self.word_counts = {}

    def add(self, word: str):
        word_count = self.word_counts.get(word, 0) + 1
        self.word_counts[word] = word_count

    def top(self, k: int):
        heap = []

        for word, count in self.word_counts.items():
            if len(heap) < k:
                heapq.heappush(heap, (count, word))
            else:
                top = heap[0]
                if count > top[0]:
                    heapq.heappop(heap)
                    heapq.heappush(heap, (count, word))

        result = sorted(heap, key=lambda x: (-x[0], x[1]))
        return [word for freq, word in result]
