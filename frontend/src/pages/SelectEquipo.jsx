import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function SelectEquipo() {
  const [equipos, setEquipos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("/equipos")
      .then(res => setEquipos(res.data))
      .catch(() => setEquipos([]));
  }, []);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">Selecciona un equipo</h1>

      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        {equipos.map(eq => (
          <button
            key={eq.id}
            onClick={() => navigate(`/dashboard/${eq.id}`)}
            className="p-4 rounded-xl border hover:border-blue-500"
          >
            <img
              src={eq.logo_url}
              alt={eq.nombre}
              className="h-16 mx-auto object-contain"
            />
            <p className="mt-2 text-sm font-medium">{eq.nombre}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
