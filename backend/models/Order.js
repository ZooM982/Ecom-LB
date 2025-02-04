const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // ID de l'utilisateur
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['card', 'paypal', 'bank_transfer', 'cash'], required: true }, // Moyen de paiement
  paymentStatus: { type: String, enum: ['paid', 'pending', 'failed'], default: 'pending' }, // Statut du paiement
  shippingAddress: { // Adresse de livraison
    street: String,
    city: String,
    zipCode: String,
    country: String,
  },
  status: { type: String, enum: ['completed', 'pending', 'abandoned'], default: 'pending' }, // État de la commande
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);
