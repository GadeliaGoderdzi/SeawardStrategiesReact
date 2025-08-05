import React, { useRef, useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import AboutSection from '../components/naval/AboutSection';
import Footer from '../components/naval/Footer';

// Custom hooks
import { useVesselAnimation } from '../hooks/useVesselAnimation';
import { useRadarDots } from '../hooks/useRadarDots';

// Styled components
import {
  LandingContainer,
  HeroSection,
  WorldMap,
  ShippingRoute,
  RadarHub,
  RadarRings,
  RadarPing,
  RadarDot,
  LogoContainer,
  LogoText,
  HeroContent,
  HeroSubtitle,
  CTAButton,
  GlobalStyles
} from '../components/maritime/MaritimeStyles';

// Vessel components
import { VesselContainer } from '../components/maritime/VesselComponents';

const MaritimeLanding = () => {
  const containerRef = useRef(null);
  const { scrollY } = useScroll();
  const [isScrolled, setIsScrolled] = useState(false);

  // Custom hooks for animation
  const { vessels, redVessels, radarDots } = useVesselAnimation();
  const additionalRadarDots = useRadarDots();

  // Parallax transforms for other sections
  const backgroundY = useTransform(scrollY, [0, 2000], [0, -100]);
  const farBackY = useTransform(scrollY, [0, 2000], [0, -200]);
  const depth1Y = useTransform(scrollY, [0, 2000], [0, -300]);
  const depth2Y = useTransform(scrollY, [0, 2000], [0, -500]);
  const depth3Y = useTransform(scrollY, [0, 2000], [0, -700]);
  const backgroundX = useTransform(scrollY, [0, 2000], [0, -50]);
  const midgroundX = useTransform(scrollY, [0, 2000], [0, 25]);

  // Scroll handler
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <LandingContainer ref={containerRef}>
      <GlobalStyles />

      {/* Hero Section with Maritime Radar */}
      <HeroSection>
        {/* World Map Background */}
        <WorldMap />
        
        {/* Shipping Routes with Animated Vessels */}
        <ShippingRoute>
          {/* Green Formation */}
          {vessels.map(vessel => (
            <VesselContainer key={vessel.id} vessel={vessel} />
          ))}
          
          {/* Red Formation */}
          {redVessels.map(vessel => (
            <VesselContainer key={vessel.id} vessel={vessel} />
          ))}
        </ShippingRoute>
        
        {/* Central Radar Hub */}
        <RadarHub>
          {/* Radar Guide Rings */}
          <RadarRings />
          
          {/* Radar Ping Pulse */}
          <RadarPing />
          
          {/* Central Logo */}
          <LogoContainer>
            <LogoText>
              <div className="company-name">Seaward Strategies</div>
              <div className="motto">Oceanum Vigilate</div>
            </LogoText>
          </LogoContainer>
          
          {/* Random Radar Dots */}
          {radarDots.map(dot => {
            const x = Math.cos(dot.angle * Math.PI / 180) * dot.distance;
            const y = Math.sin(dot.angle * Math.PI / 180) * dot.distance;
            
            return (
              <RadarDot
                key={dot.id}
                style={{
                  left: `calc(50% + ${x}px)`,
                  top: `calc(50% + ${y}px)`,
                  opacity: dot.opacity
                }}
                animate={{ opacity: [0.8, 0] }}
                transition={{ duration: 3, ease: "easeOut" }}
              />
            );
          })}
        </RadarHub>
        
        {/* Hero Content at Bottom */}
        <HeroContent>
          <CTAButton
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              const servicesSection = document.querySelector('.services-section');
              if (servicesSection) {
                servicesSection.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            Explore Our Products
          </CTAButton>
        </HeroContent>
      </HeroSection>

      {/* About Us Section */}
      <AboutSection />

      {/* Products Section */}
      {/* Removed ProductsSection import and component */}

      {/* Footer */}
      <Footer />

    </LandingContainer>
  );
};

export default MaritimeLanding; 