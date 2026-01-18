import { useState } from "react";
import api from "../services/api";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [kpis, setKpis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showJugadores, setShowJugadores] = useState(true);

  const equipoId = 5; // luego será dinámico

  const calcularKpis = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await api.post(`/kpis/by-equipo/${equipoId}`, formData);
      setKpis(res.data);
    } catch {
      alert("Error al calcular KPIs");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-8 space-y-6"
    >
      <h1 className="text-2xl font-bold">Dashboard del equipo</h1>

      {/* SUBIR ARCHIVO */}
      <div className="space-x-4">
        <input
          type="file"
          accept=".xlsx,.csv"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button
          onClick={calcularKpis}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Calcular KPIs
        </button>
      </div>

      {loading && <p>Calculando KPIs...</p>}

      {/* ===== GENERAL ===== */}
      {kpis && (
        <section>
          <h2 className="text-xl font-semibold mb-2">Resumen general</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div><b>Eventos</b><br />{kpis.general.eventos}</div>
            <div><b>Pases</b><br />{kpis.general.pases}</div>
            <div><b>Tiros</b><br />{kpis.general.tiros}</div>
            <div><b>Goles</b><br />{kpis.general.goles}</div>
            <div><b>xG</b><br />{kpis.general.xg}</div>
          </div>
        </section>
      )}

      {/* ===== POR PERIODO ===== */}
      {kpis && (
        <section>
          <h2 className="text-xl font-semibold mb-2">KPIs por periodo</h2>

          {Object.entries(kpis.por_periodo).map(([periodo, data]) => (
            <div key={periodo} className="border p-4 mb-3 rounded">
              <h3 className="font-bold">{periodo}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                <div><b>Eventos</b><br />{data.eventos}</div>
                <div><b>Goles</b><br />{data.goles}</div>
                <div><b>xG</b><br />{data.xg}</div>
              </div>
            </div>
          ))}
        </section>
      )}

      {/* TOGGLE */}
      {kpis && (
        <button
          onClick={() => setShowJugadores(!showJugadores)}
          className="px-4 py-2 bg-gray-700 text-white rounded"
        >
          {showJugadores ? "Ocultar jugadores" : "Mostrar jugadores"}
        </button>
      )}

      {/* ===== POR JUGADOR ===== */}
      {kpis && showJugadores && (
        <section>
          <h2 className="text-xl font-semibold mb-2">KPIs por jugador</h2>

          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-200">
                <th className="border p-2">Jugador</th>
                <th className="border p-2">Eventos</th>
                <th className="border p-2">Tiros</th>
                <th className="border p-2">Goles</th>
                <th className="border p-2">xG</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(kpis.por_jugador).map(([_, j]) => (
                <tr key={j.jugador}>
                  <td className="border p-2 flex items-center gap-3">
                    <img
                      src={j.imagen_jugador || "/default-player.png"}
                      alt={j.jugador}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span>{j.jugador}</span>
                  </td>
                  <td className="border p-2">{j.eventos}</td>
                  <td className="border p-2">{j.tiros}</td>
                  <td className="border p-2">{j.goles}</td>
                  <td className="border p-2">{j.xg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      )}
    </motion.div>
  );
}
