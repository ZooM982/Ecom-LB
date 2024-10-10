const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0 // S'assurer que le prix ne peut pas être négatif
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
    validate: {
      validator: function(v) {
        return v.length > 0; // S'assurer qu'il y a au moins une taille
      },
      message: props => `${props.value} ne contient aucune taille valide!`
    }
  },
  colors: {
    type: [String], // Un tableau pour les couleurs disponibles
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0; // S'assurer qu'il y a au moins une couleur
      },
      message: props => `${props.value} ne contient aucune couleur valide!`
    }
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Sale'], // Définir les catégories possibles
    required: true,
  },
  stock: {
    type: Number,
    default: 0, // Par défaut, le stock est de 0
  },
}, {
  timestamps: true, // Ajoute automatiquement createdAt et updatedAt
});

module.exports = mongoose.model('Product', productSchema);
