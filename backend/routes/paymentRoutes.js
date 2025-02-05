const express = require('express');
const { createPayment, paymentCallback, getPayments } = require('../controllers/paymentController');

const router = express.Router();

// Route pour créer un paiement
router.post('/', createPayment);

// Route de callback PayDunya
router.post('/callback', paymentCallback);

// Route pour récupérer tous les paiements
router.get('/', getPayments);

module.exports = router;
