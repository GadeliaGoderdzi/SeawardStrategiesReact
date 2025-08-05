import React, { useRef, useEffect, useState, useMemo } from 'react';
import { motion, useScroll, useTransform, useAnimationFrame } from 'framer-motion';
import styled, { keyframes } from 'styled-components';
import PropTypes from 'prop-types';

// Underwater debris floating animation
const underwaterFloat = keyframes`
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
  }
  25% { 
    transform: translateY(-15px) translateX(8px) rotate(2deg);
  }
  50% { 
    transform: translateY(-25px) translateX(15px) rotate(-1deg);
  }
  75% { 
    transform: translateY(-10px) translateX(5px) rotate(1deg);
  }
`;

// Sinking animation for flags and cloth
const sinkingMotion = keyframes`
  0%, 100% { 
    transform: translateY(0px) rotate(0deg) scaleY(1);
  }
  25% { 
    transform: translateY(10px) rotate(-2deg) scaleY(0.95);
  }
  50% { 
    transform: translateY(20px) rotate(1deg) scaleY(0.9);
  }
  75% { 
    transform: translateY(15px) rotate(-1deg) scaleY(0.95);
  }
`;

// Gentle swaying for large wreckage
const wreckSway = keyframes`
  0%, 100% { 
    transform: rotate(0deg) translateX(0px);
  }
  50% { 
    transform: rotate(0.5deg) translateX(3px);
  }
`;

// Caustic light patterns
const causticShimmer = keyframes`
  0% { 
    opacity: 0.3;
    transform: translateX(0) scale(1);
  }
  33% { 
    opacity: 0.7;
    transform: translateX(20px) scale(1.1);
  }
  66% { 
    opacity: 0.5;
    transform: translateX(40px) scale(0.9);
  }
  100% { 
    opacity: 0.3;
    transform: translateX(60px) scale(1);
  }
`;

// Ocean container that extends full page and follows scroll
const OceanContainer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  min-height: 100vh;
  height: 100%;
  z-index: -1;
  overflow: hidden;
  
  background: linear-gradient(
    180deg,
    hsl(205, 90%, 88%) 0%,
    hsl(208, 85%, 75%) 8%,
    hsl(210, 80%, 62%) 16%,
    hsl(212, 85%, 50%) 24%,
    hsl(215, 90%, 40%) 32%,
    hsl(218, 95%, 32%) 40%,
    hsl(220, 98%, 26%) 48%,
    hsl(222, 100%, 22%) 56%,
    hsl(225, 100%, 18%) 64%,
    hsl(228, 100%, 15%) 72%,
    hsl(230, 100%, 12%) 80%,
    hsl(232, 100%, 10%) 88%,
    hsl(235, 100%, 8%) 96%,
    hsl(238, 100%, 6%) 100%
  );
  
  /* Add subtle texture overlay for more realistic ocean look */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 60% 70%, rgba(255, 255, 255, 0.08) 0%, transparent 60%),
      radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 40%);
    opacity: 0.6;
    mix-blend-mode: overlay;
  }
`;

// Advanced parallax depth layers
const ParallaxLayer = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 120%;
  height: 120%;
  pointer-events: none;
`;

// Far background layer
const FarBackgroundLayer = styled(ParallaxLayer)`
  z-index: 1;
  background: 
    radial-gradient(ellipse 80% 60% at 20% 30%, hsla(215, 100%, 85%, 0.03) 0%, transparent 70%),
    radial-gradient(ellipse 100% 80% at 80% 70%, hsla(210, 90%, 80%, 0.02) 0%, transparent 60%);
  opacity: 0.6;
`;

// Background reef/coral silhouettes
const BackgroundReefs = styled(ParallaxLayer)`
  z-index: 2;
  background: 
    radial-gradient(ellipse 40% 60% at 15% 85%, hsla(220, 60%, 30%, 0.1) 0%, transparent 70%),
    radial-gradient(ellipse 50% 70% at 85% 90%, hsla(225, 70%, 25%, 0.08) 0%, transparent 60%),
    radial-gradient(ellipse 30% 40% at 60% 95%, hsla(230, 80%, 20%, 0.06) 0%, transparent 50%);
`;

