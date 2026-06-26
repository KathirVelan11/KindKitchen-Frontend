import React from 'react';
import { AuthProvider } from './src/screens/AuthContext';
import Navigation from './src/screens/Navigation.tsx';

export default function App() {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}
