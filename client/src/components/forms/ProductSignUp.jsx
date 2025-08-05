import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components';
import { FaShip, FaCheckCircle, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const ProductSignUpContainer = styled(motion.div)`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 1rem;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1a365d;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Subtitle = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: #f8fafc;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border: 2px solid ${props => props.selected ? '#2563eb' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: #2563eb;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  ${props => props.selected && `
    background: rgba(37, 99, 235, 0.05);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  `}
`;

const ProductIcon = styled.div`
  width: 48px;
  height: 48px;
  background: ${props => props.selected ? '#2563eb' : '#64748b'};
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
`;

const ProductName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const ProductDescription = styled.p`
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const SelectedBadge = styled(motion.div)`
  position: absolute;
  top: -8px;
  right: -8px;
  background: #10b981;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
`;

const TierSection = styled.div`
  margin-bottom: 1.5rem;
`;

const TierGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const TierCard = styled(motion.div)`
  background: white;
  border: 2px solid ${props => props.selected ? '#2563eb' : '#e2e8f0'};
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  text-align: center;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  }

  ${props => props.selected && `
    background: rgba(37, 99, 235, 0.05);
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
  `}
`;

const TierName = styled.h4`
  font-size: 1.1rem;
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
`;

const TierPrice = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: #2563eb;
  margin-bottom: 0.5rem;
`;

const TierDescription = styled.p`
  color: #64748b;
  font-size: 0.9rem;
`;

const TermsSection = styled.div`
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
`;

const TermsCheckbox = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  
  input[type="checkbox"] {
    margin-top: 0.25rem;
    width: auto;
    min-width: 16px;
  }
  
  label {
    font-size: 0.9rem;
    color: #374151;
    line-height: 1.5;
    cursor: pointer;
    
    a {
      color: #2563eb;
      text-decoration: none;
      
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

const ErrorMessage = styled(motion.div)`
  color: #dc3545;
  font-size: 0.875rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1rem 2rem;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
  }
`;

const LoadingSpinner = styled(motion.div)`
  width: 20px;
  height: 20px;
  border: 2px solid transparent;
  border-top: 2px solid white;
  border-radius: 50%;
  margin-right: 0.5rem;
`;

const products = [
  {
    id: 'fleet-management',
    name: 'Fleet Management',
    description: 'Comprehensive fleet tracking and management system with real-time monitoring.',
    icon: '🚢'
  },
  {
    id: 'navigation-suite',
    name: 'Navigation Suite',
    description: 'Advanced navigation tools with weather integration and route optimization.',
    icon: '🧭'
  },
  {
    id: 'cargo-logistics',
    name: 'Cargo Logistics',
    description: 'Complete cargo management with loading optimization and tracking.',
    icon: '📦'
  },
  {
    id: 'maritime-analytics',
    name: 'Maritime Analytics',
    description: 'Data analytics and reporting for operational insights and performance.',
    icon: '📊'
  }
];

const tiers = [
  {
    id: 'basic',
    name: 'Basic',
    price: '$49/month',
    description: 'Perfect for small operations with essential features and support.'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: '$99/month',
    description: 'Advanced features for growing fleets with priority support and analytics.'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    description: 'Full-scale solution with custom integrations and dedicated support.'
  }
];

const ProductSignUp = ({ onSuccess, onCancel }) => {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedTier, setSelectedTier] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const { user, apiCall } = useAuth();

  const validateForm = () => {
    const newErrors = {};
    
    if (!selectedProduct) {
      newErrors.product = 'Please select a product';
    }
    
    if (!selectedTier) {
      newErrors.tier = 'Please select a subscription tier';
    }
    
    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the terms and conditions to continue';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await apiCall('/api/product-signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productName: products.find(p => p.id === selectedProduct)?.name,
          tier: selectedTier,
        }),
      });
      
      if (onSuccess) {
        onSuccess({
          product: products.find(p => p.id === selectedProduct)?.name,
          tier: selectedTier
        });
      }
    } catch (error) {
      setErrors({ 
        submit: error.message || 'Failed to sign up for product. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ProductSignUpContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Header>
        <Title>
          <FaShip />
          Product Sign-Up
        </Title>
        <Subtitle>
          Welcome {user?.name}! Choose your maritime solution and subscription tier.
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>
        <Section>
          <SectionTitle>
            <FaInfoCircle />
            Select Product
          </SectionTitle>
          <ProductGrid>
            {products.map((product) => (
              <ProductCard
                key={product.id}
                selected={selectedProduct === product.id}
                onClick={() => {
                  setSelectedProduct(product.id);
                  if (errors.product) {
                    setErrors(prev => ({ ...prev, product: '' }));
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ProductIcon selected={selectedProduct === product.id}>
                  {product.icon}
                </ProductIcon>
                <ProductName>{product.name}</ProductName>
                <ProductDescription>{product.description}</ProductDescription>
                {selectedProduct === product.id && (
                  <SelectedBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FaCheckCircle />
                  </SelectedBadge>
                )}
              </ProductCard>
            ))}
          </ProductGrid>
          {errors.product && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaTimes />
              {errors.product}
            </ErrorMessage>
          )}
        </Section>

        <Section>
          <SectionTitle>
            <FaInfoCircle />
            Choose Subscription Tier
          </SectionTitle>
          <TierGrid>
            {tiers.map((tier) => (
              <TierCard
                key={tier.id}
                selected={selectedTier === tier.id}
                onClick={() => {
                  setSelectedTier(tier.id);
                  if (errors.tier) {
                    setErrors(prev => ({ ...prev, tier: '' }));
                  }
                }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <TierName>{tier.name}</TierName>
                <TierPrice>{tier.price}</TierPrice>
                <TierDescription>{tier.description}</TierDescription>
                {selectedTier === tier.id && (
                  <SelectedBadge
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <FaCheckCircle />
                  </SelectedBadge>
                )}
              </TierCard>
            ))}
          </TierGrid>
          {errors.tier && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaTimes />
              {errors.tier}
            </ErrorMessage>
          )}
        </Section>

        <TermsSection>
          <TermsCheckbox>
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(e.target.checked);
                if (errors.terms && e.target.checked) {
                  setErrors(prev => ({ ...prev, terms: '' }));
                }
              }}
            />
            <label htmlFor="terms">
              I accept the <a href="/terms" target="_blank" rel="noopener noreferrer">Terms and Conditions</a> and 
              <a href="/privacy" target="_blank" rel="noopener noreferrer"> Privacy Policy</a>. 
              I understand that this subscription will be billed according to the selected tier and can be cancelled at any time.
            </label>
          </TermsCheckbox>
          {errors.terms && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <FaTimes />
              {errors.terms}
            </ErrorMessage>
          )}
        </TermsSection>

        {errors.submit && (
          <ErrorMessage
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <FaTimes />
            {errors.submit}
          </ErrorMessage>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          {onCancel && (
            <SubmitButton
              type="button"
              onClick={onCancel}
              style={{ 
                background: '#6b7280',
                flex: '0 0 auto',
                width: 'auto',
                paddingLeft: '2rem',
                paddingRight: '2rem'
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Cancel
            </SubmitButton>
          )}
          <SubmitButton
            type="submit"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading && (
              <LoadingSpinner
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
            )}
            {isLoading ? 'Processing...' : 'Complete Sign-Up'}
          </SubmitButton>
        </div>
      </Form>
    </ProductSignUpContainer>
  );
};

ProductSignUp.propTypes = {
  onSuccess: PropTypes.func,
  onCancel: PropTypes.func
};

export default ProductSignUp;