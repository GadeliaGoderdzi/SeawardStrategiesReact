import { useState, useEffect, useRef } from 'react';
import { ANIMATION_CONFIG } from '../constants/maritimeConstants';

// Initial vessel data for green formation
const radarVessels = [
  {
    id: 'vessel1',
    type: 'cargo',
    role: 'leader',
    formationOffset: { x: 0, y: 0 }
  },
  {
    id: 'vessel2', 
    type: 'cargo',
    role: 'left-wing',
    formationOffset: { x: -8, y: -5 }
  },
  {
    id: 'vessel3',
    type: 'cargo', 
    role: 'right-wing',
    formationOffset: { x: -8, y: 5 }
  }
];

// Initial vessel data for red formation (opposing)
const redRadarVessels = [
  {
    id: 'red-vessel1',
    type: 'passenger',
    role: 'leader',
    formationOffset: { x: 0, y: 0 }
  },
  {
    id: 'red-vessel2', 
    type: 'passenger',
    role: 'left-wing',
    formationOffset: { x: -8, y: -5 }
  },
  {
    id: 'red-vessel3',
    type: 'passenger', 
    role: 'right-wing',
    formationOffset: { x: -8, y: 5 }
  }
];

// Calculate wedge formation position for vessels
const calculateWedgeFormationPosition = (vessel, time, scenarioStartTime, vessels, isRedFormation = false) => {
  const elapsed = (time - scenarioStartTime) / 1000;
  
  // Leader movement (vessel1 leads the formation)
  let baseX, baseY, baseAngle;
  
  if (vessel.role === 'leader') {
    // Different routes for green vs red formations
    if (isRedFormation) {
      // Red formation moves in outer orbit around the center
      const leaderRadius = 40; // Outer orbit
      const leaderSpeed = 0.12;
      const leaderAngle = (elapsed * leaderSpeed) % (Math.PI * 2);
      
      // Circle around the center (Seaward Strategies text)
      const centerX = 50; // Center of radar
      const centerY = 50; // Center of radar
      
      // Add some random wandering (different pattern)
      const wanderX = Math.sin(elapsed * 0.03) * 8;
      const wanderY = Math.cos(elapsed * 0.06) * 8;
      
      baseX = centerX + Math.cos(leaderAngle) * leaderRadius + wanderX;
      baseY = centerY + Math.sin(leaderAngle) * leaderRadius + wanderY;
      baseAngle = (leaderAngle * 180 / Math.PI) + 180;
    } else {
      // Green formation moves in inner orbit around the center
      const leaderRadius = 25; // Inner orbit
      const leaderSpeed = 0.15;
      const leaderAngle = (elapsed * leaderSpeed) % (Math.PI * 2);
      
      // Circle around the center (Seaward Strategies text)
      const centerX = 50; // Center of radar
      const centerY = 50; // Center of radar
      
      // Add some random wandering
      const wanderX = Math.sin(elapsed * 0.05) * 8;
      const wanderY = Math.cos(elapsed * 0.08) * 8;
      
      baseX = centerX + Math.cos(leaderAngle) * leaderRadius + wanderX;
      baseY = centerY + Math.sin(leaderAngle) * leaderRadius + wanderY;
      baseAngle = (leaderAngle * 180 / Math.PI) + 180;
    }
  } else {
    // Wing vessels maintain wedge formation relative to leader
    const leader = vessels.find(v => v.role === 'leader');
    if (leader && leader.position) {
      // Get leader's current position and angle
      const leaderX = leader.position.x;
      const leaderY = leader.position.y;
      const leaderAngleRad = (leader.position.angle - 180) * Math.PI / 180; // Convert to radians
      
      // Fixed formation offsets (constant distances)
      const formationDistance = 8; // Distance behind leader (reduced from 12)
      const wingSpread = 5; // Distance to sides (reduced from 8)
      
      let offsetX, offsetY;
      
      if (vessel.role === 'left-wing') {
        // Left wing: behind and to the left
        offsetX = -formationDistance;
        offsetY = -wingSpread;
      } else if (vessel.role === 'right-wing') {
        // Right wing: behind and to the right
        offsetX = -formationDistance;
        offsetY = wingSpread;
      } else {
        // Fallback
        offsetX = 0;
        offsetY = 0;
      }
      
      // Rotate the offset based on leader's direction
      const rotatedX = offsetX * Math.cos(leaderAngleRad) - offsetY * Math.sin(leaderAngleRad);
      const rotatedY = offsetX * Math.sin(leaderAngleRad) + offsetY * Math.cos(leaderAngleRad);
      
      // Apply offset to leader position
      baseX = leaderX + rotatedX;
      baseY = leaderY + rotatedY;
      baseAngle = leader.position.angle; // Same direction as leader
    } else {
      // Fallback if leader not found - use separate orbits
      let fallbackAngle;
      if (isRedFormation) {
        // Red fallback on outer orbit
        const fallbackRadius = 35;
        const fallbackSpeed = 0.08;
        fallbackAngle = (elapsed * fallbackSpeed) % (Math.PI * 2);
        
        baseX = 50 + Math.cos(fallbackAngle) * fallbackRadius;
        baseY = 50 + Math.sin(fallbackAngle) * fallbackRadius;
      } else {
        // Green fallback on inner orbit
        const fallbackRadius = 20;
        const fallbackSpeed = 0.1;
        fallbackAngle = (elapsed * fallbackSpeed) % (Math.PI * 2);
        
        baseX = 50 + Math.cos(fallbackAngle) * fallbackRadius;
        baseY = 50 + Math.sin(fallbackAngle) * fallbackRadius;
      }
      baseAngle = (fallbackAngle * 180 / Math.PI) + 180;
    }
  }
  
  // Ensure position is within radar bounds for each formation
  if (isRedFormation) {
    // Red formation stays in outer orbit (30-70% range from center)
    const distanceFromCenter = Math.sqrt((baseX - 50) ** 2 + (baseY - 50) ** 2);
    const maxDistance = 35;
    const minDistance = 30;
    
    if (distanceFromCenter > maxDistance) {
      const scale = maxDistance / distanceFromCenter;
      baseX = 50 + (baseX - 50) * scale;
      baseY = 50 + (baseY - 50) * scale;
    } else if (distanceFromCenter < minDistance) {
      const scale = minDistance / distanceFromCenter;
      baseX = 50 + (baseX - 50) * scale;
      baseY = 50 + (baseY - 50) * scale;
    }
    
    return { x: baseX, y: baseY, angle: baseAngle };
  } else {
    // Green formation stays in inner orbit (15-30% range from center)
    const distanceFromCenter = Math.sqrt((baseX - 50) ** 2 + (baseY - 50) ** 2);
    const maxDistance = 30;
    const minDistance = 15;
    
    if (distanceFromCenter > maxDistance) {
      const scale = maxDistance / distanceFromCenter;
      baseX = 50 + (baseX - 50) * scale;
      baseY = 50 + (baseY - 50) * scale;
    } else if (distanceFromCenter < minDistance) {
      const scale = minDistance / distanceFromCenter;
      baseX = 50 + (baseX - 50) * scale;
      baseY = 50 + (baseY - 50) * scale;
    }
    
    return { x: baseX, y: baseY, angle: baseAngle };
  }
};

