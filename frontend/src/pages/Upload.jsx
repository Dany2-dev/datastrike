import { useState } from "react";
import api from "../services/api";

export default function Upload() {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("Selecciona un archivo");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setStatus("Subiendo...");
      await api.post("/files/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus("Archivo subido correctamente");
      setFile(null);
    } catch (err) {
      console.error(err);
      setStatus("Error al subir archivo");
    }
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl font-bold mb-4">Subir archivo</h1>

      <form onSubmit={handleUpload} className="space-y-4">
        <input
          type="file"
          accept=".csv,.xlsx"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          className="px-6 py-2 bg-green-600 text-white rounded"
        >
          Subir
        </button>
      </form>

      {status && <p className="mt-4">{status}</p>}
    </div>
  );
}
