import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Color palette to match naval theme
const colors = {
  deepNavy: '#0a2463',
  dataTeal: '#1e40af',
  safetyOrange: '#f59e0b',
  foamWhite: '#ffffff',
  darkBlue: '#0c1c3d',
  lightBlue: '#e8f4f8'
};

// Main container for the About section
const AboutContainer = styled.section`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.deepNavy} 0%, ${colors.darkBlue} 100%);
  padding: 8rem 0;
  position: relative;
  overflow: hidden;
  z-index: 10;
`;

// Background pattern for maritime feel
const BackgroundPattern = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.1;
  background-image: 
    radial-gradient(circle at 20% 30%, ${colors.dataTeal} 2px, transparent 2px),
    radial-gradient(circle at 80% 70%, ${colors.safetyOrange} 1px, transparent 1px),
    radial-gradient(circle at 50% 50%, ${colors.dataTeal} 1px, transparent 1px);
  background-size: 100px 100px, 150px 150px, 80px 80px;
  background-position: 0 0, 50px 50px, 25px 25px;
  animation: float 20s ease-in-out infinite;
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-20px); }
  }
`;

// Content wrapper
const ContentWrapper = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
  z-index: 2;
`;

// Hero section for About
const HeroSection = styled.div`
  text-align: center;
  padding: 2rem 0 4rem;
`;

const HeroTitle = styled(motion.h2)`
  font-family: 'Rubik', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: ${colors.foamWhite};
  margin-bottom: 1.5rem;
  line-height: 1.2;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, ${colors.dataTeal}, ${colors.safetyOrange});
    border-radius: 2px;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'Lato', sans-serif;
  font-size: 1.5rem;
  color: ${colors.foamWhite};
  font-style: italic;
  margin-bottom: 2rem;
  letter-spacing: 1px;
`;

const HeroDescription = styled(motion.p)`
  font-family: 'Lato', sans-serif;
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.7;
`;

// Section for team
const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h3`
  font-family: 'Rubik', sans-serif;
  font-size: 2.5rem;
  color: ${colors.foamWhite};
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, ${colors.dataTeal}, ${colors.safetyOrange});
    border-radius: 2px;
  }
`;

// Team grid
const TeamGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
`;

// Team member card
const TeamCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.dataTeal}, ${colors.safetyOrange});
  }
`;

const TeamPhoto = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.dataTeal}, ${colors.safetyOrange});
  margin: 0 auto 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: ${colors.foamWhite};
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    inset: 3px;
    border-radius: 50%;
    background: ${colors.deepNavy};
    z-index: -1;
  }
`;

const TeamName = styled.h4`
  font-family: 'Rubik', sans-serif;
  font-size: 1.5rem;
  color: ${colors.foamWhite};
  margin-bottom: 0.5rem;
`;

const TeamTitle = styled.h5`
  font-family: 'Lato', sans-serif;
  font-size: 1.1rem;
  color: ${colors.dataTeal};
  margin-bottom: 1.5rem;
  font-weight: 600;
`;

const TeamBio = styled.p`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  text-align: left;
  font-size: 0.95rem;
`;

// Company values section
const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2.5rem;
  margin-top: 4rem;
`;

const ValueCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
    transform: translateY(-5px);
  }
`;

const ValueIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ValueTitle = styled.h4`
  font-family: 'Rubik', sans-serif;
  font-size: 1.3rem;
  color: ${colors.foamWhite};
  margin-bottom: 1rem;
`;

const ValueDescription = styled.p`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
`;

// President section styles
const PresidentSection = styled(motion.div)`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  margin: 0 auto;
  max-width: 1000px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
    text-align: center;
  }
`;

const PresidentImageContainer = styled.div`
  position: relative;
  width: 250px;
  height: 250px;
  margin: 0 auto;
`;

const PresidentImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const PresidentImagePlaceholder = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: linear-gradient(135deg, ${colors.dataTeal}, ${colors.safetyOrange});
  align-items: center;
  justify-content: center;
  font-size: 4rem;
  font-weight: 700;
  color: ${colors.foamWhite};
  border: 4px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
`;

const PresidentContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const PresidentName = styled.h3`
  font-family: 'Rubik', sans-serif;
  font-size: 2.5rem;
  color: ${colors.foamWhite};
  margin: 0;
  
  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const PresidentRole = styled.h4`
  font-family: 'Lato', sans-serif;
  font-size: 1.3rem;
  color: ${colors.foamWhite};
  margin: 0;
  font-weight: 600;
