// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import LoginButton from '../buttons/loginButton';
import CartIcon from '../components/CartIcon'; // Importer le composant CartIcon
import { useAuth } from '../context/AuthContext';

const Header = ({ toggleCart, cartItems }) => {
  const { isAuthenticated, logout } = useAuth(); // Utiliser le hook pour obtenir l'état d'authentification et la fonction de déconnexion

  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto md:flex justify-between items-center text-center">
        <div className="text-lg font-bold">
          <Link to="/">Logo</Link>
        </div>
        <div>
          <Link to="/" className="mx-[5px]">Home</Link>
          <Link to="/men" className="mx-[5px]">Men</Link>
          <Link to="/women" className="mx-[5px]">Women</Link>
          <Link to="/kids" className="mx-[5px]">Kids</Link>
          <Link to="/accessories" className="mx-[5px]">Accessories</Link>
          <Link to="/sale" className="mx-[5px]">Sale</Link>
        </div>
        <div className='flex justify-between md:w-[80px] text-[25px] text-white me-[10px]'>
          <button onClick={toggleCart} aria-label="Ouvrir le panier">
            <span>
              <CartIcon cartItems={cartItems} /> {/* Afficher le CartIcon */}
            </span>
          </button>
          <LoginButton 
            isAuthenticated={isAuthenticated} 
            onLogout={logout} // Utiliser la fonction de déconnexion du hook
          />
        </div>
      </nav>
    </header>
  );
};

export default Header;
