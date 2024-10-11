// src/context/AuthContext.js
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  const onLogin = (token, user) => {
    setAuth({ token, user });
    localStorage.setItem('token', token); // Optionnel: stockez le token dans localStorage
  };

  const onLogout = () => {
    setAuth({ token: null, user: null });
    localStorage.removeItem('token'); // Optionnel: supprimer le token du localStorage
  };

  return (
    <AuthContext.Provider value={{ auth, onLogin, onLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
