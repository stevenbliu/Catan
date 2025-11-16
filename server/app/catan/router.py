from fastapi import APIRouter, HTTPException, Form, Depends, Request, Query, status
from app.catan.logic.utils import generate_axial_coords
from app.catan.schemas import BoardOut, TileOut
import random
import math
from typing import List, Optional, Dict, Any

import logging

logger = logging.getLogger(__name__)

# --- Standard tile distribution (classic Settlers) ---
DEFAULT_TILES = (
    ["wood"] * 4
    + ["sheep"] * 4
    + ["wheat"] * 4
    + ["brick"] * 3
    + ["ore"] * 3
    + ["desert"] * 1
)

# --- Number tokens (ex desert) laid out randomly but from the classic set ---
NUMBER_TOKENS = [2, 3, 3, 4, 4, 5, 5, 6, 6, 8, 8, 9, 9, 10, 10, 11, 11, 12]

# Optional default ports (approximate positions by axial coords + port type)
# This is a simplified mapping — adjust as you like.
DEFAULT_PORTS = [
    {"type": "3:1", "q": -2, "r": 0},
    {"type": "3:1", "q": -1, "r": 2},
    {"type": "2:1-wood", "q": 1, "r": -2},
    {"type": "2:1-brick", "q": 2, "r": -1},
    {"type": "2:1-ore", "q": 0, "r": -2},
    {"type": "3:1", "q": 2, "r": 0},
    {"type": "2:1-sheep", "q": -2, "r": 1},
    {"type": "3:1", "q": 0, "r": 2},
    {"type": "2:1-wheat", "q": 1, "r": 1},
]

router = APIRouter(prefix="/catan")


@router.get("/board", response_model=BoardOut)
def get_board(
    seed: Optional[int] = Query(
        None, description="Optional seed for deterministic board"
    )
):
    """
    Return a Catan board layout using axial coordinates (q, r).
    If `seed` is given the layout is deterministic.
    """
    rng = random.Random(seed)

    axial = generate_axial_coords(radius=2)  # 19 coords for standard Catan
    if len(axial) != 19:
        raise RuntimeError("Expected 19 tiles for radius 2 board")

    # Shuffle tiles and assign to coords
    tiles_pool = DEFAULT_TILES.copy()
    rng.shuffle(tiles_pool)

    # Shuffle number tokens (skip the desert tile)
    tokens = NUMBER_TOKENS.copy()
    rng.shuffle(tokens)

    tiles_out = []
    token_idx = 0
    desert_tile_id = None

    for i, coord in enumerate(axial):
        ttype = tiles_pool[i]
        is_desert = ttype == "desert"
        number = None
        if not is_desert:
            number = tokens[token_idx]
            token_idx += 1
        else:
            desert_tile_id = i

        tiles_out.append(
            TileOut(
                id=i,
                type=ttype,
                q=coord["q"],
                r=coord["r"],
                number=number,
                is_desert=is_desert,
            )
        )

    # place robber on desert (if desert exists), else on center tile (q=0,r=0)
    if desert_tile_id is not None:
        robber_tile = {
            "q": tiles_out[desert_tile_id].q,
            "r": tiles_out[desert_tile_id].r,
        }
    else:
        # find center
        center = next((t for t in tiles_out if t.q == 0 and t.r == 0), tiles_out[0])
        robber_tile = {"q": center.q, "r": center.r}

    board = BoardOut(
        tiles=tiles_out,
        ports=DEFAULT_PORTS,
        robber=robber_tile,
        hex_size_hint=70.0,
        orientation="pointy",
    )

    logger.info(len(board.tiles))
    assert len(board.tiles) == 19

    return board
