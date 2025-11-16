export async function placeSettlement(vertexId: string) {
  await fetch("http://localhost:8000/catan/place/settlement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      vertex_id: vertexId,
      player_id: "p1", // TODO: replace later with real auth
    }),
  });
}

export async function placeRoad(edgeId: string) {
  await fetch("http://localhost:8000/catan/place/road", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      edge_id: edgeId,
      player_id: "p1",
    }),
  });
}


export async function upgradeSettlementToCity(vertexId: number) {
  const res = await fetch("http://localhost:8000/catan/upgrade/settlement", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vertex_id: vertexId }),
  });

  if (!res.ok) {
    throw new Error("Failed to upgrade settlement to city");
  }

  return await res.json(); // updated board
}

