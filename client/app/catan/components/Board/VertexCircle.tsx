"use client";

import React from "react";

interface VertexCircleProps {
  vertex: { id: string; x: number; y: number };
  scale: number;
  xOffset: number;
  yOffset: number;
  onClick: (id: string) => void;
  onHover: (id: string | null) => void;
}

export function VertexCircle({ vertex, scale, xOffset, yOffset, onClick, onHover }: VertexCircleProps) {
  const x = vertex.x * scale + xOffset;
  const y = vertex.y * scale + yOffset;

  return (
    <circle
      cx={x}
      cy={y}
      r={7}
      fill="white"
      stroke="gray"
      style={{ cursor: "pointer" }}
      onClick={(e) => { e.stopPropagation(); onClick(vertex.id); }}
      onMouseEnter={() => onHover(vertex.id)}
      onMouseLeave={() => onHover(null)}
    />
  );
}
