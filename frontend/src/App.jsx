import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

import Login from "./pages/Login";
import SelectEquipo from "./pages/SelectEquipo";
import Dashboard from "./pages/Dashboard";

import StaggeredMenu from "./components/ui/StaggeredMenu";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        {/* MENÚ GLOBAL */}
        <StaggeredMenu
          position="left"
          isFixed={true}
          accentColor="#5227FF"
          menuButtonColor="#111827"
          openMenuButtonColor="#5227FF"
          items={[
            { label: "Overview", ariaLabel: "Overview", link: "/" },
            { label: "Teams", ariaLabel: "Teams", link: "http://127.0.0.1:5173/" },
            { label: "Players", ariaLabel: "Players", link: "/players" },
            { label: "Analysis", ariaLabel: "Analysis", link: "http://127.0.0.1:5173/dashboard/5" },
            { label: "Reports", ariaLabel: "Reports", link: "/reports" },
            { label: "Settings", ariaLabel: "Settings", link: "/settings" },
          ]}
        />

        {/* WRAPPER GLOBAL */}
        <div className="min-h-screen w-full">
          <Routes>
            <Route path="/login" element={<Login />} />

            <Route
              path="/"
              element={
                <RequireAuth>
                  <SelectEquipo />
                </RequireAuth>
              }
            />

            <Route
              path="/dashboard/:equipoId"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
