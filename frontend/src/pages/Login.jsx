import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import GradientBlinds from "../components/background/GradientBlinds";
import TextType from "./TextType";
import GradientText from "./GradientText";
import StaggeredMenu from "../components/ui/StaggeredMenu";
import "./LoginPanel.css";


export default function Login() {
  const { user, loading, loginWithGoogle } = useAuth();
  const [active, setActive] = useState(false);

  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  return (
        
    <div className="fixed inset-0 min-h-screen w-full bg-black font-sans overflow-x-hidden">
      {/* 1. BACKGROUND */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <GradientBlinds
            gradientColors={["#350085", "#000000"]}
            blindCount={4}
            angle={25}
            noise={0.15}
          />
        </div>
     
      {/* 2. MENÚ (Capa Superior) 
          Lo envolvemos en un div con el z-index más alto posible */}
      <div className="fixed top-5 right-5 z-[9999]">
        <StaggeredMenu
            position="right"
            accentColor="#5227FF"
            menuButtonColor="#111827"      // 🔴 oscuro
            openMenuButtonColor="#5227FF"  // 🔵 azul al abrir
            isFixed={true}
            items={[
              { label: "Dashboard", link: "/dashboard" },
              { label: "Jugadores", link: "/jugadores" },
              { label: "Comparativas", link: "/comparativas" },
              { label: "Reportes", link: "/reportes" },
            ]}
          />
      </div>

      {/* 3. CONTENIDO (Capa Media) */}
      <div className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center p-4">
        {/* ... resto de tu contenido (Título, Login Panel, Footer) */}
        <div className="mb-10 shrink-0">
          <h1 className="font-sportypo text-center leading-none text-[6vw] drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
            <GradientText
              colors={["#5227FF", "#FF9FFC", "#B19EEF", "#5227FF"]}
              animationSpeed={6}
              showBorder={false}
              className="tracking-tighter"
            >
              <TextType
                text={["WELCOME", "DATA STRIKE"]}
                typingSpeed={80}
                pauseDuration={2000}
                showCursor={true}
                cursorCharacter="_"
                loop={true}
              />
            </GradientText>
          </h1>
        </div>

        {/* LOGIN PANEL NUEVO */}
        <div className={`container ${active ? "active" : ""}`} id="container">

          {/* SIGN IN */}
          <div className="form-container sign-in">
            <form>
              <h1>Sign In</h1>
              <span>Use Google to sign in</span>

              <button type="button" onClick={loginWithGoogle}>
                Sign In with Google

              </button>
            </form>
          </div>

          {/* SIGN UP (VISUAL, NO FUNCIONAL AÚN) */}
          <div className="form-container sign-up">
            <form>
              <h1>Create Account</h1>
              <span>Registration coming soon</span>
              <button type="button" disabled>
                Register
              </button>
            </form>
          </div>

          {/* TOGGLE */}
          <div className="toggle-container">
            <div className="toggle">
              <div className="toggle-panel toggle-left">
                <h1>Welcome Back!</h1>
                <p>Already have an account?</p>
                <button className="hidden" onClick={() => setActive(false)}>
                  Sign In
                </button>
              </div>

              <div className="toggle-panel toggle-right">
                <h1>Hello, !</h1>
                <p>Start your journey with DataStrike</p>
                <button className="hidden" onClick={() => setActive(true)}>
                  Sign Up
                </button>
              </div>
            </div>
          </div>

        </div>

        {/* FOOTER */}
        <p className="font-sportypo text-white/20 text-[11px] uppercase tracking-[0.8em] font-light mt-8">
          DanyDev Sistem v 2.0.1
        </p>
      </div>
    </div>
  );
}
