const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, // Image principale du produit
  },
  additionalImages: {
    type: [String], // Un tableau pour les images supplémentaires
    default: [], // Par défaut, c'est un tableau vide
  },
  sizes: {
    type: [String], // Un tableau pour les tailles disponibles
    required: true,
  },
  colors: {
    type: [String], // Un tableau pour les couleurs disponibles
    required: true,
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Sale'], // Définir les catégories possibles
    required: true,
  },
});

module.exports = mongoose.model('Product', productSchema);
