import { useParams } from "react-router-dom";
import CardNav from "../components/ui/CardNav";
import MagicBento from "../components/ui/MagicBento"; 
import logoDataStrike from "../assets/logos/logo-datastrike.png"; 

/**
 * Dashboard principal que integra la navegación superior, 
 * el sistema de tarjetas Magic Bento y el estilo visual neón.
 */
export default function Dashboard() {
  const { equipoId } = useParams();

  // Configuración de los items del menú desplegable superior
  const menuItems = [
    {
      label: "Análisis",
      links: [
        { label: "Rendimiento", path: `/dashboard/${equipoId}/stats` },
        { label: "Táctica", path: `/dashboard/${equipoId}/tactic` },
      ]
    },
    {
      label: "Plantilla",
      links: [
        { label: "Jugadores", path: `/dashboard/${equipoId}/players` },
        { label: "Mercado", path: `/dashboard/${equipoId}/market` },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden border-none">
      
      {/* 1. Navegación Superior Estilo Card */}
      <CardNav 
        items={menuItems}
        logo={logoDataStrike}
        logoAlt="DataStrike Logo"
        baseColor="#0f172a"
        menuColor="#a855f7" 
        buttonBgColor="#7e22ce" 
        buttonTextColor="#fff"
      />
      
      {/* 2. Contenedor de Contenido Principal */}
      <main className="pt-32 pb-10 flex flex-col items-center justify-center min-h-screen px-6 border-none">
        
        {/* 3. Sistema Magic Bento con configuración Neón Morado */}
        <div className="w-full max-w-7xl flex justify-center border-none">
            <MagicBento 
              textAutoHide={true}
              enableStars={true}
              enableSpotlight={true}
              enableBorderGlow={true}
              enableTilt={false}
              enableMagnetism={false}
              clickEffect={true}
              spotlightRadius={600}
              particleCount={12}
              glowColor="132, 0, 255"
              disableAnimations={false}
            />
        </div>

      </main>

      {/* Estilo local para asegurar que no existan líneas blancas residuales */}
      <style jsx global>{`
        .card-grid, 
        .bento-section,
        .magic-bento-card-container {
            border-bottom: none !important;
            outline: none !important;
        }
        body {
            background-color: #020617;
            margin: 0;
            padding: 0;
        }
      `}</style>
    </div>
  );
}