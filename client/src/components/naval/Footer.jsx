import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { 
  FaFacebookF, 
  FaTwitter, 
  FaLinkedinIn, 
  FaYoutube, 
  FaAnchor,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaArrowUp
} from 'react-icons/fa';
import { useIntersectionAnimation, useReducedMotion } from '../../hooks/useIntersectionObserver';
import PropTypes from 'prop-types';

const FooterContainer = styled(motion.footer)`
  background: #1a365d;
  color: white;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.03"><circle cx="30" cy="30" r="1"/></g></g></svg>');
    z-index: 0;
  }
`;

const WaveSeparator = styled(motion.div)`
  height: 80px;
  background: url('data:image/svg+xml,<svg viewBox="0 0 1200 120" xmlns="http://www.w3.org/2000/svg"><path d="M0,60 C300,120 600,0 900,60 C1050,90 1200,30 1200,60 L1200,120 L0,120 Z" fill="%231a365d"/></svg>') repeat-x;
  background-size: 1200px 120px;
  margin-bottom: -1px;
  position: relative;
  z-index: 1;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 4rem 2rem 2rem;
  position: relative;
  z-index: 1;
`;

const FooterGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 3rem;
  margin-bottom: 3rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const FooterColumn = styled(motion.div)`
  display: flex;
  flex-direction: column;
`;

const ColumnTitle = styled(motion.h3)`
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: #fbbf24;
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const CompanyInfo = styled.div`
  line-height: 1.8;
  color: #e2e8f0;
  
  p {
    margin-bottom: 1rem;
  }
`;

const ContactInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ContactItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #e2e8f0;
  transition: color 0.3s ease;

  &:hover {
    color: #fbbf24;
  }

  svg {
    font-size: 1.2rem;
    color: #fbbf24;
  }
`;

const QuickLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const FooterLink = styled(motion.a)`
  color: #e2e8f0;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
  display: inline-block;
  padding: 0.25rem 0;

  &:hover {
    color: #fbbf24;
    transform: translateX(5px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0;
    height: 2px;
    background: #fbbf24;
    transition: width 0.3s ease;
  }

  &:hover::after {
    width: 100%;
  }
`;

const SocialContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
`;

const SocialIcon = styled(motion.a)`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    opacity: 0;
    transition: opacity 0.3s ease;
    border-radius: 50%;
  }

  &:hover::before {
    opacity: 1;
  }

  svg {
    position: relative;
    z-index: 1;
  }
`;

const FooterBottom = styled(motion.div)`
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 2rem 0;
  text-align: center;
  color: #94a3b8;
  position: relative;
`;

const Copyright = styled.p`
  margin: 0;
  font-size: 0.9rem;
`;

const BackToTop = styled(motion.button)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  border: none;
  color: white;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const footerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.4, 0.0, 0.2, 1],
      staggerChildren: 0.2
    }
  }
};

const waveVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut"
    }
  },
  animate: {
    backgroundPosition: ['0px 0px', '1200px 0px'],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

const columnVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

const socialIconVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.1,
    rotate: 360,
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const backToTopVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.1,
    y: -5,
    transition: {
      duration: 0.3
    }
  }
};

const Footer = ({ showBackToTop = true }) => {
  const { ref, isInView } = useIntersectionAnimation({ margin: '-100px' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  React.useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const socialLinks = [
    { icon: FaFacebookF, href: '#', label: 'Facebook' },
    { icon: FaTwitter, href: '#', label: 'Twitter' },
    { icon: FaLinkedinIn, href: '#', label: 'LinkedIn' },
    { icon: FaYoutube, href: '#', label: 'YouTube' }
  ];

  const quickLinks = [
    { name: 'About Us', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Fleet Management', href: '#fleet' },
    { name: 'Intelligence', href: '#intelligence' },
    { name: 'Security', href: '#security' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <>
      <WaveSeparator
        variants={prefersReducedMotion ? {} : waveVariants}
        initial="hidden"
        whileInView="visible"
        animate={prefersReducedMotion ? {} : "animate"}
        viewport={{ once: true }}
      />
      
      <FooterContainer
        ref={ref}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={prefersReducedMotion ? {} : footerVariants}
      >
        <FooterContent>
          <FooterGrid>
            <FooterColumn variants={prefersReducedMotion ? {} : columnVariants}>
              <ColumnTitle>
                <FaAnchor />
                Seaward Strategies
              </ColumnTitle>
              <CompanyInfo>
                <p>
                  We empower decision-makers with insight through data, analytics, 
                  and simulation for the maritime environment.
                </p>
                <p>
                  Committed to excellence in maritime intelligence and strategic 
                  decision-making worldwide.
                </p>
              </CompanyInfo>
            </FooterColumn>

            <FooterColumn variants={prefersReducedMotion ? {} : columnVariants}>
              <ColumnTitle>
                <FaMapMarkerAlt />
                Contact Info
              </ColumnTitle>
              <ContactInfo>
                <ContactItem
                  whileHover={prefersReducedMotion ? {} : { x: 5 }}
                >
                  <FaMapMarkerAlt />
                  <span>123 Naval Base, Maritime District, Ocean City</span>
                </ContactItem>
                <ContactItem
                  whileHover={prefersReducedMotion ? {} : { x: 5 }}
                >
                  <FaPhone />
                  <span>+1 (555) 123-4567</span>
                </ContactItem>
                <ContactItem
                  whileHover={prefersReducedMotion ? {} : { x: 5 }}
                >
                  <FaEnvelope />
                  <span>contact@navalsolutions.com</span>
                </ContactItem>
              </ContactInfo>
            </FooterColumn>


            <FooterColumn variants={prefersReducedMotion ? {} : columnVariants}>
              <ColumnTitle>Follow Us</ColumnTitle>
              <SocialContainer>
                <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>
                  Stay connected with our latest maritime innovations and naval updates.
                </p>
                <SocialIcons>
                  {socialLinks.map((social, index) => (
                    <SocialIcon
                      key={social.label}
                      href={social.href}
                      variants={prefersReducedMotion ? {} : socialIconVariants}
                      whileHover={prefersReducedMotion ? {} : "hover"}
                      style={prefersReducedMotion ? {} : {
                        transitionDelay: `${index * 0.1}s`
                      }}
                      aria-label={social.label}
                    >
                      <social.icon />
                    </SocialIcon>
                  ))}
                </SocialIcons>
              </SocialContainer>
            </FooterColumn>
          </FooterGrid>

          <FooterBottom>
            <Copyright>
              © 2025 Seaward Strategies. All rights reserved.
            </Copyright>
          </FooterBottom>
        </FooterContent>
      </FooterContainer>

      <AnimatePresence>
        {showBackToTop && showScrollTop && (
          <BackToTop
            variants={prefersReducedMotion ? {} : backToTopVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
            onClick={scrollToTop}
            aria-label="Back to top"
          >
            <FaArrowUp />
          </BackToTop>
        )}
      </AnimatePresence>
    </>
  );
};

Footer.propTypes = {
  showBackToTop: PropTypes.bool
};

export default Footer;