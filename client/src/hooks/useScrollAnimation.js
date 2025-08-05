import { useScroll, useTransform } from 'framer-motion';
import { useState, useEffect } from 'react';

export const useScrollAnimation = () => {
  const { scrollY } = useScroll();
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  const scale = useTransform(scrollY, [0, 300], [1, 0.8]);
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  return { opacity, scale, y, scrollY };
};

export const useScrollDirection = () => {
  const [scrollDirection, setScrollDirection] = useState('up');
  const [prevScrollY, setPrevScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > prevScrollY) {
        setScrollDirection('down');
      } else {
        setScrollDirection('up');
      }
      
      setPrevScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [prevScrollY]);

  return scrollDirection;
};

export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
};

export const useHeaderAnimation = () => {
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const scrollDirection = useScrollDirection();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      
      setIsScrolled(scrollTop > 50);
      
      if (scrollTop > 100) {
        setIsHeaderVisible(scrollDirection === 'up');
      } else {
        setIsHeaderVisible(true);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrollDirection]);

  return { isHeaderVisible, isScrolled };
};