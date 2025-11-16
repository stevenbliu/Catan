// client/app/catan/Board.tsx
"use client";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";
import { HexTile } from "./HexTile";
import { VertexCircle } from "./VertexCircle";
import { EdgeLine } from "./EdgeLine";
import { RobberCircle } from "./RobberCircle";
import { BoardRenderProvider } from "../../context/BoardRenderContext";
import { ActiveElementProvider } from "../../context/ActiveElementContext";

import useBoard from '../../hooks/useBoard'

const SVG_WIDTH = 800;
const SVG_HEIGHT = 700;

interface BoardProps {
  onVertexClick: (id: string) => void;
  onVertexHover: (id: string | null) => void;
  onEdgeHover: (id: string | null) => void;
}

export default function Board({ onVertexClick, onVertexHover, onEdgeHover }: BoardProps) {
  // const board = useSelector((state: RootState) => state.board);
  const board = useBoard();

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
  const scale = Math.min(SVG_WIDTH / boardWidth, SVG_HEIGHT / boardHeight, 1);
  const xOffset = SVG_WIDTH / 2 - ((minX + maxX) / 2) * scale;
  const yOffset = SVG_HEIGHT / 2 - ((minY + maxY) / 2) * scale;

  return (
    <div className="bg-blue-500 flex flex-col items-center justify-center">

      <BoardRenderProvider value={{ scale, xOffset, yOffset, hexSize: hexSizeHint * scale }}>
        <ActiveElementProvider>
          <svg width={SVG_WIDTH} height={SVG_HEIGHT}>
            {board.tiles.map(tile => (
              <HexTile key={tile.id} tile={tile} />
            ))}

            {Object.values(board.edges).map(e => (
              <EdgeLine key={e.id} edge={e} vertices={board.vertices} />
            ))}

            {Object.values(board.vertices).map(v => (
              <VertexCircle
                key={v.id}
                vertex={v}
                scale={scale}
                xOffset={xOffset}
                yOffset={yOffset}
                onClick={onVertexClick}
                onHover={onVertexHover}
              />
            ))}

            {board.robber && <RobberCircle q={board.robber.q} r={board.robber.r} />}
          </svg>
        </ActiveElementProvider>
      </BoardRenderProvider>
    </div>

  );
}
