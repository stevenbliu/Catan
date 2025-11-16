// client/app/catan/components/HexTile.tsx
import React from "react";
import { useBoardRender } from "../../context/BoardRenderContext";
import { computeHexPoints, hexToPixel } from "../../utils/hex";
import { getColor } from "../../utils/colors";

interface HexTileProps {
  tile: any;
}

export const HexTile: React.FC<HexTileProps> = ({ tile }) => {
  const { hexSize, xOffset, yOffset } = useBoardRender();
  const points = computeHexPoints(tile.q, tile.r, hexSize, xOffset, yOffset);
  const { x, y } = hexToPixel(tile.q, tile.r, hexSize, xOffset, yOffset);

  return (
    <>
      <polygon points={points} fill={getColor(tile.type)} stroke="black" />
      {tile.number && (
        <text x={x} y={y} textAnchor="middle" dominantBaseline="middle" fontSize={16} fill="black">
          {tile.number}
        </text>
      )}
    </>
  );
};
