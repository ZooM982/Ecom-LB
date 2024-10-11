const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
const { auth, isAdmin } = require('../middleware/auth'); // Import du middleware

// Récupérer tous les utilisateurs (accessible seulement aux administrateurs)
router.get('/', async (req, res) => {
  try {
    const users = await User.find(); // Remplace par la logique souhaitée
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour ajouter un nouvel utilisateur (utilisateurs classiques)
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Créer un nouvel utilisateur avec le rôle par défaut 'user'
    const newUser = new User({ name: username, email, password, role: 'user' });
    await newUser.save();
    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});


//Route pour creer un admin
router.post('/create-admin-temp', async (req, res) => {
  const { name, email, password, username } = req.body; // Assurez-vous d'inclure username

  if (!username) {
    return res.status(400).json({ message: 'Le nom d\'utilisateur est requis.' });
  }

  try {
    // Vérifiez si un utilisateur avec le même username existe déjà
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'Le nom d\'utilisateur est déjà pris.' });
    }

    // Créer un nouvel utilisateur avec le rôle 'admin'
    const newAdmin = new User({ name, email, password, username, role: 'admin' });
    await newAdmin.save();
    res.status(201).json({ message: 'Administrateur temporaire créé avec succès', user: newAdmin });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});



// Route pour la connexion des utilisateurs
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ email: username }); // On utilise email pour la connexion
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Mot de passe incorrect' });
    }

    // Générer un token JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Renvoie le token et les informations de l'utilisateur
    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});



// Supprimer un utilisateur (accessible seulement aux administrateurs)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json({ message: 'Utilisateur supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
