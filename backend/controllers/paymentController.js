require('dotenv').config();
const axios = require('axios');
const Payment = require('../models/Payment');
const twilio = require('twilio');

const PAYDUNYA_BASE_URL = 'https://app.paydunya.com/api/v1/checkout-invoice';
const API_KEYS = {
  'PAYDUNYA-PUBLIC-KEY': process.env.PAYDUNYA_PUBLIC_KEY,
  'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
  'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN,
  'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
};

exports.createPayment = async (req, res) => {
  try {
    const { amount, name, email, orderId } = req.body;

    // Vérification des champs
    if (!amount || !name || !email || !orderId) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const response = await axios.post(
      `${PAYDUNYA_BASE_URL}/create`,
      {
        invoice: { total_amount: amount, description: `Commande #${orderId}` },
        customer: { name, email },
        actions: {
          return_url: `${process.env.BASE_FRONTEND_URL}/payment-success`,
          callback_url: `${process.env.BASE_BACKEND_URL}/api/payment/callback`,
        },
      },
      { headers: API_KEYS }
    );

    if (!response.data || !response.data.token) {
      return res.status(500).json({ message: 'Erreur de création de paiement avec PayDunya' });
    }

    const payment = new Payment({
      orderId,
      customerName: name,
      customerEmail: email,
      amount,
      paydunyaToken: response.data.token,
    });

    await payment.save();

    res.json({ payment_url: response.data.response_text });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création du paiement', error: error.message });
  }
};

const sendWhatsAppMessage = async (payment) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  const message = `✅ Paiement Réussi !\n\nCommande #${payment.orderId}\nMontant: ${payment.amount} FCFA\nClient: ${payment.customerName}\nEmail: ${payment.customerEmail}\nStatut: ${payment.status}`;

  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886', // Numéro Twilio
      to: `whatsapp:+221785975058`,  // Ton numéro WhatsApp
      body: message,
    });
    console.log('Message WhatsApp envoyé !');
  } catch (error) {
    console.error('Erreur envoi WhatsApp:', error);
  }
};

exports.paymentCallback = async (req, res) => {
  try {
    const { token, status } = req.body;

    // Vérifier si le token est bien présent dans le corps de la requête
    if (!token) {
      return res.status(400).json({ message: 'Token manquant dans la requête' });
    }

    const payment = await Payment.findOne({ paydunyaToken: token });

    if (!payment) {
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    payment.status = status === 'completed' ? 'successful' : 'failed';
    await payment.save();

    if (payment.status === 'successful') {
      await sendWhatsAppMessage(payment);
    }

    res.json({ message: 'Statut mis à jour et WhatsApp envoyé' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur webhook', error: error.message });
  }
};

exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des paiements', error: error.message });
  }
};