`;

const PresidentBio = styled.p`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.7;
  font-size: 1.1rem;
  margin: 0;
`;

// Board of Advisors styles
const AdvisorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 3rem;
  justify-items: center;
  max-width: 800px;
  margin: 3rem auto 0;
  
  .advisor-card:nth-child(4),
  .advisor-card:nth-child(5) {
    grid-column: span 1;
  }
  
  .second-row {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
    justify-items: center;
    max-width: 500px;
    margin: 2rem auto 0;
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
    max-width: 300px;
    
    .second-row {
      grid-template-columns: 1fr;
      max-width: 300px;
      gap: 1rem;
      margin-top: 1rem;
    }
  }
`;

const AdvisorCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    background: rgba(255, 255, 255, 0.12);
  }
`;

const AdvisorName = styled.h4`
  font-family: 'Rubik', sans-serif;
  font-size: 1.2rem;
  color: ${colors.foamWhite};
  margin-bottom: 0.5rem;
`;

const AdvisorTitle = styled.p`
  font-family: 'Lato', sans-serif;
  color: ${colors.foamWhite};
  font-size: 0.95rem;
  font-weight: 500;
  margin: 0;
`;

// Services section styles
const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 3rem;
  margin-top: 4rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ProductCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-10px);
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.dataTeal}, ${colors.safetyOrange});
  }
`;

const ProductLogoContainer = styled.div`
  width: 120px;
  height: 120px;
  margin: 0 auto 2rem;
  position: relative;
  border-radius: 15px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProductLogo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
`;

const ProductLogoPlaceholder = styled.div`
  display: none;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, ${colors.dataTeal}, ${colors.safetyOrange});
  border-radius: 15px;
`;

const ProductTitle = styled.h3`
  font-family: 'Rubik', sans-serif;
  font-size: 1.8rem;
  color: ${colors.foamWhite};
  margin-bottom: 1rem;
`;

const ProductDescription = styled.p`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ProductFeatures = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 2.5rem 0;
  text-align: left;
`;

const ProductFeature = styled.li`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  line-height: 1.5;
  margin-bottom: 0.8rem;
  position: relative;
  padding-left: 1.5rem;
  
  &::before {
    content: '⚓';
    position: absolute;
    left: 0;
    color: ${colors.safetyOrange};
    font-size: 1rem;
  }
`;

const ProductButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
`;

const ProductButton = styled(motion.button)`
  padding: 0.8rem 1.8rem;
  font-family: 'Rubik', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  min-width: 140px;
  
  ${props => props.variant === 'premium' ? `
    background: linear-gradient(135deg, ${colors.dataTeal}, #1e40af);
    color: ${colors.foamWhite};
    
    &:hover {
      background: linear-gradient(135deg, #1e40af, #1d4ed8);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    }
  ` : `
    background: linear-gradient(135deg, ${colors.safetyOrange}, #d97706);
    color: ${colors.foamWhite};
    
    &:hover {
      background: linear-gradient(135deg, #d97706, #b45309);
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(245, 158, 11, 0.4);
    }
  `}
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }
  
  &:active::before {
    width: 300px;
    height: 300px;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
`;

// Contact section styles
const ContactContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, ${colors.dataTeal}, ${colors.safetyOrange});
    border-radius: 20px 20px 0 0;
  }
`;

const ContactForm = styled.form`
  display: grid;
  gap: 1.5rem;
`;

const ContactRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
`;

const ContactField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const ContactLabel = styled.label`
  font-family: 'Rubik', sans-serif;
  font-weight: 600;
  color: ${colors.foamWhite};
  font-size: 1rem;
`;

const ContactInput = styled.input`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: ${colors.foamWhite};
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.dataTeal};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const ContactTextarea = styled.textarea`
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.1);
  color: ${colors.foamWhite};
  font-family: 'Lato', sans-serif;
  font-size: 1rem;
  min-height: 120px;
  resize: vertical;
  transition: all 0.3s ease;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.6);
  }
  
  &:focus {
    outline: none;
    border-color: ${colors.dataTeal};
    background: rgba(255, 255, 255, 0.15);
    box-shadow: 0 0 0 3px rgba(30, 64, 175, 0.1);
  }
`;

const ContactSubmitButton = styled(motion.button)`
  padding: 1rem 2rem;
  font-family: 'Rubik', sans-serif;
  font-size: 1.1rem;
  font-weight: 600;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, ${colors.dataTeal}, #1e40af);
  color: ${colors.foamWhite};
  justify-self: center;
  min-width: 200px;
  
  &:hover {
    background: linear-gradient(135deg, #1e40af, #1d4ed8);
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }
  
  &:active::before {
    width: 300px;
    height: 300px;
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactDescription = styled.p`
  font-family: 'Lato', sans-serif;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: center;
