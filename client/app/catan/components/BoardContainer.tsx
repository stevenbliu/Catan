"use client";

import React, { useState } from "react";
import Board from "./Board/Board";
import OverlayMenu from "./Overlay/OverlayMenu";
import HighlightPlacementPreview from "./Overlay/HighlightPlacementPreview";
import { BoardRenderProvider } from "../context/BoardRenderContext";
import useBoard from "../hooks/useBoard";




export default function BoardContainer() {
  const board = useBoard();

  // UI state for overlays
  const [activeVertexMenu, setActiveVertexMenu] = useState<{ id: string, x: number, y: number } | null>(null);
  const [hoveredVertex, setHoveredVertex] = useState<string | null>(null);
  const [hoveredEdge, setHoveredEdge] = useState<string | null>(null);

  if (!board.tiles.length) return null;

  const hexSizeHint = board.hex_size_hint || 50;

  // Compute bounds for scaling & centering
  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  board.tiles.forEach(tile => {
    const x = hexSizeHint * Math.sqrt(3) * (tile.q + tile.r / 2);
    const y = hexSizeHint * (3 / 2) * tile.r;
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  });

  const boardWidth = maxX - minX + hexSizeHint * 2;
  const boardHeight = maxY - minY + hexSizeHint * 2;
  const scale = Math.min(800 / boardWidth, 700 / boardHeight, 1);
  const xOffset = 800 / 2 - ((minX + maxX) / 2) * scale;
  const yOffset = 700 / 2 - ((minY + maxY) / 2) * scale;

  return (
    <BoardRenderProvider value={{ scale, xOffset, yOffset, hexSize: hexSizeHint * scale }}>
      <div style={{ position: "relative", width: 800, height: 700 }}>
        <Board
          onVertexClick={(id: string) => setActiveVertexMenu({ id: vertex.id, x: vertex.x * scale + xOffset, y: vertex.y * scale + yOffset })}
          onVertexHover={(id: string | null) => setHoveredVertex(id)}
          onEdgeHover={(id: string | null) => setHoveredEdge(id)}
        />

        {/* Overlay menus */}
        {activeVertexMenu && (
          <OverlayMenu
            targetVertex={activeVertexMenu}
            onClose={() => setActiveVertexMenu(null)}
          />
        )}

        {/* Placement highlights */}
        <HighlightPlacementPreview
          hoveredVertex={hoveredVertex}
          hoveredEdge={hoveredEdge}
        />
      </div>
    </BoardRenderProvider>
  );
}
