import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { getKpisByEquipo } from "../../services/kpis.service";
import "./playerStatsTable.css";

const columns = [
  {
    accessorKey: "jugador",
    header: "Jugador",
    cell: ({ row }) => (
      <div className="player-cell">
        <img 
          src={row.original.foto || 'https://via.placeholder.com/40'} 
          alt={row.original.jugador} 
          className="player-avatar"
        />
        <div className="player-info-text">
          <span className="player-name">{row.original.jugador}</span>
          <span className="player-id">ID: {row.original.id}</span>
        </div>
      </div>
    )
  },
  { accessorKey: "eventos", header: "EV" },
  { accessorKey: "pasesOk", header: "P ✔" },
  { accessorKey: "pasesFail", header: "P ✖" },
  { accessorKey: "duelos", header: "D ✔" },
  { accessorKey: "tiros", header: "TIROS" },
  { accessorKey: "goles", header: "GOL" }
];

function processStatsData(res) {
  // Manejamos si viene de 'por_jugador' o es el array directo del POST
  const rawData = res.por_jugador || res;
  const eventsArray = Array.isArray(rawData) ? rawData : Object.values(rawData || {});
  
  if (eventsArray.length === 0) return [];

  const agrupados = eventsArray.reduce((acc, curr) => {
    // Usamos 'id_jugador' como clave única para agrupar
    const id = curr.id_jugador;
    
    if (!id) return acc;

    if (!acc[id]) {
      acc[id] = {
        id: id,
        jugador: curr.jugador || `Jugador ${id}`,
        foto: curr.imagen_jugador || null,
        eventos: 0,
        pasesOk: 0,
        pasesFail: 0,
        duelos: 0,
        tiros: 0,
        goles: 0
      };
    }

    acc[id].eventos += 1;
    
    // Normalizamos el nombre del evento para comparar
    const ev = (curr.event || curr.Event || "").toLowerCase();
    
    // 1. PASES (Siguiendo tu lógica de Python)
    if (ev.match(/pase completo|pase entre lineas|pase filtrado|centro completo|asistencia/)) {
      acc[id].pasesOk += 1;
    } 
    else if (ev.match(/pase incompleto|centro incompleto/)) {
      acc[id].pasesFail += 1;
    }

    // 2. DUELOS GANADOS
    if (ev.includes("duelo ganado") || ev.includes("balon aereo ganado")) {
      acc[id].duelos += 1;
    }

    // 3. TIROS
    if (ev.includes("tiro") || ev.includes("remate") || ev.includes("shot")) {
      acc[id].tiros += 1;
    }

    // 4. GOLES
    if (/\b(gol|goal)\b/.test(ev)) {
      acc[id].goles += 1;
    }

    return acc;
  }, {});

  return Object.values(agrupados).sort((a, b) => b.eventos - a.eventos);
}

export default function PlayerStatsTable({ equipoId, preloadedData }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(!preloadedData);
  const [globalFilter, setGlobalFilter] = useState("");

  useEffect(() => {
    if (preloadedData) {
      setData(processStatsData(preloadedData));
      setLoading(false);
    } else if (equipoId) {
      setLoading(true);
      getKpisByEquipo(equipoId)
        .then(res => {
          if (res) setData(processStatsData(res));
        })
        .finally(() => setLoading(false));
    }
  }, [equipoId, preloadedData]);

  const table = useReactTable({
    data,
    columns,
    state: { globalFilter },
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 50 } },
  });

  if (loading) return <div className="table-loader">Procesando estadísticas...</div>;

  return (
    <div className="player-table-wrapper">
      <div className="player-table-toolbar">
        <div className="search-container">
          <input
            placeholder="Buscar por nombre o ID..."
            value={globalFilter ?? ""}
            onChange={e => setGlobalFilter(e.target.value)}
            className="table-search-input"
          />
        </div>
      </div>

      <div className="table-scroll-container">
        <table className="bento-stats-table">
          <thead>
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id}>{flexRender(h.column.columnDef.header, h.getContext())}</th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="table-row-animate">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            ) : (
              <tr><td colSpan={columns.length} className="no-data">Sin datos disponibles</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}