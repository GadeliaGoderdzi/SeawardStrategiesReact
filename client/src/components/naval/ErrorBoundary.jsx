import React from 'react';
import styled from 'styled-components';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 2rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  border-radius: 12px;
  margin: 2rem;
`;

const ErrorTitle = styled.h2`
  color: #dc3545;
  margin-bottom: 1rem;
  font-size: 1.5rem;
`;

const ErrorMessage = styled.p`
  color: #64748b;
  text-align: center;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const RetryButton = styled.button`
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #2563eb, #1d4ed8);
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(37, 99, 235, 0.4);
  }
`;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Naval component error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorContainer>
          <ErrorTitle>⚓ Naval System Error</ErrorTitle>
          <ErrorMessage>
            There was an issue loading the naval components. 
            This is likely due to missing dependencies or browser compatibility.
          </ErrorMessage>
          <RetryButton 
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
          >
            Restart Naval Systems
          </RetryButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;