// Middle depth atmospheric layers
const DepthLayer = styled(ParallaxLayer)`
  &.depth-1 {
    z-index: 3;
    background: radial-gradient(
      ellipse 70% 50% at 25% 25%,
      hsla(210, 100%, 80%, 0.08) 0%,
      transparent 70%
    );
  }
  
  &.depth-2 {
    z-index: 4;
    background: radial-gradient(
      ellipse 90% 60% at 75% 55%,
      hsla(200, 85%, 70%, 0.06) 0%,
      transparent 65%
    );
  }
  
  &.depth-3 {
    z-index: 5;
    background: radial-gradient(
      ellipse 110% 70% at 45% 75%,
      hsla(190, 70%, 60%, 0.04) 0%,
      transparent 55%
    );
  }
`;

// Floating particles layer
const ParticleLayer = styled(ParallaxLayer)`
  z-index: 15;
  opacity: 0.7;
`;

// Foreground elements
const ForegroundLayer = styled(ParallaxLayer)`
  z-index: 20;
  opacity: 0.3;
`;

// Caustic light effects
const CausticLights = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 4;
  pointer-events: none;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(ellipse 200px 100px at 20% 30%, hsla(190, 100%, 90%, 0.15) 0%, transparent 70%),
      radial-gradient(ellipse 150px 80px at 60% 50%, hsla(200, 100%, 85%, 0.12) 0%, transparent 70%),
      radial-gradient(ellipse 180px 90px at 80% 70%, hsla(210, 100%, 95%, 0.1) 0%, transparent 70%);
    animation: ${causticShimmer} 12s ease-in-out infinite;
  }
  
  &::after {
    animation-delay: -6s;
    animation-duration: 15s;
  }
`;

// Shipwreck components
const Shipwreck = styled(motion.div)`
  position: absolute;
  z-index: 5;
  filter: drop-shadow(0 15px 30px rgba(0, 0, 0, 0.4));
  
  &.large-wreck {
    bottom: 10%;
    right: 15%;
    animation: ${wreckSway} 20s ease-in-out infinite;
  }
  
  &.medium-wreck {
    bottom: 25%;
    left: 20%;
    animation: ${wreckSway} 25s ease-in-out infinite;
    animation-delay: -5s;
  }
  
  &.broken-mast {
    bottom: 40%;
    right: 40%;
    animation: ${underwaterFloat} 15s ease-in-out infinite;
    animation-delay: -8s;
  }
`;

// Naval artifacts
const NavalArtifact = styled(motion.div)`
  position: absolute;
  z-index: 6;
  filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.3));
  
  &.anchor {
    animation: ${sinkingMotion} 18s ease-in-out infinite;
  }
  
  &.sword {
    animation: ${underwaterFloat} 12s ease-in-out infinite;
  }
  
  &.flag {
    animation: ${sinkingMotion} 14s ease-in-out infinite;
  }
  
  &.cannon {
    animation: ${underwaterFloat} 22s ease-in-out infinite;
  }
  
  &.chest {
    animation: ${wreckSway} 16s ease-in-out infinite;
  }
`;

// Debris field
const DebrisField = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 7;
  pointer-events: none;
`;

const DebrisItem = styled(motion.div)`
  position: absolute;
  opacity: 0.7;
  animation: ${underwaterFloat} 10s ease-in-out infinite;
  
  &:nth-child(odd) {
    animation-direction: reverse;
  }
  
  &:nth-child(3n) {
    animation-duration: 15s;
  }
`;

// Large shipwreck SVG component
const LargeShipwreckSVG = () => (
  <svg width="300" height="150" viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="shipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 69, 19, 0.9)" />
        <stop offset="50%" stopColor="rgba(101, 67, 33, 0.8)" />
        <stop offset="100%" stopColor="rgba(85, 55, 28, 0.7)" />
      </linearGradient>
      <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(105, 105, 105, 0.8)" />
        <stop offset="100%" stopColor="rgba(64, 64, 64, 0.9)" />
      </linearGradient>
    </defs>
    
    {/* Main hull */}
    <path d="M50,120 L250,120 L280,100 L270,80 L240,85 L50,85 Z" fill="url(#shipGrad)" />
    
    {/* Broken deck */}
    <rect x="60" y="85" width="180" height="15" fill="url(#shipGrad)" opacity="0.8" />
    
    {/* Broken masts */}
    <rect x="120" y="40" width="8" height="45" fill="url(#shipGrad)" transform="rotate(15 124 62)" />
    <rect x="200" y="50" width="6" height="35" fill="url(#shipGrad)" transform="rotate(-10 203 67)" />
    
    {/* Cannons */}
    <circle cx="80" cy="95" r="4" fill="url(#metalGrad)" />
    <circle cx="120" cy="95" r="4" fill="url(#metalGrad)" />
    <circle cx="160" cy="95" r="4" fill="url(#metalGrad)" />
    
    {/* Damage holes */}
    <ellipse cx="180" cy="110" rx="15" ry="8" fill="rgba(0, 0, 0, 0.5)" />
    <ellipse cx="220" cy="105" rx="10" ry="6" fill="rgba(0, 0, 0, 0.5)" />
    
    {/* Seaweed */}
    <path d="M90,120 Q95,135 90,150 Q85,135 90,120" fill="rgba(34, 139, 34, 0.6)" />
    <path d="M180,120 Q185,140 180,160 Q175,140 180,120" fill="rgba(46, 125, 50, 0.5)" />
  </svg>
);

