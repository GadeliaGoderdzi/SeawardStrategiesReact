import styled from 'styled-components';
import { motion } from 'framer-motion';
import { 
  MARITIME_COLORS, 
  VESSEL_COLORS, 
  Z_INDEX_LAYERS, 
  BREAKPOINTS,
  RADAR_CONFIG 
} from '../../constants/maritimeConstants';

// ===== LAYOUT COMPONENTS =====

export const LandingContainer = styled.div`
  width: 100%;
  min-height: 80vh;
  overflow-x: hidden;
  overflow-y: hidden;
  background: ${MARITIME_COLORS.deepNavy};
  position: relative;
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    min-height: 80vh;
    overflow-x: hidden;
    overflow-y: hidden;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    min-height: 80vh;
    overflow-x: hidden;
    overflow-y: hidden;
  }
`;

export const HeroSection = styled.section`
  height: 80vh;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #1a365d 0%, #0a2463 100%);
  display: flex;
  flex-direction: column;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='paper' x='0' y='0' width='100' height='100' patternUnits='userSpaceOnUse'%3E%3Cg opacity='0.05'%3E%3Ccircle cx='20' cy='20' r='1' fill='%23ffffff'/%3E%3Ccircle cx='80' cy='60' r='0.5' fill='%23ffffff'/%3E%3Ccircle cx='40' cy='80' r='0.8' fill='%23ffffff'/%3E%3C/g%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23paper)'/%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: 1;
  }
`;

// ===== WORLD MAP COMPONENTS =====

export const WorldMap = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: ${Z_INDEX_LAYERS.worldMap};
  background: 
    /* Maritime depth overlay */
    radial-gradient(circle at 20% 30%, rgba(30, 64, 175, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(30, 64, 175, 0.08) 0%, transparent 50%),
    /* Deep ocean base */
    linear-gradient(135deg, #0a2463 0%, #1a365d 100%);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      /* Ocean water texture */
      radial-gradient(circle at 25% 25%, rgba(30, 64, 175, 0.03) 1px, transparent 1px),
      radial-gradient(circle at 75% 75%, rgba(30, 64, 175, 0.02) 1px, transparent 1px);
    background-size: 15px 15px, 20px 20px;
    background-position: 0 0, 10px 10px;
    z-index: 1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 1000 500' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M120 80 Q180 60 240 80 L320 100 Q380 85 440 105 L520 120 Q580 105 640 125 L720 140 Q780 125 840 145 L900 160 Q960 145 1000 165 L1000 200 Q940 180 880 200 L800 220 Q740 205 680 225 L600 240 Q540 225 480 245 L400 260 Q340 245 280 265 L200 280 Q140 265 80 285 L120 80 Z' fill='rgba(30, 64, 175, 0.15)' stroke='rgba(30, 64, 175, 0.3)' stroke-width='1'/%3E%3Cpath d='M80 180 Q140 160 200 180 L280 200 Q340 185 400 205 L480 220 Q540 205 600 225 L680 240 Q740 225 800 245 L880 260 Q940 245 1000 265 L1000 320 Q940 300 880 320 L800 340 Q740 325 680 345 L600 360 Q540 345 480 365 L400 380 Q340 365 280 385 L200 400 Q140 385 80 405 L80 180 Z' fill='rgba(30, 64, 175, 0.12)' stroke='rgba(30, 64, 175, 0.25)' stroke-width='1'/%3E%3Cpath d='M200 320 Q260 300 320 320 L400 340 Q460 325 520 345 L600 360 Q660 345 720 365 L800 380 Q860 365 920 385 L920 420 Q860 400 800 420 L720 440 Q660 425 600 445 L520 460 Q460 445 400 465 L320 480 Q260 465 200 485 L200 320 Z' fill='rgba(30, 64, 175, 0.1)' stroke='rgba(30, 64, 175, 0.2)' stroke-width='1'/%3E%3Cg stroke='rgba(30, 64, 175, 0.15)' stroke-width='0.5' fill='none'%3E%3Cline x1='0' y1='100' x2='1000' y2='100'/%3E%3Cline x1='0' y1='200' x2='1000' y2='200'/%3E%3Cline x1='0' y1='300' x2='1000' y2='300'/%3E%3Cline x1='0' y1='400' x2='1000' y2='400'/%3E%3Cline x1='200' y1='0' x2='200' y2='500'/%3E%3Cline x1='400' y1='0' x2='400' y2='500'/%3E%3Cline x1='600' y1='0' x2='600' y2='500'/%3E%3Cline x1='800' y1='0' x2='800' y2='500'/%3E%3C/g%3E%3C/svg%3E");
    background-size: cover;
    opacity: 0.6;
  }
`;

export const ShippingRoute = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 13;
`;

// ===== VESSEL COMPONENTS =====

export const Vessel = styled.div`
  position: absolute;
  width: 0;  /* Required for CSS triangles */
  height: 0; /* Required for CSS triangles */
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-bottom: 30px solid;
  z-index: ${Z_INDEX_LAYERS.vessel};
  pointer-events: none;
  
  &.cargo {
    border-bottom-color: ${VESSEL_COLORS.cargo};
    filter: drop-shadow(0 0 4px rgba(16, 185, 129, 0.6));
  }
  
  &.passenger {
    border-bottom-color: ${VESSEL_COLORS.passenger};
    filter: drop-shadow(0 0 4px rgba(239, 68, 68, 0.6));
  }
  
  &.military {
    border-bottom-color: ${VESSEL_COLORS.military};
    filter: drop-shadow(0 0 4px rgba(245, 158, 11, 0.6));
  }
`;

// ===== RADAR COMPONENTS =====

export const RadarHub = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: ${RADAR_CONFIG.hubSize.desktop}px;
  height: ${RADAR_CONFIG.hubSize.desktop}px;
  border: 2px solid rgba(30, 64, 175, 0.3);
  border-radius: 50%;
  z-index: ${Z_INDEX_LAYERS.radarHub};
  background: radial-gradient(
    circle,
    rgba(10, 36, 99, 0.8) 0%,
    rgba(10, 36, 99, 0.4) 50%,
    transparent 100%
  );
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: ${RADAR_CONFIG.hubSize.tablet}px;
    height: ${RADAR_CONFIG.hubSize.tablet}px;
    border-width: 2px;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: ${RADAR_CONFIG.hubSize.mobile}px;
    height: ${RADAR_CONFIG.hubSize.mobile}px;
    border-width: 1px;
  }
  
  @media (max-width: 360px) {
    width: ${RADAR_CONFIG.hubSize.smallMobile}px;
    height: ${RADAR_CONFIG.hubSize.smallMobile}px;
  }
