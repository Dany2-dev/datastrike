export async function getKpisByEquipo(equipoId) {
  const res = await fetch(
    `http://127.0.0.1:8000/api/stats/by-equipo/${equipoId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!res.ok) {
    console.error("Error servidor:", res.status);
    throw new Error("Error al obtener stats del equipo");
  }

  return await res.json();
}
