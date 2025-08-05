import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { useSpring, animated, useChain, useSpringRef, config } from 'react-spring';
import styled, { css, keyframes } from 'styled-components';
import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion';
import PropTypes from 'prop-types';
import OceanBackground from './OceanBackground';

// Advanced wave physics hook using Gerstner wave equations
const useGerstnerWaves = (mousePosition, scrollVelocity) => {
  const [waves, setWaves] = useState([]);
  const timeRef = useRef(0);
  const canvasRef = useRef(null);

  // Wave configuration with multiple frequencies
  const waveConfig = useMemo(() => [
    { amplitude: 0.02, wavelength: 0.3, speed: 0.5, direction: [1, 0] },
    { amplitude: 0.015, wavelength: 0.5, speed: 0.8, direction: [0.8, 0.6] },
    { amplitude: 0.025, wavelength: 0.7, speed: 0.3, direction: [0.6, 0.8] },
    { amplitude: 0.01, wavelength: 1.2, speed: 1.2, direction: [0.9, 0.1] },
    { amplitude: 0.008, wavelength: 2.0, speed: 0.6, direction: [0.7, 0.7] },
    { amplitude: 0.012, wavelength: 1.8, speed: 0.9, direction: [0.5, 0.9] },
    { amplitude: 0.005, wavelength: 3.5, speed: 0.4, direction: [0.3, 0.95] }
  ], []);

  // Gerstner wave calculation
  const calculateGerstnerWave = useCallback((x, y, time, wave) => {
    const { amplitude, wavelength, speed, direction } = wave;
    const k = (2 * Math.PI) / wavelength;
    const dot = x * direction[0] + y * direction[1];
    const phase = k * dot - speed * time;
    
    const cosPhase = Math.cos(phase);
    const sinPhase = Math.sin(phase);
    
    return {
      height: amplitude * sinPhase,
      offsetX: amplitude * k * direction[0] * cosPhase,
      offsetY: amplitude * k * direction[1] * cosPhase
    };
  }, []);

  // Mouse influence on waves
  const mouseInfluence = useMemo(() => {
    const strength = 0.03;
    const influence = mousePosition.x * strength + mousePosition.y * strength * 0.5;
    return Math.max(0.5, Math.min(2.0, 1 + influence));
  }, [mousePosition.x, mousePosition.y]);

  // Scroll velocity influence
  const scrollInfluence = useMemo(() => {
    return Math.max(0.8, Math.min(1.5, 1 + Math.abs(scrollVelocity) * 0.1));
  }, [scrollVelocity]);

  // Animation frame for wave rendering
  useAnimationFrame((delta) => {
    timeRef.current += delta * 0.001 * mouseInfluence * scrollInfluence;
    
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;
      
      ctx.clearRect(0, 0, width, height);
      
      // Render waves
      const waveData = [];
      for (let x = 0; x < width; x += 2) {
        let totalHeight = 0;
        let totalOffsetX = 0;
        let totalOffsetY = 0;
        
        waveConfig.forEach(wave => {
          const result = calculateGerstnerWave(
            x / width, 
            0.5, 
            timeRef.current, 
            wave
          );
          totalHeight += result.height;
          totalOffsetX += result.offsetX;
        });
        
        waveData.push({
          x: x + totalOffsetX * 50,
          y: height * 0.6 + totalHeight * 100
        });
      }
      
      setWaves(waveData);
    }
  });

  return { waves, canvasRef, timeRef };
};

// Mouse parallax hook
const useMouseParallax = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseenter', handleMouseEnter);
    window.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseenter', handleMouseEnter);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return { mousePosition, isHovering };
};

// Scroll velocity hook
const useScrollVelocity = () => {
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const lastScrollTop = useRef(0);
  const lastTimestamp = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = performance.now();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      
      if (lastTimestamp.current > 0) {
        const timeDelta = now - lastTimestamp.current;
        const scrollDelta = scrollTop - lastScrollTop.current;
        const velocity = scrollDelta / timeDelta;
        setScrollVelocity(velocity);
      }
      
      lastScrollTop.current = scrollTop;
      lastTimestamp.current = now;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollVelocity;
};

// Advanced keyframes with easing

const causticPattern = keyframes`
  0% { 
    filter: hue-rotate(0deg) brightness(1) contrast(1);
    transform: scale(1) rotate(0deg);
  }
  25% { 
    filter: hue-rotate(15deg) brightness(1.1) contrast(1.1);
    transform: scale(1.05) rotate(2deg);
  }
  50% { 
    filter: hue-rotate(30deg) brightness(0.9) contrast(1.2);
    transform: scale(0.95) rotate(-1deg);
  }
  75% { 
    filter: hue-rotate(15deg) brightness(1.05) contrast(1.05);
    transform: scale(1.02) rotate(1deg);
  }
  100% { 
    filter: hue-rotate(0deg) brightness(1) contrast(1);
    transform: scale(1) rotate(0deg);
  }
`;

