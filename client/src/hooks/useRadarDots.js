import { useState, useEffect } from 'react';
import { ANIMATION_CONFIG, RADAR_CONFIG } from '../constants/maritimeConstants';

export const useRadarDots = () => {
  const [radarDots, setRadarDots] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newDot = {
        id: Date.now(),
        angle: Math.random() * 360,
        distance: RADAR_CONFIG.dotDistance.min + Math.random() * (RADAR_CONFIG.dotDistance.max - RADAR_CONFIG.dotDistance.min),
        opacity: 0.8
      };
      
      setRadarDots(prev => [...prev.slice(-5), newDot]); // Keep last 5 dots
      
      // Remove dot after duration
      setTimeout(() => {
        setRadarDots(prev => prev.filter(dot => dot.id !== newDot.id));
      }, ANIMATION_CONFIG.radarDotDuration);
    }, ANIMATION_CONFIG.radarDotInterval.min + Math.random() * (ANIMATION_CONFIG.radarDotInterval.max - ANIMATION_CONFIG.radarDotInterval.min));
    
    return () => clearInterval(interval);
  }, []);

  return radarDots;
}; 