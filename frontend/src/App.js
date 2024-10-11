/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './App.css'
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Header from './components/Header';
import Hero from './components/Hero';
import Products from './components/Products';
import Footer from './components/Footer';
import CartModal from './components/CartModal';
import Login from './components/Login'; 
import Register from './components/Register'; 
import Men from './Pages/Men';
import Women from './Pages/Women';
import Accessories from './Pages/Accessories';
import Sale from './Pages/Sale';
import Kids from './Pages/Kids';
import Dashboard from './components/Dashboard';
import ProductDetails from './Pages/ProductDetails';
import Butterflies from './components/butterflies/Butterflies';

// Fonction pour récupérer le token du localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  return token ? JSON.parse(token) : null; // Renvoie null si le token est undefined
};

const RequireAdminAuth = ({ children }) => {
  // Récupère les informations de l'utilisateur depuis localStorage
  const user = JSON.parse(localStorage.getItem('user')); // Supposons que le rôle de l'utilisateur est stocké dans localStorage après la connexion

  // Vérifie si l'utilisateur existe et a le rôle admin
  if (!user || !user.role || user.role !== 'admin') {
    return <Navigate to="/login" />; // Redirection vers la page de connexion si l'utilisateur n'est pas admin ou non connecté
  }

  return children; // Rendre les enfants si l'utilisateur est admin
};

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setCartOpen] = useState(false);

  const addToCart = (item) => {
    setCartItems((prevItems) => [...prevItems, item]);
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  return (
    <div className=''>
      <Router>
        <AppContent
          addToCart={addToCart}
          toggleCart={toggleCart}
          isCartOpen={isCartOpen}
          cartItems={cartItems}
        />
      </Router>
    </div>
  );
}

const AppContent = ({ addToCart, toggleCart, isCartOpen, cartItems }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  return (
    <div className="App">
      <Butterflies />
      {!isAuthPage && <Header toggleCart={toggleCart} />}
      {location.pathname === '/' && <Hero />}
      <Routes>
        <Route path="/" element={<Products addToCart={addToCart} />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Route privée pour le dashboard admin */}
        <Route path="/dashboard/*" element={
          <RequireAdminAuth>
            <Dashboard />
          </RequireAdminAuth>
        } />
         <Route path="/products/:id" element={<ProductDetails />} /> 
      </Routes>
      <Footer />
      <CartModal isOpen={isCartOpen} onRequestClose={toggleCart} cartItems={cartItems} />
    </div>
  );
}

export default App;
