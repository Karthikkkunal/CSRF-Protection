import axios from 'axios';

// Simulated backend responses
const generateCsrfToken = () => {
  return `csrf-${Math.random().toString(36).substring(2, 15)}`;
};

const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 800));

export const getCsrfToken = async () => {
  await simulateNetworkDelay();
  return generateCsrfToken();
};

export const performProtectedAction = async (csrfToken: string) => {
  await simulateNetworkDelay();
  
  // Simulate CSRF token validation
  if (!csrfToken || csrfToken.length < 10) {
    throw new Error('Invalid CSRF token');
  }

  return {
    data: {
      message: 'Protected action successful! Token validated.',
      timestamp: new Date().toISOString()
    }
  };
};

export const performUnprotectedAction = async () => {
  await simulateNetworkDelay();
  return {
    data: {
      message: 'Unprotected action completed (vulnerable to CSRF)',
      timestamp: new Date().toISOString()
    }
  };
};