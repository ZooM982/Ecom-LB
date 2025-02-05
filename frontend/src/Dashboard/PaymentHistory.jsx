import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    axios.get('https://haurly-shop.onrender.com/api/payment')
      .then(response => setPayments(response.data))
      .catch(error => console.error("Erreur", error));
  }, []);

  return (
    <div>
      <h2>Historique des paiements</h2>
      {payments.map((p) => (
        <p key={p._id}>Commande #{p.orderId} - {p.amount} FCFA - {p.status}</p>
      ))}
    </div>
  );
};

export default PaymentHistory;
