// src/components/CartModal.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const CartModal = ({ isOpen, onRequestClose, cartItems, clearCart }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleCheckout = () => {
    if (!token) {
      alert('Veuillez vous connecter pour procéder au paiement.');
      navigate('/login');
    } else {
      alert('Procéder au paiement directement...');
    }
  };

  const handleWhatsApp = () => {
    if (cartItems.length === 0) {
      alert('Votre panier est vide, rien à envoyer.');
      return;
    }
    
    // Formater le contenu du panier
    const message = cartItems.map(item => `${item.name} (x${item.quantity}): ${item.price * item.quantity} FCFA`).join('\n');
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    
    // Ouvrir WhatsApp
    window.open(whatsappUrl, '_blank');

    // Effacer le contenu du panier
    clearCart();
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
                  <img className='w-[30px] h-[30px] md:w-[50px] md:h-[50px]' src={item.image} alt={item.name} />
                  <span>{item.name} (x{item.quantity})</span>
                  <span>{item.price * item.quantity} FCFA</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex justify-between mt-4">
            <button 
              onClick={onRequestClose} 
              className="bg-gray-200 px-4 py-2 rounded"
              aria-label="Fermer le panier"
            >
              Fermer
            </button>
            <div className="flex space-x-2">
              <button 
                onClick={handleCheckout} 
                className="bg-blue-600 text-white px-4 py-2 rounded"
                aria-label="Procéder au paiement"
              >
                Payer
              </button>
              <button 
                onClick={handleWhatsApp} 
                className="bg-green-600 text-white px-4 py-2 rounded"
                aria-label="Envoyer par WhatsApp"
              >
                WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    ) : null
  );
};

export default CartModal;
