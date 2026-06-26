// AuthContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

type AuthContextType = {
  userId: string | null;
  setUserId: (id: string | null) => void;
};

const AuthContext = createContext<AuthContextType>({
  userId: null,
  setUserId: () => {}, // provide default no-op function
});

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  console.log('AuthProvider rendering, userId:', userId); // Add this for debugging

  return (
    <AuthContext.Provider value={{ userId, setUserId }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    console.error('useAuth must be used within an AuthProvider');
    // Provide fallback instead of throwing error
    return { userId: null, setUserId: () => {} };
  }
  return context;
};