`;

export const RadarRings = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border: 1px solid rgba(30, 64, 175, 0.2);
    border-radius: 50%;
  }
  
  &::before {
    width: 70%;
    height: 70%;
  }
  
  &::after {
    width: 40%;
    height: 40%;
  }
`;

export const RadarPing = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: ${RADAR_CONFIG.pingSize.initial}px;
  height: ${RADAR_CONFIG.pingSize.initial}px;
  border: 3px solid rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: radarPing 3s ease-out infinite;
  z-index: ${Z_INDEX_LAYERS.radarPing};
  pointer-events: none;
  
  &::before {
    content: '';
    position: absolute;
    top: -3px;
    left: -3px;
    right: -3px;
    bottom: -3px;
    border: 2px solid rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    animation: radarPingOuter 3s ease-out infinite 0.3s;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -8px;
    left: -8px;
    right: -8px;
    bottom: -8px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    animation: radarPingFar 3s ease-out infinite 0.6s;
  }
  
  @keyframes radarPing {
    0% {
      width: ${RADAR_CONFIG.pingSize.initial}px;
      height: ${RADAR_CONFIG.pingSize.initial}px;
      opacity: 1;
      border-width: 3px;
    }
    70% {
      width: 500px;
      height: 500px;
      opacity: 0.6;
      border-width: 2px;
    }
    100% {
      width: ${RADAR_CONFIG.pingSize.max}px;
      height: ${RADAR_CONFIG.pingSize.max}px;
      opacity: 0;
      border-width: 1px;
    }
  }
  
  @keyframes radarPingOuter {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    70% {
      opacity: 0.4;
      transform: scale(2.2);
    }
    100% {
      opacity: 0;
      transform: scale(2.8);
    }
  }
  
  @keyframes radarPingFar {
    0% {
      opacity: 1;
      transform: scale(1);
    }
    70% {
      opacity: 0.2;
      transform: scale(2.5);
    }
    100% {
      opacity: 0;
      transform: scale(3.2);
    }
  }
