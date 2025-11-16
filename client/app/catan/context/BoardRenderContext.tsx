// client/app/catan/context/BoardRenderContext.tsx
import { createContext, useContext, ReactNode } from "react";

interface BoardRenderContextType {
  scale: number;
  xOffset: number;
  yOffset: number;
  hexSize: number;
}

const BoardRenderContext = createContext<BoardRenderContextType | null>(null);

export const useBoardRender = () => {
  const ctx = useContext(BoardRenderContext);
  if (!ctx) throw new Error("useBoardRender must be used inside BoardRenderProvider");
  return ctx;
};

export const BoardRenderProvider: React.FC<{ value: BoardRenderContextType; children: ReactNode }> = ({ value, children }) => {
  return <BoardRenderContext.Provider value={value}>{children}</BoardRenderContext.Provider>;
};
