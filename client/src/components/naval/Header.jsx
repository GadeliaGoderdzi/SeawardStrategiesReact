import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaBars, 
  FaTimes, 
  FaUser, 
  FaChevronDown, 
  FaCog, 
  FaSignOutAlt,
  FaShip,
  FaPlus
} from 'react-icons/fa';
import { useHeaderAnimation } from '../../hooks/useScrollAnimation';
import { useReducedMotion } from '../../hooks/useIntersectionObserver';
import { useAuth } from '../../hooks/useAuth';
import PropTypes from 'prop-types';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: ${props => props.isScrolled ? 'rgba(26, 54, 93, 0.95)' : '#1a365d'};
  backdrop-filter: ${props => props.isScrolled ? 'blur(10px)' : 'none'};
  transition: all 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
  box-shadow: ${props => props.isScrolled ? '0 4px 20px rgba(0,0,0,0.1)' : 'none'};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const Logo = styled(motion.div)`
  width: 150px;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  
  .logo-image {
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;
  }
  
  .logo-fallback {
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    color: #1a365d;
    font-size: 1.2rem;
    letter-spacing: 1px;
    border-radius: 8px;
  }
`;

const NavMenu = styled(motion.ul)`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;

  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: ${props => props.isOpen ? '0' : '-100%'};
    width: 100%;
    height: 100vh;
    background: linear-gradient(135deg, #1a365d 0%, #2563eb 100%);
    flex-direction: column;
    justify-content: center;
    align-items: center;
    transition: left 0.3s ease-in-out;
    z-index: 999;
    padding: 2rem;
  }
`;

const NavItem = styled(motion.li)`
  position: relative;
`;

const NavLink = styled(Link)`
  color: white;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: #fbbf24;
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }

  &:hover::after {
    width: 80%;
  }

  @media (max-width: 768px) {
    font-size: 1.5rem;
    padding: 1rem 2rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    display: ${props => props.isMenuOpen ? 'flex' : 'none'};
    position: fixed;
    bottom: 4rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    flex-direction: column;
    gap: 1rem;
  }
`;