`;

export const RadarDot = styled(motion.div)`
  position: absolute;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: rgba(30, 64, 175, 0.9);
  box-shadow: 
    0 0 8px rgba(30, 64, 175, 0.8),
    0 0 16px rgba(30, 64, 175, 0.4);
  z-index: ${Z_INDEX_LAYERS.radarDot};
  animation: contactPulse 2s ease-in-out infinite;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    border: 1px solid rgba(30, 64, 175, 0.3);
    animation: contactRipple 2s ease-out infinite;
  }
  
  @keyframes contactPulse {
    0%, 100% { 
      opacity: 0.8;
      transform: scale(1);
    }
    50% { 
      opacity: 1;
      transform: scale(1.2);
    }
  }
  
  @keyframes contactRipple {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }
    100% {
      transform: scale(3);
      opacity: 0;
    }
  }
`;

// ===== LOGO COMPONENTS =====

export const LogoContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: radial-gradient(
    circle,
    rgba(10, 36, 99, 0.9) 0%,
    rgba(10, 36, 99, 0.7) 100%
  );
  border: 3px solid rgba(30, 64, 175, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: ${Z_INDEX_LAYERS.logoContainer};
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    width: 150px;
    height: 150px;
    border-width: 2px;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    width: 120px;
    height: 120px;
    border-width: 2px;
  }
`;

export const LogoText = styled.div`
  text-align: center;
  color: ${MARITIME_COLORS.foamWhite};
  padding: 0 1rem;
  
  .company-name {
    font-family: 'Rubik', sans-serif;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    line-height: 1.2;
    
    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 1.2rem;
      margin-bottom: 0.3rem;
    }
    
    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 1rem;
      margin-bottom: 0.2rem;
    }
  }
  
  .motto {
    font-family: 'Lato', sans-serif;
    font-size: 0.9rem;
    font-style: italic;
    opacity: 0.8;
    line-height: 1.3;
    
    @media (max-width: ${BREAKPOINTS.tablet}) {
      font-size: 0.8rem;
    }
    
    @media (max-width: ${BREAKPOINTS.mobile}) {
      font-size: 0.7rem;
      line-height: 1.2;
    }
  }
`;

// ===== HERO CONTENT COMPONENTS =====

export const HeroContent = styled.div`
  position: absolute;
  bottom: 4rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: ${Z_INDEX_LAYERS.heroContent};
  width: 90%;
  max-width: 600px;
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    bottom: 3rem;
    width: 95%;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    bottom: 2rem;
    width: 95%;
  }
`;

export const HeroSubtitle = styled(motion.p)`
  font-family: 'Lato', sans-serif;
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
  padding: 0 1rem;
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
    line-height: 1.5;
    padding: 0 0.5rem;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    font-size: 1rem;
    margin-bottom: 1.2rem;
    line-height: 1.4;
    padding: 0;
  }
`;

export const CTAButton = styled(motion.button)`
  background: linear-gradient(135deg, ${MARITIME_COLORS.dataTeal}, ${MARITIME_COLORS.safetyOrange});
  border: none;
  padding: 1rem 2.5rem;
  font-family: 'Rubik', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  color: ${MARITIME_COLORS.foamWhite};
  border-radius: 50px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(30, 64, 175, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: all 0.6s ease;
  }
  
  &:hover::before {
    width: 300px;
    height: 300px;
  }
  
  @media (max-width: ${BREAKPOINTS.tablet}) {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
  
  @media (max-width: ${BREAKPOINTS.mobile}) {
    padding: 0.8rem 1.8rem;
    font-size: 0.95rem;
    border-radius: 40px;
  }
`;

// ===== GLOBAL STYLES =====

export const GlobalStyles = styled.div`
  /* Ensure no unwanted scroll bars */
  html, body {
    overflow-x: hidden;
    margin: 0;
    padding: 0;
  }
  
  /* Hero section specific overflow control */
  .hero-section {
    overflow: hidden !important;
  }
  
  @keyframes sparkFlash {
    0% {
      opacity: 1;
      transform: scale(0.5);
    }
    50% {
      opacity: 1;
      transform: scale(1.5);
    }
    100% {
      opacity: 0;
      transform: scale(2);
    }
  }
`; 