import { useState, useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

export const useIntersectionAnimation = (options = {}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once: true, 
    margin: '-100px',
    ...options 
  });
  
  return { ref, isInView };
};

export const useStaggeredInView = (itemCount, delay = 0.1) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [visibleItems, setVisibleItems] = useState([]);

  useEffect(() => {
    if (isInView) {
      const timers = [];
      
      for (let i = 0; i < itemCount; i++) {
        const timer = setTimeout(() => {
          setVisibleItems(prev => [...prev, i]);
        }, i * delay * 1000);
        
        timers.push(timer);
      }

      return () => {
        timers.forEach(timer => clearTimeout(timer));
      };
    }
  }, [isInView, itemCount, delay]);

  return { ref, isInView, visibleItems };
};

export const useParallax = (speed = 0.5) => {
  const [offsetY, setOffsetY] = useState(0);
  
  useEffect(() => {
    const handleScroll = () => {
      setOffsetY(window.pageYOffset * speed);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return offsetY;
};

export const useMousePosition = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return mousePosition;
};

export const useMagneticEffect = (strength = 0.3) => {
  const ref = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;
      
      setPosition({ x: deltaX, y: deltaY });
    };

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 });
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength]);

  return { ref, position };
};

export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return prefersReducedMotion;
};