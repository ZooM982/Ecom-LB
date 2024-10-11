// src/components/CartModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ isOpen, onRequestClose, cartItems }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCheckout = () => {
    if (!token) {
      navigate('/login');
    } else {
      // Logique de paiement ici (peut-être ouvrir un formulaire de paiement)
      alert('Procéder au paiement directement...');
    }
  };

  const handleWhatsApp = () => {
    // Formater le contenu du panier
    const message = cartItems.map(item => `${item.name}: ${item.price} FCFA`).join('\n');
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '+221785975058');
  };

  return (
    isOpen ? (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-lg p-4 w-96">
          <h2 className="text-lg font-bold mb-4">Votre Panier</h2>
          {cartItems.length === 0 ? (
            <p>Votre panier est vide.</p>
          ) : (
            <ul>
              {cartItems.map((item, index) => (
                <li key={index} className="flex justify-between mb-2">
                  <span>{item.name}</span>
                  <span>{item.price} €</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4">
            <button onClick={onRequestClose} className="bg-gray-200 px-4 py-2 rounded">Fermer</button>
            <div className="flex space-x-2">
              <button onClick={handleCheckout} className="bg-blue-600 text-white px-4 py-2 rounded">Payer</button>
              <button onClick={handleWhatsApp} className="bg-green-600 text-white px-4 py-2 rounded">WhatsApp</button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default CartModal;
