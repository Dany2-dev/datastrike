import { useRef, useEffect, useCallback, useState } from 'react';
import { gsap } from 'gsap';
import './MagicBento.css';

/**
 * CONFIGURACIÓN Y CONSTANTES
 * Mantenemos los valores por defecto para una personalización flexible.
 */
const DEFAULT_PARTICLE_COUNT = 15;
const DEFAULT_SPOTLIGHT_RADIUS = 350;
const DEFAULT_GLOW_COLOR = '132, 0, 255';
const MOBILE_BREAKPOINT = 768;

const cardData = [
  {
    color: '#060010',
    title: 'Analytics',
    description: 'Track user behavior and patterns',
    label: 'Insights',
    details: 'Análisis profundo de métricas de rendimiento y xG por partido. Incluye mapas de calor tácticos y predicciones de fatiga basadas en IA.'
  },
  {
    color: '#060010',
    title: 'Dashboard',
    description: 'Centralized data view for teams',
    label: 'Overview',
    details: 'Vista general del estado físico y táctico de la plantilla. Monitoriza la carga de entrenamiento y la disponibilidad de jugadores en tiempo real.'
  },
  {
    color: '#060010',
    title: 'Collaboration',
    description: 'Work together seamlessly in cloud',
    label: 'Teamwork',
    details: 'Herramientas de comunicación interna para el cuerpo técnico. Permite compartir clips de video y notas tácticas de forma instantánea.'
  },
  {
    color: '#060010',
    title: 'Automation',
    description: 'Streamline workflows and reports',
    label: 'Efficiency',
    details: 'Generación automática de informes post-partido. Ahorra hasta 10 horas semanales en la recopilación de datos de rendimiento.'
  },
  {
    color: '#060010',
    title: 'Integration',
    description: 'Connect your favorite soccer tools',
    label: 'Connectivity',
    details: 'Sincronización bidireccional con WyScout, Opta y Hudl. Importa bases de datos externas con un solo clic.'
  },
  {
    color: '#060010',
    title: 'Security',
    description: 'Enterprise-grade data protection',
    label: 'Protection',
    details: 'Encriptación de grado militar para datos sensibles de contratos y scouting. Cumple con los estándares GDPR y protección de menores.'
  }
];

/**
 * UTILIDADES DE RENDERIZADO Y CÁLCULO
 */
const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement('div');
  el.className = 'particle';
  el.style.cssText = `
    position: absolute;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 8px rgba(${color}, 0.8);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
    will-change: transform, opacity;
  `;
  return el;
};

const calculateSpotlightValues = radius => ({
  proximity: radius * 0.4,
  fadeDistance: radius * 0.8
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty('--glow-x', `${relativeX}%`);
  card.style.setProperty('--glow-y', `${relativeY}%`);
  card.style.setProperty('--glow-intensity', glow.toString());
  card.style.setProperty('--glow-radius', `${radius}px`);
};

/**
 * COMPONENTE DE TARJETA CON PARTÍCULAS
 */
const ParticleCard = ({
  children,
  className = '',
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  onClick,
  isExpanded = false
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);
  const magnetismAnimationRef = useRef(null);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;
    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(Math.random() * width, Math.random() * height, glowColor)
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];
    magnetismAnimationRef.current?.kill();

    particlesRef.current.forEach(particle => {
      gsap.to(particle, {
        scale: 0,
        opacity: 0,
        duration: 0.4,
        ease: 'power4.in',
        onComplete: () => particle.parentNode?.removeChild(particle)
      });
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current || isExpanded) return;
    if (!particlesInitialized.current) initializeParticles();

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current || isExpanded) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        gsap.fromTo(clone, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.5)' });
        
        gsap.to(clone, {
          x: (Math.random() - 0.5) * 120,
          y: (Math.random() - 0.5) * 120,
          rotation: Math.random() * 720,
          duration: 3 + Math.random() * 3,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true
        });
      }, index * 80);
      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles, isExpanded]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;
    const element = cardRef.current;

    const handleMouseEnter = () => {
      if (isExpanded) return;
      isHoveredRef.current = true;
      animateParticles();
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();
      gsap.to(element, { rotateX: 0, rotateY: 0, x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.75)' });
    };

    const handleMouseMove = e => {
      if (isExpanded || !isHoveredRef.current) return;
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        gsap.to(element, { rotateX, rotateY, duration: 0.2, ease: 'power3.out', transformPerspective: 1200 });
      }

      if (enableMagnetism) {
        gsap.to(element, { x: (x - centerX) * 0.04, y: (y - centerY) * 0.04, duration: 0.4, ease: 'power2.out' });
      }
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);
    element.addEventListener('mousemove', handleMouseMove);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      element.removeEventListener('mousemove', handleMouseMove);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, isExpanded]);

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      className={`${className} particle-container ${isExpanded ? 'is-expanded' : ''}`}
      style={style}
    >
      {children}
    </div>
  );
};

/**
 * COMPONENTE DE FOCO GLOBAL (SPOTLIGHT)
 */
