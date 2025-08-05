import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaShieldAlt, FaEye, FaCog, FaAward } from 'react-icons/fa';
import ProductCard from './ProductCard';
import { useStaggeredInView, useReducedMotion } from '../../hooks/useIntersectionObserver';

const ProductsContainer = styled(motion.section)`
  padding: 6rem 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%231a365d" fill-opacity="0.02"><circle cx="50" cy="50" r="1"/></g></g></svg>');
    z-index: 0;
  }
`;

const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  z-index: 1;
`;

const SectionHeader = styled(motion.div)`
  text-align: center;
  margin-bottom: 4rem;
`;

const SectionTitle = styled(motion.h2)`
  font-size: clamp(2.5rem, 6vw, 4rem);
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 1rem;
  background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const SectionSubtitle = styled(motion.p)`
  font-size: 1.25rem;
  color: #64748b;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
`;

const ProductsGrid = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
`;

const StatsContainer = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 4rem;
  padding: 2rem 0;
`;

const StatCard = styled(motion.div)`
  text-align: center;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.p`
  color: #64748b;
  font-weight: 500;
`;

const sectionVariants = {
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

const titleVariants = {
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

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const statVariants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "backOut"
    }
  }
};

const ProductsSection = () => {
  const { ref, isInView, visibleItems } = useStaggeredInView(3, 0.2);
  const prefersReducedMotion = useReducedMotion();

  const products = [
    {
      title: "Fleet Management",
      description: "Advanced fleet coordination systems enabling real-time monitoring and strategic deployment of naval assets across global waters.",
      icon: FaShieldAlt,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      badge: <FaAward />,
      overlayTitle: "Fleet Command Center",
      overlayDescription: "Centralized command and control for modern naval operations"
    },
    {
      title: "Naval Intelligence",
      description: "Cutting-edge intelligence gathering and analysis platforms providing critical maritime situational awareness and threat assessment.",
      icon: FaEye,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      badge: <FaEye />,
      overlayTitle: "Intelligence Hub",
      overlayDescription: "Advanced analytics for maritime security operations"
    },
    {
      title: "Maritime Security",
      description: "Comprehensive security solutions protecting naval installations, vessels, and maritime infrastructure against modern threats.",
      icon: FaCog,
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      badge: <FaShieldAlt />,
      overlayTitle: "Security Operations",
      overlayDescription: "Multi-layered defense systems for maritime assets"
    }
  ];

  const stats = [
    { number: "500+", label: "Active Vessels" },
    { number: "50+", label: "Naval Bases" },
    { number: "24/7", label: "Monitoring" },
    { number: "99.9%", label: "Uptime" }
  ];

  const handleLearnMore = (productTitle) => {
    console.log(`Learn more about ${productTitle}`);
    // Add your navigation logic here
  };

  return (
    <ProductsContainer
      id="services"
      className="products-section"
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={prefersReducedMotion ? {} : sectionVariants}
    >
      <ContentWrapper>
        <SectionHeader>
          <SectionTitle
            variants={prefersReducedMotion ? {} : titleVariants}
          >
            Our Naval Solutions
          </SectionTitle>
          <SectionSubtitle
            variants={prefersReducedMotion ? {} : titleVariants}
          >
            Comprehensive maritime defense systems designed for modern naval operations 
            and international cooperation
          </SectionSubtitle>
        </SectionHeader>

        <ProductsGrid
          variants={prefersReducedMotion ? {} : gridVariants}
        >
          {products.map((product, index) => (
            <ProductCard
              key={product.title}
              title={product.title}
              description={product.description}
              icon={product.icon}
              gradient={product.gradient}
              badge={product.badge}
              overlayTitle={product.overlayTitle}
              overlayDescription={product.overlayDescription}
              delay={prefersReducedMotion ? 0 : index * 0.2}
              onLearnMore={() => handleLearnMore(product.title)}
            />
          ))}
        </ProductsGrid>

        <StatsContainer
          variants={prefersReducedMotion ? {} : gridVariants}
        >
          {stats.map((stat, index) => (
            <StatCard
              key={stat.label}
              variants={prefersReducedMotion ? {} : statVariants}
              whileInView={prefersReducedMotion ? {} : "visible"}
              viewport={{ once: true, margin: "-50px" }}
              style={prefersReducedMotion ? {} : { 
                transitionDelay: `${index * 0.1}s` 
              }}
            >
              <StatNumber>{stat.number}</StatNumber>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsContainer>
      </ContentWrapper>
    </ProductsContainer>
  );
};

export default ProductsSection;