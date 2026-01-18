import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

import Login from "./pages/Login";
import SelectEquipo from "./pages/SelectEquipo";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Selección de equipo */}
          <Route
            path="/"
            element={
              <RequireAuth>
                <SelectEquipo />
              </RequireAuth>
            }
          />

          {/* Dashboard por equipo */}
          <Route
            path="/dashboard/:equipoId"
            element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
