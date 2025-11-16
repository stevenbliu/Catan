// client/utils/hex.ts
export function hexToPixel(
  q: number,
  r: number,
  hexSize: number,
  xOffset = 0,
  yOffset = 0
) {
  const x = hexSize * Math.sqrt(3) * (q + r / 2) + xOffset;
  const y = hexSize * (3 / 2) * r + yOffset;
  return { x, y };
}

// Compute SVG polygon points for a hex
export function computeHexPoints(
  q: number,
  r: number,
  hexSize: number,
  xOffset = 0,
  yOffset = 0
) {
  const { x: cx, y: cy } = hexToPixel(q, r, hexSize, xOffset, yOffset);
  const points: string[] = [];

  for (let i = 0; i < 6; i++) {
    const angleDeg = 60 * i - 30; // "pointy-top" orientation
    const angleRad = (Math.PI / 180) * angleDeg;
    const x = cx + hexSize * Math.cos(angleRad);
    const y = cy + hexSize * Math.sin(angleRad);
    points.push(`${x},${y}`);
  }

  return points.join(" ");
}

export function computeVerticesAndEdges(tiles: { q: number; r: number; id: number }[], size: number) {
  const vertices: Record<string, { id: string; x: number; y: number }> = {};
  const edges: Record<string, { id: string; v1: string; v2: string }> = {};

  function vertexId(x: number, y: number) {
    return `${x.toFixed(2)}-${y.toFixed(2)}`;
  }

  tiles.forEach(tile => {
    const { x: cx, y: cy } = hexToPixel(tile.q, tile.r, size);
    const hexVerts: string[] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 180) * (60 * i - 30);
      const vx = cx + size * Math.cos(angle);
      const vy = cy + size * Math.sin(angle);
      const vid = vertexId(vx, vy);
      if (!vertices[vid]) vertices[vid] = { id: vid, x: vx, y: vy };
      hexVerts.push(vid);
    }
    // create edges (connect each vertex to next)
    for (let i = 0; i < 6; i++) {
      const v1 = hexVerts[i];
      const v2 = hexVerts[(i + 1) % 6];
      const eid = [v1, v2].sort().join("-");
      if (!edges[eid]) edges[eid] = { id: eid, v1, v2 };
    }
  });

  return { vertices, edges };
}