// Medium wreck SVG
const MediumWreckSVG = () => (
  <svg width="200" height="100" viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wreckGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 69, 19, 0.8)" />
        <stop offset="100%" stopColor="rgba(85, 55, 28, 0.6)" />
      </linearGradient>
    </defs>
    
    {/* Tilted hull section */}
    <path d="M30,70 L170,70 L180,60 L175,45 L150,50 L30,50 Z" fill="url(#wreckGrad)" transform="rotate(8 100 60)" />
    
    {/* Broken planks */}
    <rect x="50" y="50" width="80" height="6" fill="url(#wreckGrad)" opacity="0.7" transform="rotate(8 90 53)" />
    <rect x="90" y="58" width="60" height="4" fill="url(#wreckGrad)" opacity="0.6" transform="rotate(8 120 60)" />
    
    {/* Mast piece */}
    <rect x="100" y="20" width="4" height="30" fill="url(#wreckGrad)" transform="rotate(25 102 35)" />
  </svg>
);

// Anchor SVG
const AnchorSVG = ({ size = 60 }) => (
  <svg width={size} height={size * 1.2} viewBox="0 0 60 72" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="anchorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(105, 105, 105, 0.9)" />
        <stop offset="100%" stopColor="rgba(64, 64, 64, 0.8)" />
      </linearGradient>
    </defs>
    
    {/* Main shaft */}
    <rect x="28" y="8" width="4" height="45" fill="url(#anchorGrad)" />
    
    {/* Ring */}
    <circle cx="30" cy="12" r="6" fill="none" stroke="url(#anchorGrad)" strokeWidth="3" />
    
    {/* Cross bar */}
    <rect x="15" y="28" width="30" height="3" fill="url(#anchorGrad)" />
    
    {/* Flukes */}
    <path d="M15,30 L10,45 L20,40 Z" fill="url(#anchorGrad)" />
    <path d="M45,30 L50,45 L40,40 Z" fill="url(#anchorGrad)" />
    
    {/* Chain */}
    <circle cx="30" cy="4" r="2" fill="none" stroke="url(#anchorGrad)" strokeWidth="1.5" />
    <circle cx="30" cy="0" r="2" fill="none" stroke="url(#anchorGrad)" strokeWidth="1.5" />
  </svg>
);

// Naval sword SVG
const NavalSwordSVG = ({ size = 50 }) => (
  <svg width={size * 0.3} height={size} viewBox="0 0 15 50" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="bladeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(192, 192, 192, 0.9)" />
        <stop offset="100%" stopColor="rgba(128, 128, 128, 0.8)" />
      </linearGradient>
      <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 69, 19, 0.9)" />
        <stop offset="100%" stopColor="rgba(85, 55, 28, 0.8)" />
      </linearGradient>
    </defs>
    
    {/* Blade */}
    <path d="M7,5 L9,5 L8,35 L7,35 Z" fill="url(#bladeGrad)" />
    
    {/* Cross guard */}
    <rect x="3" y="33" width="9" height="2" fill="url(#bladeGrad)" />
    
    {/* Handle */}
    <rect x="6" y="35" width="3" height="12" fill="url(#handleGrad)" />
    
    {/* Pommel */}
    <circle cx="7.5" cy="48" r="2" fill="url(#handleGrad)" />
  </svg>
);

