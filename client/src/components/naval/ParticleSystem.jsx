import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';

const ParticleCanvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
`;

const ParticleSystem = ({ particleCount = 100, color = 'rgba(255,255,255,0.6)' }) => {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const particlesRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Particle class
    class Particle {
      constructor() {
        this.reset();
        this.y = Math.random() * height;
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + 10;
        this.speed = Math.random() * 0.5 + 0.1;
        this.size = Math.random() * 3 + 1;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.drift = Math.random() * 0.4 - 0.2;
      }

      update() {
        this.y -= this.speed;
        this.x += this.drift;
        
        if (this.y < -10 || this.x < -10 || this.x > width + 10) {
          this.reset();
        }
      }

      draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    particlesRef.current = [];
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, width, height);
      
      particlesRef.current.forEach(particle => {
        particle.update();
        particle.draw(ctx);
      });
      
      animationRef.current = requestAnimationFrame(animate);
    };

    // Handle resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, color]);

  return <ParticleCanvas ref={canvasRef} />;
};

export default ParticleSystem;