// client/app/catan/context/ActiveElementContext.tsx
"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type ActiveElement = { type: "vertex" | "edge"; id: string } | null;

interface ActiveElementContextType {
  active: ActiveElement;
  setActive: (e: ActiveElement) => void;
}

const ActiveElementContext = createContext<ActiveElementContextType | null>(null);

export const useActiveElement = () => {
  const ctx = useContext(ActiveElementContext);
  if (!ctx) throw new Error("useActiveElement must be used inside ActiveElementProvider");
  return ctx;
};

export const ActiveElementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [active, setActive] = useState<ActiveElement>(null);
  return (
    <ActiveElementContext.Provider value={{ active, setActive }}>
      {children}
    </ActiveElementContext.Provider>
  );
};