// Sinking flag SVG
const SinkingFlagSVG = ({ size = 40 }) => (
  <svg width={size * 1.5} height={size} viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="flagGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(220, 20, 60, 0.8)" />
        <stop offset="100%" stopColor="rgba(139, 0, 0, 0.6)" />
      </linearGradient>
    </defs>
    
    {/* Flag pole */}
    <rect x="2" y="0" width="2" height="35" fill="rgba(139, 69, 19, 0.8)" />
    
    {/* Torn flag */}
    <path d="M4,5 L50,5 L50,20 L40,15 L50,25 L4,25 Z" fill="url(#flagGrad)" opacity="0.7" />
    
    {/* Tears in flag */}
    <path d="M25,5 L27,8 L25,12 L23,8 Z" fill="rgba(0,0,0,0.2)" />
    <path d="M35,15 L38,18 L35,22 L32,18 Z" fill="rgba(0,0,0,0.2)" />
  </svg>
);

// Treasure chest SVG
const TreasureChestSVG = ({ size = 45 }) => (
  <svg width={size} height={size * 0.7} viewBox="0 0 45 32" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="chestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 69, 19, 0.9)" />
        <stop offset="100%" stopColor="rgba(85, 55, 28, 0.7)" />
      </linearGradient>
      <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(255, 215, 0, 0.8)" />
        <stop offset="100%" stopColor="rgba(218, 165, 32, 0.6)" />
      </linearGradient>
    </defs>
    
    {/* Chest base */}
    <rect x="5" y="18" width="35" height="12" fill="url(#chestGrad)" rx="2" />
    
    {/* Chest lid (slightly open) */}
    <path d="M5,18 L40,18 L38,8 L7,8 Z" fill="url(#chestGrad)" />
    
    {/* Gold coins spilling out */}
    <circle cx="20" cy="15" r="2" fill="url(#goldGrad)" />
    <circle cx="25" cy="16" r="1.5" fill="url(#goldGrad)" />
    <circle cx="30" cy="14" r="2" fill="url(#goldGrad)" />
    
    {/* Metal bands */}
    <rect x="5" y="20" width="35" height="2" fill="rgba(105, 105, 105, 0.7)" />
    <rect x="5" y="26" width="35" height="2" fill="rgba(105, 105, 105, 0.7)" />
  </svg>
);

// Naval cannon SVG
const NavalCannonSVG = ({ size = 50 }) => (
  <svg width={size * 1.4} height={size * 0.8} viewBox="0 0 70 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="cannonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(105, 105, 105, 0.9)" />
        <stop offset="100%" stopColor="rgba(64, 64, 64, 0.8)" />
      </linearGradient>
      <linearGradient id="bronzeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(205, 127, 50, 0.9)" />
        <stop offset="100%" stopColor="rgba(160, 82, 45, 0.8)" />
      </linearGradient>
    </defs>
    
    {/* Cannon barrel */}
    <ellipse cx="35" cy="15" rx="30" ry="6" fill="url(#bronzeGrad)" />
    <rect x="5" y="9" width="60" height="12" fill="url(#bronzeGrad)" rx="6" />
    
    {/* Cannon carriage */}
    <path d="M15,25 L55,25 L50,35 L20,35 Z" fill="url(#cannonGrad)" />
    
    {/* Wheels */}
    <circle cx="25" cy="32" r="7" fill="url(#cannonGrad)" />
    <circle cx="45" cy="32" r="7" fill="url(#cannonGrad)" />
    
    {/* Wheel spokes */}
    <line x1="25" y1="25" x2="25" y2="39" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="2" />
    <line x1="18" y1="32" x2="32" y2="32" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="2" />
    <line x1="45" y1="25" x2="45" y2="39" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="2" />
    <line x1="38" y1="32" x2="52" y2="32" stroke="rgba(139, 69, 19, 0.8)" strokeWidth="2" />
  </svg>
);

