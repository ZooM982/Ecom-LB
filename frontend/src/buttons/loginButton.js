import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CiLogin } from "react-icons/ci";
import { useAuth } from '../context/AuthContext';


const LoginButton = () => {
  const navigate = useNavigate();
  const { user, onLogout } = useAuth(); // Récupérer l'utilisateur et la fonction de déconnexion depuis le contexte

  const handleLogout = () => {
    onLogout(); // Appelle la fonction de déconnexion depuis le contexte
    navigate('/'); // Redirige l'utilisateur vers la page d'accueil après déconnexion
  };

  return (
    <div>
      {user ? ( // Vérifiez si l'utilisateur est authentifié
        <button onClick={handleLogout} className="flex items-center text-white">
          Déconnexion
        </button>
      ) : (
        <Link to="/login" className="flex items-center text-white">
          <CiLogin />
        </Link>
      )}
    </div>
  );
};

export default LoginButton;
