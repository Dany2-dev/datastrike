import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

import PlayerStatsTable from "../tables/PlayerStatsTable";
import CombinedPassesCharts from "../charts/CombinedPassesCharts";

/**
 * CONFIGURACIÓN Y CONSTANTES DEL COMPONENTE
 */
const DEFAULT_PARTICLE_COUNT = 15;
const DEFAULT_SPOTLIGHT_RADIUS = 350;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

/**
 * DATA DE LAS TARJETAS (BENTO GRID)
 */
const cardData = [
  {
    color: '#060010',
    title: 'HEATMAP',
    description: 'Track user behavior and patterns',
    label: 'Tactical',
    details: 'Análisis profundo de métricas de rendimiento y duelos aéreos por partido.'
  },
  {
    color: '#060010',
    title: 'LOSTS',
    description: 'Centralized data view for teams',
    label: 'Performance',
    details: 'Análisis combinado de pases, pases filtrados y duelos aéreos.'
  },
  {
    color: '#060010',
    title: 'PROGRESIVE PASS',
    description: 'Work together seamlessly in cloud',
    label: 'Analysis',
    details: 'Progresión y ruptura de líneas.'
  },
  {
    color: '#060010',
    title: 'PLAYER STATS',
    description: 'Estadísticas del partido x Jugador',
    label: 'Efficiency',
    details: 'Rendimiento individual detallado.'
  },
  {
    color: '#060010',
    title: 'xG',
    description: 'Connect your favorite soccer tools',
    label: 'Connectivity',
    details: 'Expected goals.'
  },
  {
    color: '#060010',
    title: 'COMPARATIVE',
    description: 'Enterprise-grade data protection',
    label: 'Protection',
    details: 'Comparativas avanzadas.'
  }
];

/**
 * UTILIDADES DE PARTÍCULAS
 */
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position:absolute;
    width:4px;
    height:4px;
    border-radius:50%;
    background:rgba(${color},1);
    box-shadow:0 0 12px rgba(${color},0.9);
    pointer-events:none;
    z-index:100;
    left:${x}px;
    top:${y}px;
  `;
  return el;
};

const updateSpotlight = (element, e, radius) => {
  const rect = element.getBoundingClientRect();
  element.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
  element.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  element.style.setProperty('--spotlight-radius', `${radius}px`);
};

/**
 * TARJETA INDIVIDUAL
 */
const ParticleCard = ({
  children,
  className,
  onClick,
  isExpanded,
  disableAnimations,
  enableTilt,
  enableMagnetism,
  glowColor,
  spotlightRadius
}) => {
  const cardRef = useRef(null);
  const particles = useRef([]);
  const isHovered = useRef(false);

  const clearParticles = () => {
    particles.current.forEach(p => p.remove());
    particles.current = [];
  };

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const el = cardRef.current;

    const enter = () => {
      if (isExpanded) return;
      isHovered.current = true;
    };

    const leave = () => {
      isHovered.current = false;
      clearParticles();
      gsap.to(el, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.6 });
    };

    const move = e => {
      if (isExpanded) return;
      updateSpotlight(el, e, spotlightRadius);

      if (enableTilt) {
        const r = el.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        gsap.to(el, { rotateX: -y / 20, rotateY: x / 20, duration: 0.3 });
      }
    };

    el.addEventListener('mouseenter', enter);
    el.addEventListener('mouseleave', leave);
    el.addEventListener('mousemove', move);

    return () => {
      el.removeEventListener('mouseenter', enter);
      el.removeEventListener('mouseleave', leave);
      el.removeEventListener('mousemove', move);
      clearParticles();
    };
  }, [disableAnimations, isExpanded, enableTilt, enableMagnetism, glowColor, spotlightRadius]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`${className} ${isExpanded ? 'is-expanded' : ''}`}
    >
      {children}
    </div>
  );
};

/**
 * MAGIC BENTO
 */
const MagicBento = ({ equipoId, initialData, ...props }) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
  const disableFx = props.disableAnimations || isMobile;

  const close = e => {
    e.stopPropagation();
    setActiveCardIndex(null);
  };

  return (
    <div className="bento-wrapper">
      {activeCardIndex !== null && <div className="bento-overlay" onClick={close} />}

      <div className="card-grid bento-section">
        {cardData.map((card, index) => {
          const isExpanded = index === activeCardIndex;
          const isHidden = activeCardIndex !== null && !isExpanded;

          return (
            <ParticleCard
              key={index}
              className={`magic-bento-card ${isHidden ? 'magic-bento-card--hidden' : ''}`}
              isExpanded={isExpanded}
              onClick={() => !isExpanded && setActiveCardIndex(index)}
              disableAnimations={disableFx}
              enableTilt={props.enableTilt}
              enableMagnetism={props.enableMagnetism}
              glowColor={props.glowColor || DEFAULT_GLOW_COLOR}
              spotlightRadius={props.spotlightRadius || DEFAULT_SPOTLIGHT_RADIUS}
            >
              {isExpanded && (
                <button className="magic-bento-card__close" onClick={close}>×</button>
              )}

              <div className="magic-bento-card__content">
                <span className="magic-bento-card__label">{card.label}</span>
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>

                {isExpanded && (
                  <div className="magic-bento-card__extended-info">
                    <div className="separator" />
                    <p className="details-text">{card.details}</p>

                    {card.title === "LOSTS" && (
                      <div style={{ marginTop: '2.5rem' }}>
                        <CombinedPassesCharts initialData={initialData} />
                      </div>
                    )}

                    {card.title === "PLAYER STATS" && (
                      <PlayerStatsTable equipoId={equipoId} preloadedData={initialData} />
                    )}
                  </div>
                )}
              </div>
            </ParticleCard>
          );
        })}
      </div>
    </div>
  );
};

export default MagicBento;
