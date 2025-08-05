import React from 'react';
import { VESSEL_COLORS, Z_INDEX_LAYERS } from '../../constants/maritimeConstants';

// Vessel Triangle Component
export const VesselTriangle = ({ vessel }) => {
  if (!vessel.position || vessel.position.x === undefined || vessel.position.y === undefined) {
    return null;
  }

  // Add 180 degrees rotation for red triangles (passenger type)
  const additionalRotation = vessel.type === 'passenger' ? 0 : 0;
  const finalAngle = (vessel.position.angle || 0) + additionalRotation;

  return (
    <div
      className={`vessel-triangle ${vessel.type}`}
      style={{
        position: 'absolute',
        left: `${vessel.position.x}%`,
        top: `${vessel.position.y}%`,
        transform: `translate(-50%, -50%) rotate(${finalAngle}deg)`,
        width: '0',
        height: '0',
        borderLeft: '15px solid transparent',
        borderRight: '15px solid transparent',
        borderBottom: `30px solid ${VESSEL_COLORS[vessel.type]}`,
        filter: `drop-shadow(0 0 4px ${VESSEL_COLORS[vessel.type]}80)`,
        zIndex: Z_INDEX_LAYERS.vessel,
        pointerEvents: 'none'
      }}
    />
  );
};

// Speed Trail Component
export const SpeedTrail = ({ trail }) => {
  const getTrailColor = (type) => {
    const colors = {
      cargo: 'rgba(16, 185, 129, 0.3)',
      passenger: 'rgba(239, 68, 68, 0.3)',
      military: 'rgba(245, 158, 11, 0.3)'
    };
    return colors[type] || colors.cargo;
  };

  return (
    <div
      className={`speed-trail ${trail.type}-trail`}
      style={{
        position: 'absolute',
        left: `${trail.x}%`,
        top: `${trail.y}%`,
        width: '4px',
        height: '4px',
        borderRadius: '50%',
        background: getTrailColor(trail.type),
        zIndex: Z_INDEX_LAYERS.speedTrail,
        pointerEvents: 'none'
      }}
    />
  );
};

// Collision Spark Component
export const CollisionSpark = ({ spark }) => {
  return (
    <div
      className="collision-spark"
      style={{
        position: 'absolute',
        left: `${spark.x}%`,
        top: `${spark.y}%`,
        width: '8px',
        height: '8px',
        background: 'radial-gradient(circle, #ffffff 0%, #fbbf24 50%, transparent 100%)',
        borderRadius: '50%',
        zIndex: Z_INDEX_LAYERS.collisionSpark,
        pointerEvents: 'none',
        animation: 'sparkFlash 0.8s ease-out forwards'
      }}
    />
  );
};

// Vessel Container Component
export const VesselContainer = ({ vessel }) => {
  return (
    <div key={vessel.id}>
      <VesselTriangle vessel={vessel} />
      
      {vessel.trails?.map(trail => (
        <SpeedTrail key={trail.id} trail={trail} />
      ))}
      
      {vessel.sparks?.map(spark => (
        <CollisionSpark key={spark.id} spark={spark} />
      ))}
    </div>
  );
}; 