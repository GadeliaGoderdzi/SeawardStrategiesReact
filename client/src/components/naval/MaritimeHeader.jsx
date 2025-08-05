import React from 'react';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';

// Maritime color palette
const colors = {
  navyBase: '#0a192f',
  deepCharcoal: '#1a1a2e',
  cyan: '#00eeff',
  cyanGlow: '#00eeff20',
  gradientTop: '#0a192fdd',
  gradientBottom: '#0a192faa'
};

// Container for the header
const HeaderContainer = styled.div`
  position: relative;
  width: 100%;
  height: 400px;
  max-width: 1200px;
  margin: 0 auto;
  background: ${colors.navyBase};
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

// World map background with continent outlines
const WorldMapSVG = styled.svg`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

// Continent paths with subtle outlines
const ContinentPath = styled.path`
  fill: transparent;
  stroke: ${colors.deepCharcoal};
  stroke-width: 1;
  opacity: 0.2;
`;

// Pulsing animation for ports
const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.5);
    opacity: 0.7;
  }
`;

// Port marker styling
const PortMarker = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background: white;
  border-radius: 50%;
  box-shadow: 0 0 8px ${colors.cyan};
  animation: ${pulse} 2s infinite;
  z-index: 3;
  
  ${props => `
    left: ${props.x}%;
    top: ${props.y}%;
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    width: 8px;
    height: 8px;
    border: 1px solid ${colors.cyan};
    border-radius: 50%;
    background: rgba(0, 238, 255, 0.1);
  }
`;

// Connection lines between ports
const ConnectionLine = styled.div`
  position: absolute;
  height: 0.5px;
  background: ${colors.cyanGlow};
  z-index: 2;
  transform-origin: left center;
  
  ${props => {
    const x1 = props.x1;
    const y1 = props.y1;
    const x2 = props.x2;
    const y2 = props.y2;
    const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
    
    return `
      left: ${x1}%;
      top: ${y1}%;
      width: ${length}%;
      transform: rotate(${angle}deg);
    `;
  }}
`;

// Vessel triangle styling
const Vessel = styled.div`
  position: absolute;
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
  border-bottom: 8px solid ${colors.cyan};
  filter: drop-shadow(0 0 2px ${colors.cyan}aa);
  z-index: 4;
  
  &:hover {
    transform: scale(1.3);
    transition: all 0.3s ease;
  }
`;

// Sailing animations for different routes
const sailTransPacific1 = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(45deg); }
  5% { opacity: 1; }
  25% { transform: translate(200px, -30px) rotate(60deg); }
  50% { transform: translate(450px, -80px) rotate(75deg); }
  75% { transform: translate(700px, -120px) rotate(90deg); }
  95% { opacity: 1; }
  100% { opacity: 0; transform: translate(850px, -140px) rotate(105deg); }
`;

const sailTransPacific2 = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(-135deg); }
  5% { opacity: 1; }
  25% { transform: translate(-150px, 40px) rotate(-120deg); }
  50% { transform: translate(-350px, 80px) rotate(-105deg); }
  75% { transform: translate(-550px, 100px) rotate(-90deg); }
  95% { opacity: 1; }
  100% { opacity: 0; transform: translate(-700px, 120px) rotate(-75deg); }
`;

const sailAsiaEurope = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(-90deg); }
  5% { opacity: 1; }
  20% { transform: translate(-80px, -20px) rotate(-85deg); }
  40% { transform: translate(-180px, -45px) rotate(-75deg); }
  60% { transform: translate(-280px, -70px) rotate(-65deg); }
  80% { transform: translate(-380px, -95px) rotate(-55deg); }
  95% { opacity: 1; }
  100% { opacity: 0; transform: translate(-450px, -110px) rotate(-45deg); }
`;

const sailTransAtlantic = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(90deg); }
  5% { opacity: 1; }
  25% { transform: translate(120px, 15px) rotate(95deg); }
  50% { transform: translate(250px, 25px) rotate(100deg); }
  75% { transform: translate(380px, 30px) rotate(105deg); }
  95% { opacity: 1; }
  100% { opacity: 0; transform: translate(480px, 35px) rotate(110deg); }
`;

const sailRegional1 = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
  10% { opacity: 1; }
  50% { transform: translate(80px, -40px) rotate(45deg); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translate(120px, -60px) rotate(90deg); }
`;

const sailRegional2 = keyframes`
  0% { opacity: 0; transform: translate(0, 0) rotate(180deg); }
  10% { opacity: 1; }
  50% { transform: translate(-60px, 30px) rotate(135deg); }
  90% { opacity: 1; }
  100% { opacity: 0; transform: translate(-100px, 50px) rotate(90deg); }
`;

// Animated vessel components
const VesselTransPacific1 = styled(Vessel)`
  left: 65%;
  top: 55%;
  animation: ${sailTransPacific1} 18s infinite;
  animation-delay: ${props => props.delay || '0s'};
`;

const VesselTransPacific2 = styled(Vessel)`
  left: 85%;
  top: 45%;
  animation: ${sailTransPacific2} 20s infinite;
  animation-delay: ${props => props.delay || '2s'};
`;

const VesselAsiaEurope = styled(Vessel)`
  left: 65%;
  top: 50%;
  animation: ${sailAsiaEurope} 22s infinite;
  animation-delay: ${props => props.delay || '4s'};
`;

const VesselTransAtlantic = styled(Vessel)`
  left: 25%;
  top: 40%;
  animation: ${sailTransAtlantic} 16s infinite;
  animation-delay: ${props => props.delay || '6s'};
`;

