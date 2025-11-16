// client/app/catan/hooks/useBoard.ts
"use client";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { setBoard, setVerticesAndEdges } from "../../../store/boardSlice";
import { computeVerticesAndEdges } from "../utils/hex";

export default function useBoard() {
  const dispatch = useDispatch();
  const board = useSelector((state: RootState) => state.board);
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch the full board state
  async function fetchBoard() {
    const res = await fetch("http://localhost:8000/catan/board");
    const data = await res.json();

    dispatch(setBoard({ tiles: data.tiles, robber: data.robber }));

    const { vertices, edges } = computeVerticesAndEdges(data.tiles, 50);
    dispatch(setVerticesAndEdges({ vertices, edges }));
  }

  useEffect(() => {
    // Initial load
    fetchBoard();

    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:8000/catan/ws");
    wsRef.current = ws;

    ws.onopen = () => console.log("[WS] Connected to server");

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.event === "board_updated") {
          console.log("[WS] Board updated → refetching");
          fetchBoard();
        }
      } catch (e) {
        console.error("[WS] Bad message:", e);
      }
    };

    ws.onclose = () => console.log("[WS] Disconnected");

    // Cleanup on unmount
    return () => {
      ws.close();
    };
  }, [dispatch]);

  return board;
}
