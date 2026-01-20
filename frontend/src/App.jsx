import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./auth/AuthContext";
import RequireAuth from "./auth/RequireAuth";

import Login from "./pages/Login";
import SelectEquipo from "./pages/SelectEquipo";
import Dashboard from "./pages/Dashboard";

import StaggeredMenu from "./components/ui/StaggeredMenu";

function AppLayout() {
  const location = useLocation();

  const hideMenuRoutes = ["/login"];
  const hideMenu = hideMenuRoutes.includes(location.pathname);

  return (
    <>
      {!hideMenu && (
        <StaggeredMenu
          position="left"
          isFixed={true}
          accentColor="#5227FF"
          menuButtonColor="#111827"
          openMenuButtonColor="#5227FF"
          items={[
            { label: "Overview", ariaLabel: "Overview", link: "/" },
            { label: "Teams", ariaLabel: "Teams", link: "/" },
            { label: "Players", ariaLabel: "Players", link: "/players" },
            { label: "Analysis", ariaLabel: "Analysis", link: "/dashboard/5" },
            { label: "Reports", ariaLabel: "Reports", link: "/reports" },
            { label: "Settings", ariaLabel: "Settings", link: "/settings" },
          ]}
        />
      )}

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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
