const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Schéma utilisateur 
const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true // Assurez-vous que le username est unique
  },
  email: { 
    type: String, 
    required: true, 
    unique: true, 
    match: [/.+@.+\..+/, 'Veuillez entrer un email valide.'] // Validation de l'email
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'], 
    default: 'user' 
  }
});

// Hachage du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next(); // Si le mot de passe n'est pas modifié, continuer
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt); // Hacher le mot de passe
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe lors de la connexion
userSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
