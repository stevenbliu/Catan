// client/app/catan/hooks/useBoardUI.ts
import { useBoardRender } from "../context/BoardRenderContext";
import { useActiveElement } from "../context/ActiveElementContext";

export function useBoardUI() {
  const render = useBoardRender();
  const active = useActiveElement();
  return { ...render, ...active };
}
