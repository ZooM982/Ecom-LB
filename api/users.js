import dbConnect from '../utils/dbConnect'; // Pour la connexion à la base de données
import User from '../models/User'; // Modèle Mongoose
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  await dbConnect(); // Connectez-vous à la base de données

  switch (req.method) {
    case 'GET':
      try {
        const users = await User.find(); // Récupérer tous les utilisateurs
        res.status(200).json(users);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      const { name, email, password } = req.body;

      try {
        // Créer un nouvel utilisateur
        const newUser = new User({ name, email, password });
        await newUser.save();
        res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      break;

    case 'DELETE':
      // Si vous souhaitez gérer la suppression d'un utilisateur, ajoutez ici la logique
      res.status(405).json({ message: 'Méthode non autorisée' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
