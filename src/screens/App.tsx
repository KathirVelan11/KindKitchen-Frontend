// App.tsx
import React from 'react';
import { AuthProvider } from './AuthContext';
import Navigation from './Navigation'; // Your navigation component

function App(): JSX.Element {
  return (
    <AuthProvider>
      <Navigation />
    </AuthProvider>
  );
}

export default App;