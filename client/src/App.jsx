import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { useReducedMotion } from './hooks/useIntersectionObserver';

// Components
import Header from './components/naval/Header';
import ErrorBoundary from './components/naval/ErrorBoundary';

// Main landing page
import MaritimeLanding from './pages/MaritimeLanding';
import MaritimeHeaderDemo from './pages/MaritimeHeaderDemo';

// Lazy loaded components
const About = lazy(() => import('./pages/About'));
const Contact = lazy(() => import('./pages/Contact'));
const Login = lazy(() => import('./pages/Login'));
const SignUp = lazy(() => import('./pages/SignUp'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const UserProfileDashboard = lazy(() => import('./components/auth/UserProfileDashboard'));
const EmailVerificationSent = lazy(() => import('./pages/EmailVerificationSent'));
const VerifyEmail = lazy(() => import('./pages/VerifyEmail'));
const CompleteProfile = lazy(() => import('./pages/CompleteProfile'));


// Theme configuration
const theme = {
  colors: {
    primary: '#1a365d',
    secondary: '#2563eb',
    accent: '#fbbf24',
    text: '#374151',
    background: '#f9fafb',
    white: '#ffffff'
  },
  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1200px'
  },
  animations: {
    fast: '0.3s',
    normal: '0.5s',
    slow: '0.8s',
    easing: 'cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
};

// Global styles
const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
  }

  @import url('https://fonts.googleapis.com/css2?family=Rubik:wght@300;400;500;600;700&family=Lato:wght@300;400;700&display=swap');

  body {
    font-family: 'Lato', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    line-height: 1.6;
    color: ${props => props.theme.colors.text};
    background-color: ${props => props.theme.colors.background};
    overflow-x: hidden;
  }

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }

  /* Custom scrollbar */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  ::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #2563eb, #1d4ed8);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: linear-gradient(135deg, #1d4ed8, #1e40af);
  }

  /* Selection styles */
  ::selection {
    background: rgba(37, 99, 235, 0.2);
    color: ${props => props.theme.colors.primary};
  }

  /* Focus styles */
  button:focus,
  a:focus {
    outline: 2px solid ${props => props.theme.colors.accent};
    outline-offset: 2px;
  }
`;

const AppContainer = styled(motion.div)`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const MainContent = styled.main`
  flex: 1;
  position: relative;
  padding-top: 80px; /* Account for fixed header height */
`;

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;
  
  return user ? children : <Navigate to="/login" replace />;
};

// Public Route Component (redirect to dashboard if already logged in)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <LoadingContainer>Loading...</LoadingContainer>;
  
  return user ? <Navigate to="/dashboard" replace /> : children;
};

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  font-size: 1.2rem;
  color: ${props => props.theme.colors.primary};
  
  &::after {
    content: '';
    width: 20px;
    height: 20px;
    border: 3px solid ${props => props.theme.colors.accent};
    border-top: 3px solid transparent;
    border-radius: 50%;
    margin-left: 1rem;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  text-align: center;
  color: #dc3545;
  
  h2 {
    margin-bottom: 1rem;
  }
  
  button {
    padding: 0.5rem 1rem;
    background: ${props => props.theme.colors.primary};
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    
    &:hover {
      background: ${props => props.theme.colors.secondary};
    }
  }
`;

// Loading component
const LoadingSpinner = () => (
  <LoadingContainer>
    Loading naval systems...
  </LoadingContainer>
);

// Error fallback component
const ErrorFallback = ({ error, resetError }) => (
  <ErrorContainer>
    <h2>Something went wrong with the naval systems</h2>
    <p>{error?.message || 'An unexpected error occurred'}</p>
    <button onClick={resetError}>Restart Systems</button>
  </ErrorContainer>
);

// Page transition variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -20 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5
};

// App Content Component (inside AuthProvider to access auth state)
const AppContent = () => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <AppContainer
      initial="initial"
      animate="in"
      exit="out"
      variants={prefersReducedMotion ? {} : pageVariants}
      transition={prefersReducedMotion ? {} : pageTransition}
    >
      <Header />
      
      <MainContent>
        <AnimatePresence mode="wait">
          <Routes>
            <Route 
              path="/" 
              element={
                <ErrorBoundary>
                  <MaritimeLanding />
                </ErrorBoundary>
              } 
            />
            <Route 
              path="/maritime-header-demo" 
              element={
                <ErrorBoundary>
                  <MaritimeHeaderDemo />
                </ErrorBoundary>
              } 
            />

            <Route 
              path="/about" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <About />
                </Suspense>
              } 
            />
            <Route 
              path="/contact" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Contact />
                </Suspense>
              } 
            />
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <Login />
                  </Suspense>
                </PublicRoute>
              } 
            />
            <Route 
              path="/signup" 
              element={
                <PublicRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <SignUp />
                  </Suspense>
                </PublicRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <UserProfileDashboard />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/data-dashboard" 
              element={
                <Suspense fallback={<LoadingSpinner />}>
                  <Dashboard />
                </Suspense>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <UserProfileDashboard />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/verify-email-sent" 
              element={
                <PublicRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <EmailVerificationSent />
                  </Suspense>
                </PublicRoute>
              } 
            />
            <Route 
              path="/verify-email" 
              element={
                <PublicRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <VerifyEmail />
                  </Suspense>
                </PublicRoute>
              } 
            />
            <Route 
              path="/complete-profile" 
              element={
                <ProtectedRoute>
                  <Suspense fallback={<LoadingSpinner />}>
                    <CompleteProfile />
                  </Suspense>
                </ProtectedRoute>
              } 
            />
            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </MainContent>
    </AppContainer>
  );
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;