// Premium styled components with advanced CSS
const HeroContainer = styled(motion.section)`
  position: relative;
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  display: grid;
  place-items: center;
  contain: layout style paint;
  will-change: transform;

  @media (max-width: 768px) {
    padding: clamp(1rem, 5vw, 2rem);
  }
`;

// Advanced wave canvas
const WaveCanvas = styled.canvas`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 70%;
  z-index: 2;
  pointer-events: none;
  filter: blur(0.5px) contrast(1.1);
  will-change: transform;
`;

// Sophisticated ocean layers
const OceanLayer = styled(animated.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 200%;
  height: 100%;
  pointer-events: none;
  will-change: transform;
  
  ${props => props.layer === 'deep' && css`
    z-index: 2;
    background: linear-gradient(
      180deg,
      hsla(220, 80%, 30%, 0.8) 0%,
      hsla(225, 90%, 20%, 0.95) 50%,
      hsla(230, 95%, 15%, 1) 100%
    );
    filter: blur(2px);
  `}
  
  ${props => props.layer === 'mid' && css`
    z-index: 3;
    background: linear-gradient(
      180deg,
      hsla(210, 70%, 50%, 0.7) 0%,
      hsla(215, 80%, 35%, 0.9) 50%,
      hsla(220, 90%, 25%, 1) 100%
    );
    filter: blur(1px);
  `}
  
  ${props => props.layer === 'surface' && css`
    z-index: 4;
    background: linear-gradient(
      180deg,
      hsla(200, 60%, 60%, 0.6) 0%,
      hsla(210, 70%, 45%, 0.8) 50%,
      hsla(220, 80%, 30%, 1) 100%
    );
  `}
`;

// Caustic light effects
const CausticLayer = styled(animated.div)`
  position: absolute;
  inset: 0;
  z-index: 5;
  background: 
    radial-gradient(ellipse 300px 100px at 30% 70%, hsla(190, 100%, 80%, 0.2) 0%, transparent 70%),
    radial-gradient(ellipse 200px 80px at 70% 60%, hsla(200, 100%, 85%, 0.15) 0%, transparent 70%),
    radial-gradient(ellipse 250px 90px at 50% 80%, hsla(210, 100%, 90%, 0.1) 0%, transparent 70%);
  animation: ${causticPattern} 8s ease-in-out infinite;
  pointer-events: none;
  mix-blend-mode: overlay;
`;

// World Maritime Map Background
const WorldMapBackground = styled(animated.div)`
  position: absolute;
  inset: 0;
  z-index: 14;
  opacity: 0.6;
  pointer-events: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1000 500'%3E%3C!-- Simple, clear world map with all continents --%3E%3Cg fill='%23ffffff' stroke='%23ffffff' stroke-width='1'%3E%3C!-- North America --%3E%3Cpath d='M80 60 L180 50 L220 80 L200 140 L160 160 L100 150 L60 120 Z'/%3E%3C!-- South America --%3E%3Cpath d='M150 200 L180 190 L190 240 L170 300 L140 320 L120 280 L130 220 Z'/%3E%3C!-- Europe --%3E%3Cpath d='M420 80 L460 70 L480 90 L470 120 L440 130 L410 110 Z'/%3E%3C!-- Africa --%3E%3Cpath d='M440 140 L480 130 L500 180 L490 260 L460 280 L430 260 L420 200 L430 160 Z'/%3E%3C!-- Asia --%3E%3Cpath d='M500 50 L650 40 L700 70 L720 120 L680 150 L640 140 L580 130 L520 100 L480 80 Z'/%3E%3C!-- Australia --%3E%3Cpath d='M650 280 L700 270 L720 290 L710 320 L680 330 L650 320 L640 300 Z'/%3E%3C!-- Antarctica --%3E%3Cpath d='M200 380 L800 380 L850 420 L800 450 L200 450 L150 420 Z'/%3E%3C!-- Greenland --%3E%3Cpath d='M300 30 L340 25 L350 50 L340 80 L310 85 L290 60 Z'/%3E%3C!-- Madagascar --%3E%3Cpath d='M520 240 L530 235 L535 260 L525 270 L515 265 L510 250 Z'/%3E%3C!-- Japan --%3E%3Cpath d='M680 100 L690 95 L695 110 L685 120 L675 115 Z'/%3E%3C!-- UK --%3E%3Cpath d='M400 90 L410 85 L415 100 L405 105 L395 100 Z'/%3E%3C!-- Philippines --%3E%3Cpath d='M650 180 L660 175 L665 190 L655 195 L645 190 Z'/%3E%3C!-- Indonesia --%3E%3Cpath d='M620 200 L680 195 L690 210 L680 220 L620 225 L610 215 Z'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 80% 80%;
  background-position: center center;
  background-repeat: no-repeat;
  filter: none;
  will-change: transform;
  mix-blend-mode: overlay;
`;

// Premium particle system
const ParticleField = styled(animated.div)`
  position: absolute;
  inset: 0;
  z-index: 6;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(2px 2px at 20% 20%, rgba(255,255,255,0.4), transparent),
      radial-gradient(1px 1px at 40% 40%, rgba(255,255,255,0.3), transparent),
      radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.2), transparent),
      radial-gradient(2px 2px at 80% 80%, rgba(255,255,255,0.3), transparent);
    background-size: 300px 300px, 200px 200px, 400px 400px, 250px 250px;
    will-change: transform;
  }
  
  &::before {
    animation: float 20s linear infinite;
  }
  
  &::after {
    animation: float 30s linear infinite reverse;
  }
  
  @keyframes float {
    0% { transform: translateY(0) translateX(0); }
    100% { transform: translateY(-100vh) translateX(50px); }
  }
