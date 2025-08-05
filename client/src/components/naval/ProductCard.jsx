import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';
import { FaArrowRight } from 'react-icons/fa';
import { useReducedMotion } from '../../hooks/useIntersectionObserver';
import PropTypes from 'prop-types';

const CardContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  height: 400px;
  position: relative;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

const ImageContainer = styled(motion.div)`
  width: 100%;
  height: 200px;
  background: ${props => props.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'};
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('data:image/svg+xml,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><g fill="none" fill-rule="evenodd"><g fill="%23ffffff" fill-opacity="0.1"><circle cx="30" cy="30" r="2"/></g></g></svg>');
    opacity: 0.3;
  }
`;

const IconWrapper = styled(motion.div)`
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.9);
  z-index: 2;
  position: relative;
`;

const ImageOverlay = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
`;

const OverlayContent = styled.div`
  text-align: center;
  color: white;
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
  
  p {
    font-size: 0.9rem;
    opacity: 0.9;
    line-height: 1.4;
  }
`;

const CardContent = styled(motion.div)`
  padding: 1.5rem;
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Title = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.75rem;
  line-height: 1.2;
`;

const Description = styled.p`
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  flex-grow: 1;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const LearnMoreButton = styled(motion.button)`
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
    transition: left 0.5s;
  }

  &:hover::before {
    left: 100%;
  }
`;

const ProgressBar = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(90deg, #fbbf24, #f59e0b);
  border-radius: 0 0 2px 2px;
  transform-origin: left;
`;

const FloatingBadge = styled(motion.div)`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255, 255, 255, 0.9);
  color: #1a365d;
  padding: 0.5rem;
  border-radius: 50%;
  font-size: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  z-index: 3;
`;

const cardVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1]
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const imageVariants = {
  hover: {
    scale: 1.1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

const overlayVariants = {
  hover: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

const iconVariants = {
  hover: {
    scale: 1.2,
    rotate: 15,
    transition: {
      duration: 0.3
    }
  }
};

const buttonVariants = {
  hover: {
    scale: 1.05,
    x: 5,
    transition: {
      duration: 0.2
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const progressVariants = {
  hidden: { scaleX: 0 },
  visible: {
    scaleX: 1,
    transition: {
      duration: 2,
      ease: "easeOut",
      delay: 0.5
    }
  }
};

const badgeVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.5,
      ease: "backOut",
      delay: 0.3
    }
  },
  hover: {
    scale: 1.1,
    rotate: 360,
    transition: {
      duration: 0.6
    }
  }
};

const ProductCard = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient, 
  badge,
  onLearnMore,
  overlayTitle,
  overlayDescription,
  delay = 0
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <CardContainer
      variants={prefersReducedMotion ? {} : cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover={prefersReducedMotion ? {} : "hover"}
      viewport={{ once: true, margin: "-50px" }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={prefersReducedMotion ? {} : { transition: `all 0.3s ease ${delay}s` }}
    >
      <ProgressBar
        variants={prefersReducedMotion ? {} : progressVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      />

      <AnimatePresence>
        {badge && (
          <FloatingBadge
            variants={prefersReducedMotion ? {} : badgeVariants}
            initial="hidden"
            animate="visible"
            whileHover={prefersReducedMotion ? {} : "hover"}
          >
            {badge}
          </FloatingBadge>
        )}
      </AnimatePresence>

      <ImageContainer gradient={gradient}>
        <IconWrapper
          variants={prefersReducedMotion ? {} : iconVariants}
          animate={isHovered && !prefersReducedMotion ? "hover" : ""}
        >
          <Icon />
        </IconWrapper>

        <ImageOverlay
          variants={prefersReducedMotion ? {} : overlayVariants}
          animate={isHovered && !prefersReducedMotion ? "hover" : ""}
        >
          <OverlayContent>
            <h4>{overlayTitle || title}</h4>
            <p>{overlayDescription || "Advanced naval technology solutions"}</p>
          </OverlayContent>
        </ImageOverlay>
      </ImageContainer>

      <CardContent>
        <div>
          <Title>{title}</Title>
          <Description>{description}</Description>
        </div>

        <ButtonContainer>
          <LearnMoreButton
            variants={prefersReducedMotion ? {} : buttonVariants}
            whileHover={prefersReducedMotion ? {} : "hover"}
            whileTap={prefersReducedMotion ? {} : "tap"}
            onClick={onLearnMore}
          >
            Learn More
            <motion.div
              animate={isHovered && !prefersReducedMotion ? { x: 5 } : { x: 0 }}
              transition={{ duration: 0.2 }}
            >
              <FaArrowRight />
            </motion.div>
          </LearnMoreButton>
        </ButtonContainer>
      </CardContent>
    </CardContainer>
  );
};

ProductCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  icon: PropTypes.elementType.isRequired,
  gradient: PropTypes.string,
  badge: PropTypes.element,
  onLearnMore: PropTypes.func,
  overlayTitle: PropTypes.string,
  overlayDescription: PropTypes.string,
  delay: PropTypes.number
};

ProductCard.defaultProps = {
  gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  badge: null,
  onLearnMore: () => {},
  overlayTitle: null,
  overlayDescription: null,
  delay: 0
};

export default ProductCard;