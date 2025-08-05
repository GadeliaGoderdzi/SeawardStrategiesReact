import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Header from './Header';
import { MemoryRouter } from 'react-router-dom';

// Language: JavaScript

// Mock hooks used in Header.jsx
jest.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    logout: jest.fn(),
  }),
}));

jest.mock('../../hooks/useHeaderAnimation', () => ({
  useHeaderAnimation: () => ({
    isHeaderVisible: true,
    isScrolled: false,
  }),
}));

jest.mock('../../hooks/useReducedMotion', () => ({
  useReducedMotion: () => false,
}));

// Create a mock for useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

describe('Header - handleNavClick', () => {
  const originalScrollTo = window.scrollTo;

  beforeEach(() => {
    // Reset mocks before each test
    mockedNavigate.mockReset();
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    window.scrollTo = originalScrollTo;
  });

  test('should call navigate when isRoute is true (e.g., Home link)', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // "Home" is a route link with href "/" 
    const homeLink = screen.getByText('Home');
    fireEvent.click(homeLink);

    expect(mockedNavigate).toHaveBeenCalledWith('/');
    expect(window.scrollTo).not.toHaveBeenCalled();
  });

  test('should perform smooth scroll when isRoute is false (e.g., About link)', () => {
    // Prepare fake element for document.querySelector
    const fakeElement = { offsetTop: 500 };
    document.querySelector = jest.fn().mockReturnValue(fakeElement);

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    // "About" is a non-route link with href "#about"
    const aboutLink = screen.getByText('About');
    fireEvent.click(aboutLink);

    // headerHeight is 80, additionalOffset for "#about" is -320
    // expected top = fakeElement.offsetTop - 80 - (-320) = 500 - 80 + 320 = 740
    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 740,
      behavior: 'smooth',
    });
    // Also, navigate should not be called
    expect(mockedNavigate).not.toHaveBeenCalled();
  });
});

/*
We recommend installing an extension to run jest tests.
*/