`;

// Glassmorphism hero content
const HeroContent = styled(animated.div)`
  position: relative;
  z-index: 15;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  max-width: min(90vw, 900px);
  padding: clamp(2rem, 5vw, 4rem);
  
  /* Advanced glassmorphism */
  background: 
    linear-gradient(
      135deg,
      hsla(0, 0%, 100%, 0.1) 0%,
      hsla(220, 60%, 95%, 0.05) 25%,
      hsla(220, 40%, 90%, 0.08) 50%,
      hsla(220, 60%, 95%, 0.05) 75%,
      hsla(0, 0%, 100%, 0.1) 100%
    );
  backdrop-filter: blur(20px) saturate(180%);
  border-radius: clamp(16px, 3vw, 32px);
  border: 1px solid hsla(0, 0%, 100%, 0.2);
  box-shadow: 
    0 8px 32px hsla(220, 60%, 20%, 0.3),
    0 0 0 1px hsla(0, 0%, 100%, 0.05),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.1),
    inset 0 -1px 0 hsla(0, 0%, 0%, 0.1);
  
  /* Subtle hover effects */
  transition: all 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 16px 64px hsla(220, 60%, 20%, 0.4),
      0 0 0 1px hsla(0, 0%, 100%, 0.1),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.2);
  }
`;

// Advanced typography with variable fonts
const HeroTitle = styled(animated.h1)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: clamp(2.5rem, 8vw, 5.5rem);
  font-weight: 800;
  font-variation-settings: 'wght' 800, 'slnt' 0;
  line-height: 1.1;
  letter-spacing: -0.04em;
  margin-bottom: 1.5rem;
  
  background: linear-gradient(
    135deg,
    hsl(0, 0%, 100%) 0%,
    hsl(210, 30%, 85%) 25%,
    hsl(210, 50%, 70%) 50%,
    hsl(210, 70%, 60%) 75%,
    hsl(0, 0%, 100%) 100%
  );
  background-size: 200% 200%;
  animation: gradientShift 6s ease-in-out infinite alternate;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  
  text-shadow: 
    0 0 30px hsla(210, 100%, 80%, 0.5),
    0 0 60px hsla(210, 100%, 70%, 0.3);
  
  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    100% { background-position: 100% 50%; }
  }
  
  @media (max-width: 768px) {
    font-size: clamp(2rem, 10vw, 3.5rem);
  }
`;

const HeroSubtitle = styled(animated.p)`
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: clamp(1.1rem, 3vw, 1.5rem);
  font-weight: 400;
  line-height: 1.6;
  color: hsla(0, 0%, 100%, 0.85);
  margin-bottom: 3rem;
  max-width: 600px;
  
  text-shadow: 0 2px 8px hsla(220, 60%, 20%, 0.5);
  
  @media (max-width: 768px) {
    font-size: clamp(1rem, 4vw, 1.2rem);
    margin-bottom: 2rem;
  }
`;

// Premium CTA button with advanced interactions
const CTAButton = styled(animated.button)`
  position: relative;
  padding: 1rem 2.5rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  background: linear-gradient(135deg, hsl(210, 100%, 45%), hsl(210, 100%, 55%));
  border: none;
  border-radius: 50px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
  will-change: transform;
  
  box-shadow: 
    0 10px 30px hsla(210, 100%, 45%, 0.4),
    0 0 20px hsla(210, 100%, 55%, 0.2),
    inset 0 1px 0 hsla(0, 0%, 100%, 0.2);
  
  /* Shimmer effect */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      transparent, 
      hsla(0, 0%, 100%, 0.4), 
      transparent
    );
    transition: left 0.6s cubic-bezier(0.23, 1, 0.32, 1);
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 
      0 20px 40px hsla(210, 100%, 45%, 0.5),
      0 0 30px hsla(210, 100%, 55%, 0.3),
      inset 0 1px 0 hsla(0, 0%, 100%, 0.3);
  }
  
  &:hover::before {
    left: 100%;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  @media (max-width: 768px) {
    padding: 0.875rem 2rem;
    font-size: 1rem;
  }
`;

