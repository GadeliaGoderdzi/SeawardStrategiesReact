import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const scrollToSection = (sectionId) => {
    if (isHomePage) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    } else {
      // If not on home page, navigate to home first then scroll
      window.location.href = `/#${sectionId}`;
    }
  };

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <nav className="navigation">
      <ul>
        <li><Link to="/">Home</Link></li>
        <li>
          <a 
            href="#services" 
            onClick={(e) => handleNavClick(e, 'services')}
          >
            Services
          </a>
        </li>
        <li>
          <a 
            href="#about" 
            onClick={(e) => handleNavClick(e, 'about')}
          >
            About
          </a>
        </li>
        <li>
          <a 
            href="#contact" 
            onClick={(e) => handleNavClick(e, 'contact')}
          >
            Contact
          </a>
        </li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/dashboard">Dashboard</Link></li>
      </ul>
    </nav>
  );
};

export default Navigation;