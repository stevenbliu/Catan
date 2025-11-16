"use client";

import React from "react";
import { placeSettlement } from "../../api/placePiece";
import { useBoardRender } from "../../context/BoardRenderContext";

interface OverlayMenuProps {
  targetVertex: string;
  onClose: () => void;
}

export default function OverlayMenu({ targetVertex, onClose }: OverlayMenuProps) {
  const { scale, xOffset, yOffset } = useBoardRender();

  // Compute vertex position here if needed
  // For now assume you have vertex coordinates from parent

  async function handlePlaceSettlement() {
    await placeSettlement(targetVertex);
    onClose();
  }

  return (
    <div
      style={{
        position: "absolute",
        top: 100, // Replace with computed y
        left: 100, // Replace with computed x
        background: "white",
        border: "1px solid #ddd",
        padding: "4px",
        borderRadius: "4px",
        zIndex: 1000,
      }}
    >
      <button onClick={handlePlaceSettlement}>Build Settlement</button>
      <button onClick={onClose}>Cancel</button>
    </div>
  );
}
