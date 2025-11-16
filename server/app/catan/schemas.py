from sqlmodel import SQLModel
from typing import Optional, List, Dict, Any


class TileOut(SQLModel):
    id: int
    type: str
    q: int
    r: int
    number: Optional[int]  # None for desert
    is_desert: bool


class BoardOut(SQLModel):
    tiles: List[TileOut]
    ports: List[Dict[str, Any]]
    robber: Dict[str, int]  # axial coord of robber tile
    hex_size_hint: float = 60.0
    orientation: str = "pointy"  # or "flat"
