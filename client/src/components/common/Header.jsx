import React from 'react';
import Navigation from './Navigation';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <h1>Seaward Strategies</h1>
        </div>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;