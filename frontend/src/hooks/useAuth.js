import { createContext, useContext, useState } from 'react';

// Créez un contexte d'authentification
const AuthContext = createContext();

// Fournisseur d'authentification pour encapsuler l'application
export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, user: null });

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte d'authentification
export const useAuth = () => {
  return useContext(AuthContext);
};
