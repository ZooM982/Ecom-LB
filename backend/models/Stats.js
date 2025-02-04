const mongoose = require('mongoose');

// Modèle pour le suivi des visites de produits
const productViewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
}, { timestamps: true });

// Modèle pour le suivi des achats
const productPurchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true, min: 0 },
}, { timestamps: true });

// Modèle pour le suivi des visites du site
const siteVisitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null, index: true },
  page: { type: String, required: true },
}, { timestamps: true });

// Création des modèles
const ProductView = mongoose.model('ProductView', productViewSchema);
const ProductPurchase = mongoose.model('ProductPurchase', productPurchaseSchema);
const SiteVisit = mongoose.model('SiteVisit', siteVisitSchema);

module.exports = { ProductView, ProductPurchase, SiteVisit };
