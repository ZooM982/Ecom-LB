const mongoose = require('mongoose');

// Modèle pour le suivi des visites de produits
const productViewSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  createdAt: { type: Date, default: Date.now }
});

// Modèle pour le suivi des achats
const productPurchaseSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  quantity: Number,
  totalPrice: Number,
  createdAt: { type: Date, default: Date.now }
});

// Modèle pour le suivi des visites du site
const siteVisitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  page: String,
  createdAt: { type: Date, default: Date.now }
});

const ProductView = mongoose.model('ProductView', productViewSchema);
const ProductPurchase = mongoose.model('ProductPurchase', productPurchaseSchema);
const SiteVisit = mongoose.model('SiteVisit', siteVisitSchema);

module.exports = { ProductView, ProductPurchase, SiteVisit };
