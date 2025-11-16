"use client";

import React from "react";
import { useBoardUI } from "../../hooks/useBoardUI";
import { placeRoad } from "../../api/placePiece";

export function EdgeLine({ edge, vertices }) {
  const { scale, xOffset, yOffset, active, setActive } = useBoardUI();

  const x1 = vertices[edge.v1].x * scale + xOffset;
  const y1 = vertices[edge.v1].y * scale + yOffset;
  const x2 = vertices[edge.v2].x * scale + xOffset;
  const y2 = vertices[edge.v2].y * scale + yOffset;

  const isActive = active?.type === "edge" && active.id === edge.id;

  async function handlePlaceRoad() {
    await placeRoad(edge.id);
    setActive(null);
  }

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="blue"
        strokeWidth={3}
        onClick={(e) => {
          e.stopPropagation();
          setActive(isActive ? null : { type: "edge", id: edge.id });
        }}
        style={{ cursor: "pointer" }}
      />

      {isActive && (
        <foreignObject
          x={(x1 + x2) / 2 + 10}
          y={(y1 + y2) / 2 - 20}
          width={100}
          height={40}
        >
          <div
            style={{
              background: "white",
              border: "1px solid #ddd",
              borderRadius: 4,
              padding: 4,
              fontSize: 12,
            }}
          >
            <button onClick={handlePlaceRoad}>Build Road</button>
          </div>
        </foreignObject>
      )}
    </g>
  );
}