export const useVesselAnimation = () => {
  const [vessels, setVessels] = useState(radarVessels);
  const [redVessels, setRedVessels] = useState(redRadarVessels);
  const [radarDots, setRadarDots] = useState([]);
  const animationRef = useRef();
  const scenarioStartTimeRef = useRef(Date.now());

  useEffect(() => {
    const animate = (time) => {
      // Update green formation
      const updatedVessels = vessels.map(vessel => ({
        ...vessel,
        position: calculateWedgeFormationPosition(vessel, time, scenarioStartTimeRef.current, vessels, false)
      }));

      // Update red formation
      const updatedRedVessels = redVessels.map(vessel => ({
        ...vessel,
        position: calculateWedgeFormationPosition(vessel, time, scenarioStartTimeRef.current, redVessels, true)
      }));

      setVessels(updatedVessels);
      setRedVessels(updatedRedVessels);

      // Generate random radar dots
      if (Math.random() < 0.01) { // 1% chance per frame
        const newDot = {
          id: `dot-${Date.now()}-${Math.random()}`,
          x: 25 + Math.random() * 50,
          y: 25 + Math.random() * 50,
          size: 2 + Math.random() * 3,
          opacity: 0.8 + Math.random() * 0.2,
          created: time
        };
        setRadarDots(prev => [...prev, newDot]);
      }

      // Remove old radar dots
      setRadarDots(prev => prev.filter(dot => 
        time - dot.created < ANIMATION_CONFIG.radarDotDuration
      ));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [vessels, redVessels]);

  return { vessels, redVessels, radarDots };
}; 