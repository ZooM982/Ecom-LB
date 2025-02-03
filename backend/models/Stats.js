const mongoose = require('mongoose');

const productViewSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  viewedAt: { type: Date, default: Date.now },
});

const productPurchaseSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  quantity: { type: Number, required: true },
  purchasedAt: { type: Date, default: Date.now },
});

const siteVisitSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  visitedAt: { type: Date, default: Date.now },
  page: { type: String, required: true },
});

const ProductView = mongoose.model('ProductView', productViewSchema);
const ProductPurchase = mongoose.model('ProductPurchase', productPurchaseSchema);
const SiteVisit = mongoose.model('SiteVisit', siteVisitSchema);

module.exports = { ProductView, ProductPurchase, SiteVisit };

