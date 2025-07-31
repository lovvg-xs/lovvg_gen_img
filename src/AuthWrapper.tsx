import React, { useState } from 'react';
import App from './App';
import LoginScreen from './LoginScreen';

const AuthWrapper: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check local storage for the authentication flag
    try {
      return window.localStorage.getItem('is-authenticated') === 'true';
    } catch (error) {
      console.error("Could not access local storage:", error);
      return false;
    }
  });

  const handleLoginSuccess = () => {
    try {
      window.localStorage.setItem('is-authenticated', 'true');
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Could not set item in local storage:", error);
      // Still allow login for this session if storage fails
      setIsAuthenticated(true);
    }
  };

  if (isAuthenticated) {
    return <App />;
  }

  return <LoginScreen onSuccess={handleLoginSuccess} />;
};

export default AuthWrapper;
