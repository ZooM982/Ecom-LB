/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import './App.css';
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
import { AuthProvider, useAuth } from './context/AuthContext'

// Fonction pour récupérer le token du localStorage
const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token || token === 'undefined') {
    return null;
  }
  try {
    return JSON.parse(token);
  } catch (error) {
    console.error('Erreur de parsing du token:', error);
    return null;
  }
};

const RequireAdminAuth = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user || !user.role || user.role !== 'admin') {
    return <Navigate to="/login" />;
  }

  return children;
};

function App() {
  const [cartItems, setCartItems] = useState(() => {
    const savedItems = localStorage.getItem('cartItems');
    return savedItems ? JSON.parse(savedItems) : [];
  });
  const [isCartOpen, setCartOpen] = useState(false);
  
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find(cartItem => cartItem.id === item.id);

      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      return [...prevItems, item];
    });
    
    // Sauvegarder les articles dans le localStorage
    localStorage.setItem('cartItems', JSON.stringify([...cartItems, item]));
  };

  const toggleCart = () => {
    setCartOpen(!isCartOpen);
  };

  const clearCart = () => {
    setCartItems([]); // Réinitialise le panier
    localStorage.removeItem('cartItems'); // Efface le localStorage
  };

  return (
    <AuthProvider>
      <div className=''>
        <Router>
          <AppContent
            addToCart={addToCart}
            toggleCart={toggleCart}
            isCartOpen={isCartOpen}
            cartItems={cartItems}
            clearCart={clearCart} // Passer la fonction clearCart
          />
        </Router>
      </div>
    </AuthProvider>
  );
}

const AppContent = ({ addToCart, toggleCart, isCartOpen, cartItems, clearCart }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const { setAuth } = useAuth();

  const handleLogin = (token, user) => {
    localStorage.setItem('token', JSON.stringify(token));
    localStorage.setItem('user', JSON.stringify(user));
    setAuth({ token, user });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuth({ token: null, user: null });
  };

  return (
    <div className="App">
      <Butterflies />
      {!isAuthPage && <Header toggleCart={toggleCart} cartItems={cartItems} onLogout={handleLogout} />}
      {location.pathname === '/' && <Hero />}
      <Routes>
        <Route path="/" element={<Products addToCart={addToCart} />} />
        <Route path="/men" element={<Men />} />
        <Route path="/women" element={<Women />} />
        <Route path="/kids" element={<Kids />} />
        <Route path="/accessories" element={<Accessories />} />
        <Route path="/sale" element={<Sale />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="/dashboard/*" element={
          <RequireAdminAuth>
            <Dashboard />
          </RequireAdminAuth>
        } />
        <Route path="/products/:id" element={<ProductDetails />} />
      </Routes>
      <Footer />
      <CartModal isOpen={isCartOpen} onRequestClose={toggleCart} cartItems={cartItems} clearCart={clearCart} /> {/* Passer clearCart ici */}
    </div>
  );
};

export default App;