// Ship wheel SVG
const ShipWheelSVG = ({ size = 40 }) => (
  <svg width={size} height={size} viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="wheelGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="rgba(139, 69, 19, 0.9)" />
        <stop offset="100%" stopColor="rgba(85, 55, 28, 0.7)" />
      </linearGradient>
    </defs>
    
    {/* Outer rim */}
    <circle cx="20" cy="20" r="18" fill="none" stroke="url(#wheelGrad)" strokeWidth="3" />
    
    {/* Inner hub */}
    <circle cx="20" cy="20" r="4" fill="url(#wheelGrad)" />
    
    {/* Spokes */}
    <line x1="20" y1="2" x2="20" y2="38" stroke="url(#wheelGrad)" strokeWidth="2" />
    <line x1="2" y1="20" x2="38" y2="20" stroke="url(#wheelGrad)" strokeWidth="2" />
    <line x1="7.2" y1="7.2" x2="32.8" y2="32.8" stroke="url(#wheelGrad)" strokeWidth="2" />
    <line x1="32.8" y1="7.2" x2="7.2" y2="32.8" stroke="url(#wheelGrad)" strokeWidth="2" />
    
    {/* Handles */}
    <rect x="18" y="0" width="4" height="6" fill="url(#wheelGrad)" rx="2" />
    <rect x="18" y="34" width="4" height="6" fill="url(#wheelGrad)" rx="2" />
    <rect x="0" y="18" width="6" height="4" fill="url(#wheelGrad)" rx="2" />
    <rect x="34" y="18" width="6" height="4" fill="url(#wheelGrad)" rx="2" />
  </svg>
);

// Debris items (small pieces)
const SmallDebrisSVG = ({ type, size = 20 }) => {
  switch (type) {
    case 'plank':
      return (
        <svg width={size * 2} height={size * 0.3} viewBox="0 0 40 6" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" y="0" width="40" height="6" fill="rgba(139, 69, 19, 0.6)" rx="3" />
        </svg>
      );
    case 'rope':
      return (
        <svg width={size} height={size * 1.5} viewBox="0 0 20 30" xmlns="http://www.w3.org/2000/svg">
          <path d="M10,0 Q15,10 10,20 Q5,25 10,30" stroke="rgba(139, 115, 85, 0.7)" strokeWidth="3" fill="none" />
        </svg>
      );
    case 'barrel':
      return (
        <svg width={size} height={size * 1.2} viewBox="0 0 20 24" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="10" cy="12" rx="8" ry="12" fill="rgba(139, 69, 19, 0.7)" />
          <rect x="2" y="8" width="16" height="2" fill="rgba(85, 55, 28, 0.8)" />
          <rect x="2" y="14" width="16" height="2" fill="rgba(85, 55, 28, 0.8)" />
        </svg>
      );
    default:
      return null;
  }
};

// Floating particle animations
const floatUp = keyframes`
  0% { 
    transform: translateY(100vh) translateX(0px) scale(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
    transform: translateY(90vh) translateX(10px) scale(1);
  }
  50% {
    transform: translateY(50vh) translateX(-15px) scale(1.2);
  }
  90% {
    opacity: 1;
    transform: translateY(10vh) translateX(5px) scale(0.8);
  }
  100% { 
    transform: translateY(-10vh) translateX(-10px) scale(0);
    opacity: 0;
  }
`;

const bubbleFloat = keyframes`
  0% { 
    transform: translateY(0px) translateX(0px) scale(1);
  }
  25% {
    transform: translateY(-20px) translateX(8px) scale(1.1);
  }
  50% {
    transform: translateY(-40px) translateX(-5px) scale(0.9);
  }
  75% {
    transform: translateY(-60px) translateX(12px) scale(1.05);
  }
  100% { 
    transform: translateY(-80px) translateX(-8px) scale(1);
  }
`;

// Particle components
const FloatingParticle = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  opacity: 0.6;
  animation: ${floatUp} 15s linear infinite;
  
  &.small {
    width: 3px;
    height: 3px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(200, 230, 255, 0.4) 100%);
  }
  
  &.medium {
    width: 5px;
    height: 5px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.6) 0%, rgba(180, 220, 255, 0.3) 100%);
  }
  
  &.large {
    width: 7px;
    height: 7px;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, rgba(160, 210, 255, 0.2) 100%);
  }
`;

const Bubble = styled(motion.div)`
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.2) 70%, transparent 100%);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: ${bubbleFloat} 8s ease-in-out infinite;
  opacity: 0.7;
`;

// Seaweed animation
const seaweedSway = keyframes`
  0%, 100% { 
    transform: rotate(-2deg) scaleY(1);
  }
  50% { 
    transform: rotate(2deg) scaleY(1.05);
  }
`;

const SeaweedStrand = styled(motion.div)`
  position: absolute;
  animation: ${seaweedSway} 6s ease-in-out infinite;
  transform-origin: bottom center;
  z-index: 10;