// Main Hero component with advanced React patterns
const Hero = ({ onCTAClick }) => {
  const containerRef = useRef(null);
  const { mousePosition, isHovering } = useMouseParallax();
  const scrollVelocity = useScrollVelocity();
  const { canvasRef } = useGerstnerWaves(mousePosition, scrollVelocity);

  // React Spring animations with physics
  const titleRef = useSpringRef();
  const subtitleRef = useSpringRef();
  const buttonRef = useSpringRef();

  const titleSpring = useSpring({
    ref: titleRef,
    from: { opacity: 0, transform: 'translateY(60px) scale(0.9)' },
    to: { opacity: 1, transform: 'translateY(0px) scale(1)' },
    config: { ...config.slow, tension: 100, friction: 50 }
  });

  const subtitleSpring = useSpring({
    ref: subtitleRef,
    from: { opacity: 0, transform: 'translateX(-40px)' },
    to: { opacity: 1, transform: 'translateX(0px)' },
    config: config.gentle
  });

  const buttonSpring = useSpring({
    ref: buttonRef,
    from: { opacity: 0, transform: 'scale(0)' },
    to: { opacity: 1, transform: 'scale(1)' },
    config: { ...config.wobbly, tension: 300 }
  });

  // Chain animations for staggered effect
  useChain([titleRef, subtitleRef, buttonRef], [0, 0.3, 0.6]);

  // World map background animation with subtle parallax
  const worldMapSpring = useSpring({
    transform: `translateX(${-mousePosition.x * 5}px) translateY(${-mousePosition.y * 3}px) scale(${1 + scrollVelocity * 0.01})`,
    config: config.slow
  });

  // Ocean layer animations with mouse influence
  const deepLayerSpring = useSpring({
    transform: `translateX(${-mousePosition.x * 10}px) translateY(${-mousePosition.y * 5}px)`,
    config: config.slow
  });

  const midLayerSpring = useSpring({
    transform: `translateX(${-mousePosition.x * 20}px) translateY(${-mousePosition.y * 10}px)`,
    config: config.gentle
  });

  const surfaceLayerSpring = useSpring({
    transform: `translateX(${-mousePosition.x * 30}px) translateY(${-mousePosition.y * 15}px)`,
    config: config.default
  });

  // Particle system animation
  const particleSpring = useSpring({
    opacity: isHovering ? 1 : 0.7,
    transform: `scale(${isHovering ? 1.05 : 1})`,
    config: config.gentle
  });

  // Scroll progress for additional effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  // Performance optimized event handlers
  const handleCTAClick = useCallback((e) => {
    e.preventDefault();
    onCTAClick?.();
  }, [onCTAClick]);

  // Canvas setup for wave rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight * 0.7;
      };
      
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
      
      return () => window.removeEventListener('resize', resizeCanvas);
    }
  }, [canvasRef]);

  return (
    <>
      {/* Ocean background that extends throughout the page */}
      <OceanBackground />
      
      <HeroContainer
        ref={containerRef}
        id="home"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* World Maritime Map Background */}
        <WorldMapBackground style={worldMapSpring} />
        
        {/* Advanced wave canvas */}
        <WaveCanvas ref={canvasRef} />
        
        {/* Ocean layers with parallax */}
        <motion.div style={{ y: parallaxY }}>
          <OceanLayer layer="deep" style={deepLayerSpring} />
          <OceanLayer layer="mid" style={midLayerSpring} />
          <OceanLayer layer="surface" style={surfaceLayerSpring} />
        </motion.div>
        
        {/* Caustic light effects */}
        <CausticLayer />
        
        {/* Particle system */}
        <ParticleField style={particleSpring} />
        
        {/* Hero content with glassmorphism */}
        <HeroContent>
          <HeroTitle style={titleSpring}>
            Immerse Yourself
            <br />
            In Digital Depths
          </HeroTitle>
          
          <HeroSubtitle style={subtitleSpring}>
            Experience the intersection of cutting-edge technology and oceanic beauty,
            where innovation flows as naturally as the tide
          </HeroSubtitle>
          
          <CTAButton
            style={buttonSpring}
            onClick={handleCTAClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Explore our ocean-inspired technology"
          >
            Dive Deeper
          </CTAButton>
        </HeroContent>
      </HeroContainer>
    </>
  );
};

Hero.propTypes = {
  onCTAClick: PropTypes.func
};

Hero.defaultProps = {
  onCTAClick: () => {}
};

export default React.memo(Hero);