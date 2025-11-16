// client/store/boardSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Tile {
  id: number;
  q: number;
  r: number;
  type: string;
  number?: number;
  is_desert: boolean;
}

interface Vertex {
  id: string;
  x: number;
  y: number;
}

interface Edge {
  id: string;
  v1: string;
  v2: string;
}

interface Robber {
  q: number;
  r: number;
}

interface BoardState {
  tiles: Tile[];
  vertices: Record<string, Vertex>;
  edges: Record<string, Edge>;
  robber?: Robber;
  hex_size_hint: number;
}

const initialState: BoardState = {
  tiles: [],
  vertices: {},
  edges: {},
  robber: undefined,
  hex_size_hint: 50
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action: PayloadAction<{ tiles: Tile[]; robber: Robber }>) {
      state.tiles = action.payload.tiles;
      state.robber = action.payload.robber;
    },
    setVerticesAndEdges(
      state,
      action: PayloadAction<{ vertices: Record<string, Vertex>; edges: Record<string, Edge> }>
    ) {
      state.vertices = action.payload.vertices;
      state.edges = action.payload.edges;
    },
  },
});

export const { setBoard, setVerticesAndEdges } = boardSlice.actions;
export default boardSlice.reducer;