`;

// Foreground kelp/seaweed SVG
const KelpSVG = ({ height = 200, opacity = 0.3 }) => (
  <svg width="40" height={height} viewBox={`0 0 40 ${height}`} xmlns="http://www.w3.org/2000/svg">
    <path 
      d={`M20,${height} Q15,${height * 0.8} 20,${height * 0.6} Q25,${height * 0.4} 20,${height * 0.2} Q15,${height * 0.1} 20,0`}
      fill={`rgba(34, 139, 34, ${opacity})`}
      stroke={`rgba(46, 125, 50, ${opacity * 0.8})`}
      strokeWidth="1"
    />
    <path 
      d={`M25,${height} Q30,${height * 0.9} 25,${height * 0.7} Q20,${height * 0.5} 25,${height * 0.3} Q30,${height * 0.1} 25,0`}
      fill={`rgba(46, 125, 50, ${opacity * 0.8})`}
      stroke={`rgba(34, 139, 34, ${opacity * 0.6})`}
      strokeWidth="1"
    />
  </svg>
);

// Main Ocean Background component
const OceanBackground = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  
  // Advanced parallax transforms for multiple depth layers
  // Background layers (slowest movement)
  const backgroundY = useTransform(scrollY, [0, 2000], [0, -100]);
  const farBackY = useTransform(scrollY, [0, 2000], [0, -200]);
  
  // Middle distance layers
  const depth1Y = useTransform(scrollY, [0, 2000], [0, -300]);
  const depth2Y = useTransform(scrollY, [0, 2000], [0, -500]);
  const depth3Y = useTransform(scrollY, [0, 2000], [0, -700]);
  
  // Object layers with varying speeds
  const wrecksY = useTransform(scrollY, [0, 2000], [0, -400]);
  const artifactsY = useTransform(scrollY, [0, 2000], [0, -600]);
  const debrisY = useTransform(scrollY, [0, 2000], [0, -200]);
  
  // Foreground layers (fastest movement)
  const particlesY = useTransform(scrollY, [0, 2000], [0, -800]);
  const foregroundY = useTransform(scrollY, [0, 2000], [0, -1000]);
  
  // Horizontal parallax for added depth
  const backgroundX = useTransform(scrollY, [0, 2000], [0, -50]);
  const midgroundX = useTransform(scrollY, [0, 2000], [0, 25]);
  const foregroundX = useTransform(scrollY, [0, 2000], [0, -75]);

  // Naval artifacts positioned throughout the scene
  const navalArtifacts = useMemo(() => [
    { type: 'anchor', x: 15, y: 60, size: 60, delay: 0 },
    { type: 'anchor', x: 75, y: 80, size: 45, delay: 3 },
    { type: 'anchor', x: 90, y: 45, size: 35, delay: 8 },
    { type: 'sword', x: 35, y: 45, size: 50, delay: 1.5 },
    { type: 'sword', x: 65, y: 70, size: 40, delay: 4.5 },
    { type: 'sword', x: 5, y: 85, size: 45, delay: 9 },
    { type: 'sword', x: 55, y: 25, size: 38, delay: 12 },
    { type: 'flag', x: 25, y: 35, size: 40, delay: 2 },
    { type: 'flag', x: 85, y: 55, size: 35, delay: 5 },
    { type: 'flag', x: 10, y: 25, size: 42, delay: 10 },
    { type: 'flag', x: 70, y: 40, size: 38, delay: 13 },
    { type: 'chest', x: 45, y: 85, size: 45, delay: 2.5 },
    { type: 'chest', x: 20, y: 75, size: 40, delay: 6 },
    { type: 'chest', x: 82, y: 90, size: 38, delay: 11 },
    { type: 'cannon', x: 30, y: 65, size: 50, delay: 7 },
    { type: 'cannon', x: 60, y: 85, size: 42, delay: 14 },
    { type: 'wheel', x: 40, y: 30, size: 35, delay: 15 },
    { type: 'wheel', x: 75, y: 65, size: 40, delay: 16 }
  ], []);

  // Debris field items
  const debrisItems = useMemo(() => [
    { type: 'plank', x: 10, y: 25, size: 20, delay: 0 },
    { type: 'rope', x: 30, y: 50, size: 15, delay: 1 },
    { type: 'barrel', x: 50, y: 40, size: 18, delay: 2 },
    { type: 'plank', x: 70, y: 65, size: 25, delay: 3 },
    { type: 'rope', x: 85, y: 30, size: 12, delay: 4 },
    { type: 'barrel', x: 15, y: 90, size: 20, delay: 5 },
    { type: 'plank', x: 60, y: 20, size: 22, delay: 6 },
    { type: 'rope', x: 40, y: 75, size: 16, delay: 7 },
    { type: 'barrel', x: 80, y: 85, size: 19, delay: 8 },
    { type: 'plank', x: 25, y: 95, size: 24, delay: 9 },
    { type: 'rope', x: 95, y: 55, size: 14, delay: 10 },
    { type: 'barrel', x: 5, y: 35, size: 17, delay: 11 },
    { type: 'plank', x: 45, y: 15, size: 26, delay: 12 },
    { type: 'rope', x: 65, y: 90, size: 13, delay: 13 },
    { type: 'barrel', x: 35, y: 85, size: 21, delay: 14 },
    { type: 'plank', x: 88, y: 75, size: 23, delay: 15 },
    { type: 'rope', x: 12, y: 45, size: 15, delay: 16 },
    { type: 'barrel', x: 55, y: 95, size: 18, delay: 17 }
  ], []);

  // Floating particles data
  const particles = useMemo(() => Array.from({ length: 50 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: ['small', 'medium', 'large'][Math.floor(Math.random() * 3)],
    delay: Math.random() * 15
  })), []);

  // Bubbles data
  const bubbles = useMemo(() => Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 8 + Math.random() * 15,
    delay: Math.random() * 8
  })), []);

  // Seaweed strands data
  const seaweedStrands = useMemo(() => [
    { x: 5, y: 100, height: 300, opacity: 0.4, delay: 0 },
    { x: 15, y: 100, height: 250, opacity: 0.3, delay: 2 },
    { x: 85, y: 100, height: 280, opacity: 0.35, delay: 1 },
    { x: 95, y: 100, height: 320, opacity: 0.45, delay: 3 },
    { x: 25, y: 100, height: 200, opacity: 0.25, delay: 4 },
    { x: 75, y: 100, height: 240, opacity: 0.3, delay: 5 }
  ], []);

  return (
    <OceanContainer ref={containerRef}>
      {/* Far background layers (slowest parallax) */}
      <motion.div style={{ y: backgroundY, x: backgroundX }}>
        <FarBackgroundLayer />
      </motion.div>
      
      <motion.div style={{ y: farBackY }}>
        <BackgroundReefs />
      </motion.div>

      {/* Middle depth atmospheric layers */}
      <motion.div style={{ y: depth1Y }}>
        <DepthLayer className="depth-1" />
      </motion.div>
      
      <motion.div style={{ y: depth2Y, x: midgroundX }}>
        <DepthLayer className="depth-2" />
      </motion.div>
      
      <motion.div style={{ y: depth3Y }}>
        <DepthLayer className="depth-3" />
      </motion.div>

      {/* Caustic lighting effects */}
      <CausticLights />

      {/* Large shipwrecks */}
      <motion.div style={{ y: wrecksY }}>
        <Shipwreck className="large-wreck">
          <LargeShipwreckSVG />
        </Shipwreck>
        
        <Shipwreck className="medium-wreck">
          <MediumWreckSVG />
        </Shipwreck>
        
        <Shipwreck className="broken-mast" style={{ bottom: '30%', left: '60%' }}>
          <svg width="80" height="120" viewBox="0 0 80 120" xmlns="http://www.w3.org/2000/svg">
            <rect x="35" y="0" width="10" height="100" fill="rgba(139, 69, 19, 0.8)" transform="rotate(12 40 50)" />
            <path d="M45,20 L70,25 L70,50 L45,45 Z" fill="rgba(255, 255, 255, 0.3)" opacity="0.6" />
          </svg>
        </Shipwreck>
        
        {/* Additional shipwrecks for a richer ocean floor */}
        <Shipwreck className="large-wreck" style={{ bottom: '5%', left: '5%', transform: 'rotate(-15deg)' }}>
          <svg width="250" height="120" viewBox="0 0 250 120" xmlns="http://www.w3.org/2000/svg">
            <path d="M40,100 L210,100 L230,85 L220,70 L190,75 L40,75 Z" fill="rgba(139, 69, 19, 0.8)" />
            <rect x="50" y="75" width="150" height="12" fill="rgba(139, 69, 19, 0.7)" />
            <rect x="100" y="30" width="6" height="45" fill="rgba(139, 69, 19, 0.8)" transform="rotate(-20 103 52)" />
            <ellipse cx="150" cy="90" rx="12" ry="6" fill="rgba(0, 0, 0, 0.4)" />
          </svg>
        </Shipwreck>
        
        <Shipwreck className="medium-wreck" style={{ bottom: '15%', right: '8%', transform: 'rotate(25deg)' }}>
          <svg width="180" height="90" viewBox="0 0 180 90" xmlns="http://www.w3.org/2000/svg">
            <path d="M25,65 L155,65 L165,55 L160,45 L135,48 L25,48 Z" fill="rgba(139, 69, 19, 0.7)" />
            <rect x="40" y="48" width="90" height="8" fill="rgba(139, 69, 19, 0.6)" />
            <rect x="80" y="20" width="4" height="28" fill="rgba(139, 69, 19, 0.7)" transform="rotate(15 82 34)" />
          </svg>
        </Shipwreck>
        
        <Shipwreck className="broken-mast" style={{ bottom: '50%', left: '85%' }}>
          <svg width="60" height="100" viewBox="0 0 60 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="25" y="0" width="8" height="80" fill="rgba(139, 69, 19, 0.7)" transform="rotate(-25 29 40)" />
            <path d="M32,15 L55,18 L55,40 L32,37 Z" fill="rgba(220, 20, 60, 0.5)" opacity="0.7" />
          </svg>
        </Shipwreck>
      </motion.div>

      {/* Naval artifacts */}
      <motion.div style={{ y: artifactsY }}>
        {navalArtifacts.map((artifact, index) => (
          <NavalArtifact
            key={index}
            className={artifact.type}
            style={{ 
              left: `${artifact.x}%`, 
              top: `${artifact.y}%`,
              animationDelay: `${artifact.delay}s`
            }}
          >
            {artifact.type === 'anchor' && <AnchorSVG size={artifact.size} />}
            {artifact.type === 'sword' && <NavalSwordSVG size={artifact.size} />}
            {artifact.type === 'flag' && <SinkingFlagSVG size={artifact.size} />}
            {artifact.type === 'chest' && <TreasureChestSVG size={artifact.size} />}
            {artifact.type === 'cannon' && <NavalCannonSVG size={artifact.size} />}
            {artifact.type === 'wheel' && <ShipWheelSVG size={artifact.size} />}
          </NavalArtifact>
        ))}
      </motion.div>

      {/* Debris field */}
      <motion.div style={{ y: debrisY }}>
        <DebrisField>
          {debrisItems.map((item, index) => (
            <DebrisItem
              key={index}
              style={{ 
                left: `${item.x}%`, 
                top: `${item.y}%`,
                animationDelay: `${item.delay}s`
              }}
            >
              <SmallDebrisSVG type={item.type} size={item.size} />
            </DebrisItem>
          ))}
        </DebrisField>
      </motion.div>

      {/* Floating particles layer */}
      <motion.div style={{ y: particlesY }}>
        <ParticleLayer>
          {particles.map((particle) => (
            <FloatingParticle
              key={particle.id}
              className={particle.size}
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                animationDelay: `${particle.delay}s`
              }}
            />
          ))}
        </ParticleLayer>
      </motion.div>

      {/* Bubbles layer */}
      <motion.div style={{ y: particlesY, x: foregroundX }}>
        <ParticleLayer>
          {bubbles.map((bubble) => (
            <Bubble
              key={bubble.id}
              style={{
                left: `${bubble.x}%`,
                top: `${bubble.y}%`,
                width: `${bubble.size}px`,
                height: `${bubble.size}px`,
                animationDelay: `${bubble.delay}s`
              }}
            />
          ))}
        </ParticleLayer>
      </motion.div>

      {/* Foreground seaweed (fastest parallax) */}
      <motion.div style={{ y: foregroundY, x: foregroundX }}>
        <ForegroundLayer>
          {seaweedStrands.map((strand, index) => (
            <SeaweedStrand
              key={index}
              style={{
                left: `${strand.x}%`,
                bottom: '0%',
                animationDelay: `${strand.delay}s`,
                animationDuration: `${6 + Math.random() * 4}s`
              }}
            >
              <KelpSVG height={strand.height} opacity={strand.opacity} />
            </SeaweedStrand>
          ))}
        </ForegroundLayer>
      </motion.div>
    </OceanContainer>
  );
};

OceanBackground.propTypes = {};

export default React.memo(OceanBackground);