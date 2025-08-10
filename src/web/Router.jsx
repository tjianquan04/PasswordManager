import React, { useState, useEffect } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import HomePage from './HomePage';
import App from './App';

export default function Router() {
  const [currentRoute, setCurrentRoute] = useState('home');
  const account = useCurrentAccount();

  const navigateToApp = () => {
    setCurrentRoute('app');
  };

  const navigateToHome = () => {
    setCurrentRoute('home');
  };

  // Auto-navigate back to home when wallet is disconnected
  useEffect(() => {
    if (!account && currentRoute === 'app') {
      // Small delay to ensure smooth transition
      const timer = setTimeout(() => {
        setCurrentRoute('home');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [account, currentRoute]);

  if (currentRoute === 'home') {
    return <HomePage onEnterApp={navigateToApp} />;
  }

  if (currentRoute === 'app') {
    return <App onBackToHome={navigateToHome} />;
  }

  // Default fallback
  return <HomePage onEnterApp={navigateToApp} />;
}
