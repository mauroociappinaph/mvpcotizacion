// Learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Mock global fetch
global.fetch = jest.fn();

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    clear: jest.fn(),
  },
  writable: true,
});

// Mock window.location
delete window.location;
window.location = {
  href: "",
  pathname: "",
};

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllMocks();
});
