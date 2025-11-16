// client/app/catan/utils/colors.ts
export const TILE_COLORS: Record<string, string> = {
  wood: "#228B22",
  sheep: "#ADFF2F",
  wheat: "#FFD700",
  brick: "#B22222",
  ore: "#A9A9A9",
  desert: "#DEB887",
};

export const getColor = (type: string): string => {
  return TILE_COLORS[type] ?? "#ccc";
};
