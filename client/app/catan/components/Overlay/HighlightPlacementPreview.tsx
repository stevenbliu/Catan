"use client";

import React from "react";
import { useBoardRender } from "../../context/BoardRenderContext";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store";

interface HighlightPlacementPreviewProps {
  hoveredVertex: string | null;
  hoveredEdge: string | null;
}

export default function HighlightPlacementPreview({ hoveredVertex, hoveredEdge }: HighlightPlacementPreviewProps) {
  const { scale, xOffset, yOffset } = useBoardRender();
  const board = useSelector((state: RootState) => state.board);

  if (!hoveredVertex && !hoveredEdge) return null;

  return (
    <svg
      width={800}
      height={700}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
    >
      {/* Vertex preview */}
      {hoveredVertex && board.vertices[hoveredVertex] && (
        <circle
          cx={board.vertices[hoveredVertex].x * scale + xOffset}
          cy={board.vertices[hoveredVertex].y * scale + yOffset}
          r={10}
          fill="rgba(0, 128, 255, 0.3)"
        />
      )}

      {/* Edge preview */}
      {hoveredEdge && board.edges[hoveredEdge] && (
        <line
          x1={board.vertices[board.edges[hoveredEdge].v1].x * scale + xOffset}
          y1={board.vertices[board.edges[hoveredEdge].v1].y * scale + yOffset}
          x2={board.vertices[board.edges[hoveredEdge].v2].x * scale + xOffset}
          y2={board.vertices[board.edges[hoveredEdge].v2].y * scale + yOffset}
          stroke="rgba(0, 128, 255, 0.3)"
          strokeWidth={6}
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
