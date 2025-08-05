// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock framer-motion for testing
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
    section: 'section',
    header: 'header',
    footer: 'footer',
    button: 'button',
    a: 'a',
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    p: 'p',
    ul: 'ul',
    li: 'li',
    canvas: 'canvas'
  },
  AnimatePresence: ({ children }) => children,
  useScroll: () => ({ scrollY: { get: () => 0 } }),
  useTransform: () => 0,
  useInView: () => true,
  useAnimation: () => ({ start: jest.fn(), stop: jest.fn() })
}));

// Mock styled-components for testing
jest.mock('styled-components', () => ({
  default: (component) => (props) => component,
  ThemeProvider: ({ children }) => children,
  createGlobalStyle: () => () => null
}));

// Mock intersection observer
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() {
    return null;
  }
  disconnect() {
    return null;
  }
  unobserve() {
    return null;
  }
};

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock scrollTo
Object.defineProperty(window, 'scrollTo', {
  writable: true,
  value: jest.fn()
});

// Mock canvas for particle system
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  clearRect: jest.fn(),
  fillStyle: '',
  globalAlpha: 1,
  fillRect: jest.fn(),
  beginPath: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn()
}));

// Setup console warnings for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});