const VesselRegional1 = styled(Vessel)`
  left: 65%;
  top: 52%;
  animation: ${sailRegional1} 12s infinite;
  animation-delay: ${props => props.delay || '1s'};
`;

const VesselRegional2 = styled(Vessel)`
  left: 30%;
  top: 42%;
  animation: ${sailRegional2} 14s infinite;
  animation-delay: ${props => props.delay || '3s'};
`;

// Header overlay gradient
const HeaderOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    135deg,
    ${colors.gradientTop} 0%,
    ${colors.gradientBottom} 100%
  );
  z-index: 5;
`;

// Text content area
const ContentArea = styled(motion.div)`
  position: absolute;
  right: 0;
  top: 0;
  width: 50%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  padding: 2rem;
  z-index: 6;
  text-align: right;
`;

const HeaderTitle = styled.h1`
  font-family: 'Rubik', sans-serif;
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
`;

const HeaderSubtitle = styled.p`
  font-family: 'Lato', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: flex-end;
`;

const NavButton = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  background: rgba(0, 238, 255, 0.1);
  border: 1px solid ${colors.cyan};
  border-radius: 6px;
  color: ${colors.cyan};
  font-family: 'Rubik', sans-serif;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 238, 255, 0.2);
    box-shadow: 0 0 12px ${colors.cyan}33;
    transform: translateY(-2px);
  }
`;

// Port coordinates (percentage-based)
const ports = [
  { name: 'New York', x: 25, y: 40 },
  { name: 'Rotterdam', x: 50, y: 35 },
  { name: 'Beijing', x: 75, y: 42 },
  { name: 'Singapore', x: 65, y: 55 }
];

// Connection lines between major ports
const connections = [
  { x1: 25, y1: 40, x2: 50, y2: 35 }, // NY to Rotterdam
  { x1: 50, y1: 35, x2: 65, y2: 55 }, // Rotterdam to Singapore
  { x1: 65, y1: 55, x2: 75, y2: 42 }, // Singapore to Beijing
  { x1: 75, y1: 42, x2: 25, y2: 40 }, // Beijing to NY (trans-pacific)
];

const MaritimeHeader = () => {
  return (
    <HeaderContainer>
      {/* World Map SVG Background */}
      <WorldMapSVG viewBox="0 0 1200 400">
        {/* Simplified continent outlines */}
        {/* North America */}
        <ContinentPath d="M50,120 Q150,100 250,140 L280,200 Q250,250 200,280 L150,270 Q100,240 80,200 Q60,160 50,120 Z" />
        
        {/* South America */}
        <ContinentPath d="M180,280 Q220,300 240,350 L220,380 Q190,370 170,340 Q160,310 180,280 Z" />
        
        {/* Europe */}
        <ContinentPath d="M480,100 Q520,90 560,110 L580,150 Q560,170 520,160 Q490,140 480,100 Z" />
        
        {/* Africa */}
        <ContinentPath d="M520,160 Q560,180 580,230 L590,300 Q570,350 540,360 Q510,340 500,300 Q505,230 520,160 Z" />
        
        {/* Asia */}
        <ContinentPath d="M600,100 Q750,80 900,120 L920,200 Q880,220 820,210 Q700,180 600,100 Z" />
        
        {/* Australia */}
        <ContinentPath d="M800,280 Q860,270 900,290 L920,320 Q880,330 830,320 Q800,300 800,280 Z" />
      </WorldMapSVG>

      {/* Connection Lines */}
      {connections.map((connection, index) => (
        <ConnectionLine
          key={index}
          x1={connection.x1}
          y1={connection.y1}
          x2={connection.x2}
          y2={connection.y2}
        />
      ))}

      {/* Port Markers */}
      {ports.map((port, index) => (
        <PortMarker
          key={index}
          x={port.x}
          y={port.y}
          title={port.name}
        />
      ))}

      {/* Animated Vessels */}
      <VesselTransPacific1 delay="0s" />
      <VesselTransPacific1 delay="9s" />
      <VesselTransPacific2 delay="2s" />
      <VesselTransPacific2 delay="12s" />
      
      <VesselAsiaEurope delay="4s" />
      <VesselAsiaEurope delay="15s" />
      
      <VesselTransAtlantic delay="6s" />
      <VesselTransAtlantic delay="14s" />
      
      <VesselRegional1 delay="1s" />
      <VesselRegional1 delay="7s" />
      <VesselRegional1 delay="13s" />
      
      <VesselRegional2 delay="3s" />
      <VesselRegional2 delay="8s" />
      <VesselRegional2 delay="16s" />

      {/* Additional random vessels for more activity */}
      <VesselRegional1 delay="5s" />
      <VesselRegional2 delay="10s" />
      <VesselTransPacific1 delay="17s" />

      {/* Header Overlay */}
      <HeaderOverlay />

      {/* Content Area */}
      <ContentArea
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <HeaderTitle>Seaward Strategies</HeaderTitle>
        <HeaderSubtitle>
          Navigate the future of maritime intelligence with data-driven insights 
          and strategic analytics for the global shipping industry.
        </HeaderSubtitle>
        
        <NavigationButtons>
          <NavButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Intelligence Platform
          </NavButton>
          <NavButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Analytics Suite
          </NavButton>
          <NavButton
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </NavButton>
        </NavigationButtons>
      </ContentArea>
    </HeaderContainer>
  );
};

export default MaritimeHeader;