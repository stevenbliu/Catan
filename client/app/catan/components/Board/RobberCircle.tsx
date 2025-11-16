// client/app/catan/components/RobberCircle.tsx
import React from "react";
import { useBoardRender } from "../../context/BoardRenderContext";
import { hexToPixel } from "../../utils/hex";

interface RobberCircleProps {
  q: number;
  r: number;
}

export const RobberCircle: React.FC<RobberCircleProps> = ({ q, r }) => {
  const { hexSize, xOffset, yOffset } = useBoardRender();
  const { x, y } = hexToPixel(q, r, hexSize, xOffset, yOffset);
  return <circle cx={x} cy={y} r={10} fill="black" />;
};