const MobileUserInfo = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: ${props => props.isMenuOpen && props.user ? 'block' : 'none'};
    position: fixed;
    top: 6rem;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
    text-align: center;
    color: white;
    
    .mobile-avatar {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(45deg, #fbbf24, #f59e0b);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1a365d;
      font-size: 1.5rem;
      font-weight: bold;
      margin: 0 auto 1rem;
    }
    
    .mobile-user-name {
      font-size: 1.2rem;
      font-weight: 600;
      margin-bottom: 0.5rem;
    }
    
    .mobile-user-email {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
`;

const Button = styled(motion.button)`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  ${props => props.variant === 'outline' ? `
    background: transparent;
    color: white;
    border: 2px solid white;
    
    &:hover {
      background: white;
      color: #1a365d;
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(255,255,255,0.3);
    }
  ` : `
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    color: #1a365d;
    border: none;
    
    &:hover {
      background: linear-gradient(45deg, #f59e0b, #d97706);
      transform: translateY(-2px);
      box-shadow: 0 4px 15px rgba(251,191,36,0.4);
    }
  `}

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    background: rgba(255,255,255,0.3);
    border-radius: 50%;
    transform: translate(-50%, -50%);
    transition: width 0.3s ease, height 0.3s ease;
  }

  &:active::before {
    width: 300px;
    height: 300px;
  }
`;

const UserMenu = styled.div`
  position: relative;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const MobileUserButtons = styled.div`
  display: none;
  flex-direction: column;
  gap: 1rem;
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const UserButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 8px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: linear-gradient(45deg, #fbbf24, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #1a365d;
    font-size: 0.9rem;
  }

  .user-name {
    font-size: 0.9rem;
    
    @media (max-width: 900px) {
      display: none;
    }
  }

  .chevron {
    transition: transform 0.3s ease;
    transform: ${props => props.isOpen ? 'rotate(180deg)' : 'rotate(0deg)'};
  }
`;

const UserDropdown = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 220px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1002;
  border: 1px solid rgba(0, 0, 0, 0.1);
`;

const UserInfo = styled.div`
  padding: 1rem;
  border-bottom: 1px solid #f3f4f6;
  margin-bottom: 0.5rem;

  .user-name {
    font-weight: 600;
    color: #1a365d;
    margin-bottom: 0.25rem;
  }

  .user-email {
    font-size: 0.875rem;
    color: #64748b;
  }
`;

const DropdownItem = styled(motion.button)`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: none;
  border: none;
  border-radius: 8px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
  text-align: left;

  &:hover {
    background: #f3f4f6;
    color: #1a365d;
  }

  &.danger {
    color: #dc3545;
    
    &:hover {
      background: #fef2f2;
      color: #dc2626;
    }
  }

  .icon {
    width: 16px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const MobileMenuButton = styled(motion.button)`
  display: none;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const headerVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0.0, 0.2, 1],
      staggerChildren: 0.1
    }
  }
};

const logoVariants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: 1,
    rotate: 0,
    transition: {
      duration: 0.8,
      ease: "backOut"
    }
  },
  hover: {
    scale: 1.05,
    rotate: [0, -5, 5, 0],
    transition: {
      duration: 0.6,
      ease: "easeInOut"
    }
  }
};

const navItemVariants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: [0.4, 0.0, 0.2, 1]
    }
  }
};

const buttonVariants = {
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
    scale: 1.05,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1
    }
  }
};

const dropdownVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: -10,
    transition: {
      duration: 0.2,
      ease: "easeOut"
    }
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "backOut",
      staggerChildren: 0.05
    }
  }
};

const dropdownItemVariants = {
  hidden: {
    opacity: 0,
    x: -10
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut"
    }
  }
};

const Header = ({ onLoginClick, onSignUpClick }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { isHeaderVisible, isScrolled } = useHeaderAnimation();
  const prefersReducedMotion = useReducedMotion();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const navigationItems = [
    { name: 'Home', href: '/', isRoute: true },
    { name: 'About', href: '#about', isRoute: false },
    { name: 'Services', href: '#services', isRoute: false },
    { name: 'Contact', href: '#contact', isRoute: false }
  ];

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  }, [navigate]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserMenuOpen(false);
  };

  const toggleUserMenu = () => {
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleNavClick = (href, isRoute) => {
    if (isRoute) {
      navigate(href);
    } else {
      // Enhanced scroll behavior with different offsets for each section
      const element = document.querySelector(href);
      if (element) {
        const headerHeight = 80; // Account for fixed header
        let additionalOffset = 0;
        
        // Set specific offsets for each section
        switch (href) {
          case '#about':
            additionalOffset = -320;
            break;
          case '#services':
            additionalOffset = -1030;
            break;
          case '#contact':
            additionalOffset = -970;
            break;
          default:
            additionalOffset = -1700;
        }
        
        const elementPosition = element.offsetTop - headerHeight - additionalOffset;
        
        window.scrollTo({
          top: elementPosition,
          behavior: 'smooth'
        });
      }
    }
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleLogin = () => {
    navigate('/login');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleSignUp = () => {
    navigate('/signup');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const handleProfile = () => {
    navigate('/dashboard');
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleProducts = () => {
    navigate('/dashboard'); // Will show products section
    setIsUserMenuOpen(false);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
    setIsUserMenuOpen(false);
  };

  const getUserInitials = (user) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
    }
    if (user?.name) {
      const names = user.name.split(' ');
      return names.length > 1 
        ? `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase()
        : user.name.charAt(0).toUpperCase();
    }
    return 'U';
  };

  return (
    <HeaderContainer
      initial="hidden"
      animate={isHeaderVisible ? "visible" : "hidden"}
      variants={prefersReducedMotion ? {} : headerVariants}
      isScrolled={isScrolled}
    >
      <Nav>
        <Logo
          variants={prefersReducedMotion ? {} : logoVariants}
          whileHover={prefersReducedMotion ? {} : "hover"}
          onClick={() => navigate('/')}
        >
          <img 
            src="/logo.png" 
            alt="Company Logo" 
            className="logo-image"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="logo-fallback" style={{ display: 'none' }}>
            NAVAL
          </div>
        </Logo>

        <NavMenu isOpen={isMobileMenuOpen}>
          {navigationItems.map((item, index) => (
            <NavItem
              key={item.name}
              variants={prefersReducedMotion ? {} : navItemVariants}
            >
              <NavLink
                to={item.isRoute ? item.href : '#'}
                onClick={(e) => {
                  if (!item.isRoute) {
                    e.preventDefault();
                  }
                  handleNavClick(item.href, item.isRoute);
                }}
                whileHover={prefersReducedMotion ? {} : { y: -2 }}
                whileTap={prefersReducedMotion ? {} : { y: 0 }}
              >
                {item.name}
              </NavLink>
            </NavItem>
          ))}
        </NavMenu>

        <MobileUserInfo isMenuOpen={isMobileMenuOpen} user={user}>
          {user && (
            <>
              <div className="mobile-avatar">
                {getUserInitials(user)}
              </div>
              <div className="mobile-user-name">
                {user.name || `${user.firstName} ${user.lastName}` || 'User'}
              </div>
              <div className="mobile-user-email">{user.email}</div>
            </>
          )}
        </MobileUserInfo>

        <ButtonGroup isMenuOpen={isMobileMenuOpen}>
          {user ? (
            <>
              {/* Desktop User Menu */}
              <UserMenu ref={userMenuRef}>
                <UserButton
                  isOpen={isUserMenuOpen}
                  onClick={toggleUserMenu}
                  variants={prefersReducedMotion ? {} : buttonVariants}
                  whileHover={prefersReducedMotion ? {} : "hover"}
                  whileTap={prefersReducedMotion ? {} : "tap"}
                >
                  <div className="user-avatar">
                    {getUserInitials(user)}
                  </div>
                  <span className="user-name">
                    {user.firstName || user.name?.split(' ')[0] || 'User'}
                  </span>
                  <FaChevronDown className="chevron" />
                </UserButton>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <UserDropdown
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      variants={prefersReducedMotion ? {} : dropdownVariants}
                    >
                      <UserInfo>
                        <div className="user-name">
                          {user.name || `${user.firstName} ${user.lastName}` || 'User'}
                        </div>
                        <div className="user-email">{user.email}</div>
                      </UserInfo>

                      <DropdownItem
                        onClick={handleProfile}
                        variants={prefersReducedMotion ? {} : dropdownItemVariants}
                        whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      >
                        <div className="icon">
                          <FaUser />
                        </div>
                        Profile & Settings
                      </DropdownItem>

                      <DropdownItem
                        onClick={handleProducts}
                        variants={prefersReducedMotion ? {} : dropdownItemVariants}
                        whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      >
                        <div className="icon">
                          <FaShip />
                        </div>
                        My Products
                      </DropdownItem>

                      <DropdownItem
                        onClick={() => {
                          navigate('/dashboard');
                          setIsUserMenuOpen(false);
                        }}
                        variants={prefersReducedMotion ? {} : dropdownItemVariants}
                        whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      >
                        <div className="icon">
                          <FaPlus />
                        </div>
                        Add Product
                      </DropdownItem>

                      <DropdownItem
                        className="danger"
                        onClick={handleLogout}
                        variants={prefersReducedMotion ? {} : dropdownItemVariants}
                        whileHover={prefersReducedMotion ? {} : { x: 4 }}
                      >
                        <div className="icon">
                          <FaSignOutAlt />
                        </div>
                        Sign Out
                      </DropdownItem>
                    </UserDropdown>
                  )}
                </AnimatePresence>
              </UserMenu>

              {/* Mobile User Menu Buttons */}
              <MobileUserButtons>
                <Button
                  variant="outline"
                  variants={prefersReducedMotion ? {} : buttonVariants}
                  whileHover={prefersReducedMotion ? {} : "hover"}
                  whileTap={prefersReducedMotion ? {} : "tap"}
                  onClick={handleProfile}
                >
                  Profile & Settings
                </Button>
                <Button
                  variant="outline"
                  variants={prefersReducedMotion ? {} : buttonVariants}
                  whileHover={prefersReducedMotion ? {} : "hover"}
                  whileTap={prefersReducedMotion ? {} : "tap"}
                  onClick={handleProducts}
                >
                  My Products
                </Button>
                <Button
                  variants={prefersReducedMotion ? {} : buttonVariants}
                  whileHover={prefersReducedMotion ? {} : "hover"}
                  whileTap={prefersReducedMotion ? {} : "tap"}
                  onClick={handleLogout}
                >
                  Sign Out
                </Button>
              </MobileUserButtons>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                variants={prefersReducedMotion ? {} : buttonVariants}
                whileHover={prefersReducedMotion ? {} : "hover"}
                whileTap={prefersReducedMotion ? {} : "tap"}
                onClick={handleLogin}
              >
                Log In
              </Button>
              <Button
                variants={prefersReducedMotion ? {} : buttonVariants}
                whileHover={prefersReducedMotion ? {} : "hover"}
                whileTap={prefersReducedMotion ? {} : "tap"}
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
            </>
          )}
        </ButtonGroup>

        <MobileMenuButton
          onClick={toggleMobileMenu}
          whileTap={prefersReducedMotion ? {} : { scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMobileMenuOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaTimes />
              </motion.div>
            ) : (
              <motion.div
                key="menu"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <FaBars />
              </motion.div>
            )}
          </AnimatePresence>
        </MobileMenuButton>
      </Nav>
    </HeaderContainer>
  );
};

Header.propTypes = {
  onLoginClick: PropTypes.func,
  onSignUpClick: PropTypes.func
};

Header.defaultProps = {
  onLoginClick: () => {},
  onSignUpClick: () => {}
};

export default Header;