export default function JugadoresTable({ data, jugadores }) {
  if (!data) return null;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white rounded shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 text-left">Jugador</th>
            <th className="p-2">Eventos</th>
            <th className="p-2">Tiros</th>
            <th className="p-2">Goles</th>
            <th className="p-2">xG</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(data).map(([jugadorId, kpis]) => {
            const jugador = jugadores.find(j => j.id === Number(jugadorId));
            return (
              <tr key={jugadorId} className="border-t">
                <td className="p-2">
                  <div className="flex items-center gap-2">
                    {jugador?.imagen_url && (
                      <img
                        src={jugador.imagen_url}
                        alt={jugador.nombre}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    )}
                    <span>{jugador?.nombre || `Jugador ${jugadorId}`}</span>
                  </div>
                </td>
                <td className="p-2 text-center">{kpis.eventos}</td>
                <td className="p-2 text-center">{kpis.tiros}</td>
                <td className="p-2 text-center">{kpis.goles}</td>
                <td className="p-2 text-center">{kpis.xg?.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
