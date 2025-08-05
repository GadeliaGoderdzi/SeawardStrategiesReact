import React from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';

// Color palette
const colors = {
  deepNavy: '#0a2463',
  dataTeal: '#4ecdc4',
  safetyOrange: '#ff6b6b',
  foamWhite: '#ffffff',
  darkBlue: '#0c1c3d',
  lightBlue: '#e8f4f8'
};

// Main container
const AboutContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, ${colors.deepNavy} 0%, ${colors.darkBlue} 100%);
  padding-top: 100px;
  position: relative;
  overflow: hidden;
`;

// Background elements
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

// Hero section
const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 0 6rem;
`;

const HeroTitle = styled(motion.h1)`
  font-family: 'Rubik', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  color: ${colors.foamWhite};
  margin-bottom: 1.5rem;
  line-height: 1.2;
`;

const HeroSubtitle = styled(motion.p)`
  font-family: 'Lato', sans-serif;
  font-size: 1.5rem;
  color: ${colors.dataTeal};
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

// Section styling
const Section = styled.section`
  margin-bottom: 6rem;
`;

const SectionTitle = styled.h2`
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

const TeamName = styled.h3`
  font-family: 'Rubik', sans-serif;
  font-size: 1.5rem;
  color: ${colors.foamWhite};
  margin-bottom: 0.5rem;
`;

const TeamTitle = styled.h4`
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
`;

// Board of Advisors section
const AdvisorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 3rem;
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
  color: ${colors.dataTeal};
  font-size: 0.95rem;
  font-weight: 500;
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
  
  &:hover {
    background: rgba(255, 255, 255, 0.08);
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

const AboutUs = () => {
  return (
    <AboutContainer>
      <BackgroundPattern />
      
      <ContentWrapper>
        {/* Hero Section */}
        <HeroSection>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            About Seaward Strategies
          </HeroTitle>
          
          <HeroSubtitle
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Oceanum Vigilate
          </HeroSubtitle>
          
          <HeroDescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            We are maritime intelligence experts dedicated to transforming how the world understands 
            and navigates our oceans. Through cutting-edge technology and deep maritime expertise, 
            we provide strategic insights that drive safer, more efficient maritime operations.
          </HeroDescription>
        </HeroSection>

        {/* Leadership Team */}
        <Section>
          <SectionTitle>Leadership Team</SectionTitle>
          
          <TeamGrid>
            <TeamCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <TeamPhoto>CB</TeamPhoto>
              <TeamName>Claude Berube, PhD</TeamName>
              <TeamTitle>President</TeamTitle>
              <TeamBio>
                Dr. Claude Berube brings more than three decades of distinguished experience across 
                Capitol Hill, private sector, federal service, and military service. With a specialized 
                focus on the maritime sector, he has worked extensively on research & development, 
                acquisition, intelligence, and education programs.
                <br /><br />
                A retired Navy Commander, Dr. Berube taught at the US Naval Academy for two decades, 
                shaping the next generation of naval leaders. He is the accomplished author or co-editor 
                of five non-fiction books covering maritime security, naval history, maritime activism, 
                and Congress, as well as a compelling novel series.
                <br /><br />
                His unique blend of academic excellence, operational experience, and policy expertise 
                makes him an invaluable leader in maritime intelligence and strategy.
              </TeamBio>
            </TeamCard>
            
            <TeamCard
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <TeamPhoto>GG</TeamPhoto>
              <TeamName>Goderdzi Gadelia</TeamName>
              <TeamTitle>Senior Data Engineer</TeamTitle>
              <TeamBio>
                Goderdzi Gadelia serves as our Senior Data Engineer, bringing exceptional technical 
                expertise in maritime data systems and analytics. His role is crucial in developing 
                and maintaining the sophisticated data infrastructure that powers our maritime 
                intelligence platform.
                <br /><br />
                With deep expertise in data engineering, machine learning pipelines, and maritime 
                data processing, Goderdzi ensures that our clients receive accurate, timely, and 
                actionable insights from complex oceanic datasets.
                <br /><br />
                His technical leadership drives our ability to transform raw maritime data into 
                strategic intelligence that guides critical decision-making in the maritime industry.
              </TeamBio>
            </TeamCard>
          </TeamGrid>
        </Section>

        {/* Board of Advisors */}
        <Section>
          <SectionTitle>Board of Advisors</SectionTitle>
          
          <AdvisorsGrid>
            <AdvisorCard
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <AdvisorName>Donald P. Henry, PhD</AdvisorName>
              <AdvisorTitle>Strategic Advisor</AdvisorTitle>
            </AdvisorCard>
            
            <AdvisorCard
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <AdvisorName>Lynn Bak, PhD</AdvisorName>
              <AdvisorTitle>Strategic Advisor</AdvisorTitle>
            </AdvisorCard>
            
            <AdvisorCard
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <AdvisorName>The Honorable Derek "Dirk" Maurer, Esq</AdvisorName>
              <AdvisorTitle>Legal & Policy Advisor</AdvisorTitle>
            </AdvisorCard>
            
            <AdvisorCard
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <AdvisorName>David N. Tanenbaum</AdvisorName>
              <AdvisorTitle>Of Counsel</AdvisorTitle>
            </AdvisorCard>
          </AdvisorsGrid>
        </Section>

        {/* Company Values */}
        <Section>
          <SectionTitle>Our Values</SectionTitle>
          
          <ValuesGrid>
            <ValueCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <ValueIcon>🧭</ValueIcon>
              <ValueTitle>Strategic Vision</ValueTitle>
              <ValueDescription>
                We navigate complex maritime challenges with strategic foresight, 
                providing clear direction in an ever-changing oceanic landscape.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <ValueIcon>⚓</ValueIcon>
              <ValueTitle>Reliability</ValueTitle>
              <ValueDescription>
                Like a trusted anchor, our intelligence and analysis provide 
                stability and confidence in critical maritime decision-making.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <ValueIcon>🌊</ValueIcon>
              <ValueTitle>Innovation</ValueTitle>
              <ValueDescription>
                We harness cutting-edge technology and data science to unlock 
                new insights from the vast expanse of maritime information.
              </ValueDescription>
            </ValueCard>
            
            <ValueCard
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <ValueIcon>🔭</ValueIcon>
              <ValueTitle>Vigilance</ValueTitle>
              <ValueDescription>
                True to our motto "Oceanum Vigilate" - we maintain constant 
                watch over maritime domains, ensuring nothing escapes our analysis.
              </ValueDescription>
            </ValueCard>
          </ValuesGrid>
        </Section>
      </ContentWrapper>
    </AboutContainer>
  );
};

export default AboutUs;