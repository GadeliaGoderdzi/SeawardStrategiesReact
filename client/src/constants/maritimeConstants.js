// Maritime Demo Constants
export const MARITIME_COLORS = {
  deepNavy: '#0a2463',
  dataTeal: '#1e40af',
  safetyOrange: '#f59e0b',
  foamWhite: '#ffffff',
  darkBlue: '#0c1c3d',
  lightBlue: '#e8f4f8'
};

export const VESSEL_COLORS = {
  cargo: '#10b981',
  passenger: '#ef4444',
  military: '#f59e0b'
};

export const VESSEL_COLORS_RGBA = {
  cargo: 'rgba(16, 185, 129, 0.6)',
  passenger: 'rgba(239, 68, 68, 0.6)',
  military: 'rgba(245, 158, 11, 0.6)'
};

export const BREAKPOINTS = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px'
};

export const Z_INDEX_LAYERS = {
  background: -1,
  worldMap: 2,
  radarPulse: 1,
  speedTrail: 1,
  collisionSpark: 5,
  vessel: 15,
  radarHub: 10,
  radarDot: 11,
  radarPing: 12,
  logoContainer: 12,
  heroContent: 15,
  debug: 1000
};

export const ANIMATION_CONFIG = {
  pulseInterval: {
    min: 800,
    max: 1200
  },
  pulseExpansion: 2.2, // Increased from 1.5 for stronger pulses
  pulseFade: 0.008, // Reduced from 0.015 for slower fade (stronger effect)
  maxPulses: 3, // Increased from 2 for more visible pulses
  radarDotDuration: 3000,
  radarDotInterval: {
    min: 1000,
    max: 3000
  }
};

export const VESSEL_CONFIG = {
  triangleSize: {
    borderLeft: '15px',
    borderRight: '15px',
    borderBottom: '30px'
  },
  formationOffset: {
    vessel1: { x: 0, y: 0 },
    vessel2: { x: -5, y: -3 },
    vessel3: { x: 5, y: -3 },
    vessel4: { x: -3, y: 5 },
    vessel5: { x: 3, y: 5 }
  }
};

export const RADAR_CONFIG = {
  hubSize: {
    desktop: 600,
    tablet: 450,
    mobile: 350,
    smallMobile: 300
  },
  pingSize: {
    initial: 200,
    max: 600
  },
  dotDistance: {
    min: 280,
    max: 300
  }
}; 