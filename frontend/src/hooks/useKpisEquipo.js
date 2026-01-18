import { useState } from "react";
import api from "../services/api";

export function useKpisEquipo() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchKpis = async (equipoId, file) => {
    setLoading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post(`/kpis/by-equipo/${equipoId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setData(res.data);
    } catch (e) {
      setError("Error cargando KPIs");
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fetchKpis };
}
