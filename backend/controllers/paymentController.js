require('dotenv').config();
const axios = require('axios');
const Payment = require('../models/Payment');  // Make sure you have the Payment model defined
const twilio = require('twilio');

// API keys and URLs
const PAYDUNYA_BASE_URL = 'https://app.paydunya.com/api/v1/checkout-invoice';
const API_KEYS = {
  'PAYDUNYA-PUBLIC-KEY': process.env.PAYDUNYA_PUBLIC_KEY,
  'PAYDUNYA-PRIVATE-KEY': process.env.PAYDUNYA_PRIVATE_KEY,
  'PAYDUNYA-TOKEN': process.env.PAYDUNYA_TOKEN,
  'PAYDUNYA-MASTER-KEY': process.env.PAYDUNYA_MASTER_KEY,
};

// Create a payment
exports.createPayment = async (req, res) => {
  try {
    const { amount, name, email, orderId } = req.body;

    // Check required fields
    if (!amount || !name || !email || !orderId) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Call PayDunya API to create the payment
    const response = await axios.post(
      `${PAYDUNYA_BASE_URL}/create`,
      {
        invoice: { total_amount: amount, description: `Order #${orderId}` },
        customer: { name, email },
        actions: {
          return_url: `${process.env.BASE_FRONTEND_URL}/payment-success`,
          callback_url: `${process.env.BASE_BACKEND_URL}/api/payment/callback`,
        },
      },
      { headers: API_KEYS }
    );

    // Check for errors in response
    if (!response.data || !response.data.token) {
      return res.status(500).json({ message: 'Error creating payment with PayDunya' });
    }

    // Save payment info to database
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
    res.status(500).json({ message: 'Error creating payment', error: error.message });
  }
};

// Send WhatsApp message via Twilio
const sendWhatsAppMessage = async (payment) => {
  const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

  const message = `✅ Payment Successful!\n\nOrder #${payment.orderId}\nAmount: ${payment.amount} FCFA\nCustomer: ${payment.customerName}\nEmail: ${payment.customerEmail}\nStatus: ${payment.status}`;

  try {
    await client.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,
      to: process.env.MON_NUMERO_WHATSAPP,
      body: message,
    });
    console.log('WhatsApp message sent!');
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
  }
};

// Payment status callback from PayDunya
exports.paymentCallback = async (req, res) => {
  try {
    const { token, status } = req.body;

    // Validate token in the request body
    if (!token) {
      return res.status(400).json({ message: 'Token is missing in the request' });
    }

    // Find payment by PayDunya token
    const payment = await Payment.findOne({ paydunyaToken: token });

    if (!payment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    // Update payment status based on the callback status
    payment.status = status === 'completed' ? 'successful' : 'failed';
    await payment.save();

    // Send WhatsApp notification if payment is successful
    if (payment.status === 'successful') {
      await sendWhatsAppMessage(payment);
    }

    res.json({ message: 'Status updated and WhatsApp sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in webhook', error: error.message });
  }
};

// Get all payments
exports.getPayments = async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving payments', error: error.message });
  }
};