`;

const AboutSection = () => {
  const [contactForm, setContactForm] = React.useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitStatus, setSubmitStatus] = React.useState(null);

  const handleContactInputChange = (e) => {
    const { name, value } = e.target;
    setContactForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Basic validation
      if (!contactForm.firstName.trim() || !contactForm.lastName.trim() || 
          !contactForm.email.trim() || !contactForm.message.trim()) {
        throw new Error('Please fill in all fields');
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(contactForm.email)) {
        throw new Error('Please enter a valid email address');
      }

      // Simulate form submission (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSubmitStatus({ type: 'success', message: 'Message sent successfully! We\'ll get back to you soon.' });
      setContactForm({ firstName: '', lastName: '', email: '', message: '' });
    } catch (error) {
      setSubmitStatus({ type: 'error', message: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AboutContainer id="about">
      <BackgroundPattern />
      
      <ContentWrapper>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            About Seaward Strategies
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            Oceanum Vigilate
          </HeroSubtitle>
          
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            We empower decision-makers with insight through data, analytics, and simulation for the maritime environment.
          </HeroDescription>
        </HeroSection>

        {/* President Section */}
        <Section id="president">
          <SectionTitle>President</SectionTitle>
          
          <PresidentSection
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <PresidentImageContainer>
              <PresidentImage 
                src="/images/president-claude-berube.jpg" 
                alt="Claude Berube, PhD - President"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <PresidentImagePlaceholder>CB</PresidentImagePlaceholder>
            </PresidentImageContainer>
            
            <PresidentContent>
              <PresidentName>Claude Berube, PhD</PresidentName>
              <PresidentRole>President</PresidentRole>
              <PresidentBio>
                Claude Berube, PhD has more than three decades of experience on Capitol Hill in the Senate 
                and House, private sector, federal service, and military service. With a focus on the maritime 
                sector, he worked on research & development, acquisition, intelligence, and education programs. 
                He is a retired Navy Commander and taught at the US Naval Academy for two decades. He is the 
                author or co-editor of five non-fiction books on maritime security, naval history, maritime 
                activism, and Congress as well as a novel series.
              </PresidentBio>
            </PresidentContent>
          </PresidentSection>
        </Section>

        {/* Board of Advisors and Senior Data Engineer */}
        <Section>
          <SectionTitle>Board of Advisors and Senior Data Engineer</SectionTitle>
          
          <AdvisorsGrid>
            <AdvisorCard
              className="advisor-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <AdvisorName>Donald P. Henry, PhD</AdvisorName>
            </AdvisorCard>
            
            <AdvisorCard
              className="advisor-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <AdvisorName>Lynn Bak, PhD</AdvisorName>
            </AdvisorCard>
            
            <AdvisorCard
              className="advisor-card"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AdvisorName>The Honorable Derek "Dirk" Maurer, Esq</AdvisorName>
            </AdvisorCard>
            
            <div className="second-row">
              <AdvisorCard
                className="advisor-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                viewport={{ once: true }}
              >
                <AdvisorName>David N. Tanenbaum</AdvisorName>
              </AdvisorCard>
              
              <AdvisorCard
                className="advisor-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <AdvisorName>Goderdzi Gadelia</AdvisorName>
                <AdvisorTitle>Senior Data Engineer</AdvisorTitle>
              </AdvisorCard>
            </div>
          </AdvisorsGrid>
        </Section>

        {/* Services Section */}
        <Section id="services" className="services-section">
          <SectionTitle>Our Services</SectionTitle>
          
          <ServicesGrid>
            <ProductCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <ProductLogoContainer>
                <ProductLogo 
                  src="/images/product-intelligence-platform.png" 
                  alt="Maritime Intelligence Platform"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <ProductLogoPlaceholder>MIP</ProductLogoPlaceholder>
              </ProductLogoContainer>
              
              <ProductTitle>Maritime Intelligence Platform</ProductTitle>
              <ProductDescription>
                Advanced analytics and real-time intelligence for maritime operations, 
                providing comprehensive situational awareness and strategic insights.
              </ProductDescription>
              
              <ProductFeatures>
                <ProductFeature>Real-time vessel tracking and monitoring</ProductFeature>
                <ProductFeature>Advanced predictive analytics and forecasting</ProductFeature>
                <ProductFeature>Comprehensive threat assessment and risk analysis</ProductFeature>
                <ProductFeature>Automated anomaly detection and alerts</ProductFeature>
                <ProductFeature>Customizable dashboards and reporting tools</ProductFeature>
              </ProductFeatures>
              
              <ProductButtonContainer>
                <ProductButton
                  variant="premium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Premium
                </ProductButton>
                <ProductButton
                  variant="demo"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request Demo
                </ProductButton>
              </ProductButtonContainer>
            </ProductCard>
            
            <ProductCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ProductLogoContainer>
                <ProductLogo 
                  src="/images/product-data-analytics.png" 
                  alt="Maritime Data Analytics Suite"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <ProductLogoPlaceholder>DAS</ProductLogoPlaceholder>
              </ProductLogoContainer>
              
              <ProductTitle>Maritime Data Analytics Suite</ProductTitle>
              <ProductDescription>
                Comprehensive data processing and simulation tools for maritime environment 
                analysis, enabling data-driven decision making and strategic planning.
              </ProductDescription>
              
              <ProductFeatures>
                <ProductFeature>Advanced oceanographic data processing</ProductFeature>
                <ProductFeature>Machine learning-powered pattern recognition</ProductFeature>
                <ProductFeature>High-fidelity maritime environment simulation</ProductFeature>
                <ProductFeature>Integrated multi-source data fusion capabilities</ProductFeature>
                <ProductFeature>Scalable cloud-based processing infrastructure</ProductFeature>
              </ProductFeatures>
              
              <ProductButtonContainer>
                <ProductButton
                  variant="premium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Premium
                </ProductButton>
                <ProductButton
                  variant="demo"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Request Demo
                </ProductButton>
              </ProductButtonContainer>
            </ProductCard>
          </ServicesGrid>
        </Section>

        {/* Contact Section */}
        <Section id="contact">
          <SectionTitle>Contact Us</SectionTitle>
          
          <ContactContainer>
            <ContactDescription>
              Ready to transform your maritime operations? Get in touch with our team to learn more about our solutions and how we can help your organization achieve its strategic objectives.
            </ContactDescription>
            
            <ContactForm onSubmit={handleContactSubmit}>
              {submitStatus && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    padding: '1rem',
                    borderRadius: '10px',
                    marginBottom: '1.5rem',
                    background: submitStatus.type === 'success' 
                      ? 'rgba(34, 197, 94, 0.1)' 
                      : 'rgba(239, 68, 68, 0.1)',
                    border: `1px solid ${submitStatus.type === 'success' ? '#22c55e' : '#ef4444'}`,
                    color: submitStatus.type === 'success' ? '#22c55e' : '#ef4444',
                    textAlign: 'center'
                  }}
                >
                  {submitStatus.message}
                </motion.div>
              )}
              
              <ContactRow>
                <ContactField>
                  <ContactLabel htmlFor="firstName">First Name</ContactLabel>
                  <ContactInput
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={contactForm.firstName}
                    onChange={handleContactInputChange}
                    placeholder="Enter your first name"
                    required
                    disabled={isSubmitting}
                  />
                </ContactField>
                
                <ContactField>
                  <ContactLabel htmlFor="lastName">Last Name</ContactLabel>
                  <ContactInput
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={contactForm.lastName}
                    onChange={handleContactInputChange}
                    placeholder="Enter your last name"
                    required
                    disabled={isSubmitting}
                  />
                </ContactField>
              </ContactRow>
              
              <ContactField>
                <ContactLabel htmlFor="email">Email Address</ContactLabel>
                <ContactInput
                  type="email"
                  id="email"
                  name="email"
                  value={contactForm.email}
                  onChange={handleContactInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={isSubmitting}
                />
              </ContactField>
              
              <ContactField>
                <ContactLabel htmlFor="message">Message</ContactLabel>
                <ContactTextarea
                  id="message"
                  name="message"
                  value={contactForm.message}
                  onChange={handleContactInputChange}
                  placeholder="Tell us about your maritime intelligence needs, project requirements, or any questions you may have..."
                  rows="5"
                  required
                  disabled={isSubmitting}
                />
              </ContactField>
              
              <ContactSubmitButton
                type="submit"
                disabled={isSubmitting}
                whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </ContactSubmitButton>
            </ContactForm>
          </ContactContainer>
        </Section>

      </ContentWrapper>
    </AboutContainer>
  );
};

export default AboutSection;