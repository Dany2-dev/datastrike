import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();

  if (loading) return <p>Cargando...</p>;

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6">Bienvenido</h1>

      <button
        onClick={loginWithGoogle}
        className="px-6 py-3 border rounded hover:bg-gray-100"
      >
        Iniciar sesión con Google
      </button>
    </div>
  );
}