const GlobalSpotlight = ({ gridRef, isAnyCardExpanded, glowColor, spotlightRadius }) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (isAnyCardExpanded) {
      if (spotlightRef.current) spotlightRef.current.style.opacity = '0';
      return;
    }

    const spotlight = document.createElement('div');
    spotlight.className = 'global-spotlight';
    spotlight.style.cssText = `
      position: fixed; width: 800px; height: 800px; border-radius: 50%; pointer-events: none;
      background: radial-gradient(circle, rgba(${glowColor}, 0.15) 0%, transparent 70%);
      z-index: 200; opacity: 0; transform: translate(-50%, -50%); mix-blend-mode: screen;
      will-change: left, top, opacity;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = e => {
      if (!gridRef.current || isAnyCardExpanded) return;
      
      const cards = gridRef.current.querySelectorAll('.magic-bento-card');
      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const dist = Math.hypot(e.clientX - (rect.left + rect.width / 2), e.clientY - (rect.top + rect.height / 2)) - Math.max(rect.width, rect.height) / 2;
        const effectiveDist = Math.max(0, dist);
        minDistance = Math.min(minDistance, effectiveDist);

        let intensity = effectiveDist <= proximity ? 1 : effectiveDist <= fadeDistance ? (fadeDistance - effectiveDist) / (fadeDistance - proximity) : 0;
        updateCardGlowProperties(card, e.clientX, e.clientY, intensity, spotlightRadius);
      });

      gsap.to(spotlight, { 
        left: e.clientX, 
        top: e.clientY, 
        opacity: minDistance < 100 ? 1 : 0, 
        duration: 0.3 
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      spotlight.remove();
    };
  }, [gridRef, isAnyCardExpanded, glowColor, spotlightRadius]);

  return null;
};

/**
 * COMPONENTE PRINCIPAL: MAGIC BENTO
 */
const MagicBento = (props) => {
  const [activeCardIndex, setActiveCardIndex] = useState(null);
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisable = props.disableAnimations || isMobile;

  return (
    <div className="bento-wrapper">
      <GlobalSpotlight 
        gridRef={gridRef} 
        isAnyCardExpanded={activeCardIndex !== null}
        glowColor={props.glowColor || DEFAULT_GLOW_COLOR}
        spotlightRadius={props.spotlightRadius || DEFAULT_SPOTLIGHT_RADIUS}
      />

      <div className="card-grid bento-section" ref={gridRef}>
        {cardData.map((card, index) => {
          const isExpanded = activeCardIndex === index;
          const isHidden = activeCardIndex !== null && !isExpanded;

          return (
            <ParticleCard
              key={index}
              isExpanded={isExpanded}
              onClick={() => setActiveCardIndex(isExpanded ? null : index)}
              disableAnimations={shouldDisable}
              enableTilt={props.enableTilt}
              enableMagnetism={props.enableMagnetism}
              glowColor={props.glowColor || DEFAULT_GLOW_COLOR}
              className={`magic-bento-card 
                ${props.textAutoHide ? 'magic-bento-card--text-autohide' : ''} 
                ${props.enableBorderGlow ? 'magic-bento-card--border-glow' : ''} 
                ${isHidden ? 'magic-bento-card--hidden' : ''}`}
              style={{
                backgroundColor: card.color,
                '--glow-color': props.glowColor || DEFAULT_GLOW_COLOR,
                zIndex: isExpanded ? 2100 : 1
              }}
            >
              <div className="magic-bento-card__header">
                <span className="magic-bento-card__label">{card.label}</span>
                {isExpanded && (
                  <button className="magic-bento-card__close" onClick={(e) => {
                    e.stopPropagation();
                    setActiveCardIndex(null);
                  }}>✕</button>
                )}
              </div>

              <div className="magic-bento-card__content">
                <h2 className="magic-bento-card__title">{card.title}</h2>
                <p className="magic-bento-card__description">{card.description}</p>
                
                {isExpanded && (
                  <div className="magic-bento-card__extended-info">
                    <div className="separator" style={{ background: `rgba(${props.glowColor || DEFAULT_GLOW_COLOR}, 0.2)` }}></div>
                    <p className="details-text">{card.details}</p>
                    <div className="stats-container">
                      <div className="stat-label">System Performance</div>
                      <div className="stat-bar" style={{ '--w': '85%', '--c': `rgba(${props.glowColor || DEFAULT_GLOW_COLOR}, 0.6)` }}></div>
                      <div className="stat-label">Data Accuracy</div>
                      <div className="stat-bar" style={{ '--w': '94%', '--c': `rgba(${props.glowColor || DEFAULT_GLOW_COLOR}, 0.4)` }}></div>
                    </div>
                  </div>
                )}
              </div>
            </ParticleCard>
          );
        })}
      </div>

      {activeCardIndex !== null && (
        <div className="bento-overlay" onClick={() => setActiveCardIndex(null)} />
      )}
    </div>
  );
};

function useMobileDetection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);
    check(); window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default MagicBento;