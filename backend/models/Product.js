const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0 
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true, 
  },
  additionalImages: {
    type: [String], 
    default: [], 
  },
  sizes: {
    type: [String], 
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0; 
      },
      message: props => `${props.value} ne contient aucune taille valide!`
    }
  },
  colors: {
    type: [String], 
    required: true,
    validate: {
      validator: function(v) {
        return v.length > 0; 
      },
      message: props => `${props.value} ne contient aucune couleur valide!`
    }
  },
  category: {
    type: String,
    enum: ['Men', 'Women', 'Kids', 'Accessories', 'Sale'],
    required: true,
  },
  stock: {
    type: Number,
    default: 0, 
  },
}, {
  timestamps: true, 
});

module.exports = mongoose.model('Product', productSchema);
