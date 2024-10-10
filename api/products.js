import dbConnect from '../utils/dbConnect'; // Pour la connexion à la base de données
import Product from '../models/Product'; // Modèle Mongoose

export default async function handler(req, res) {
  await dbConnect(); // Connectez-vous à la base de données

  switch (req.method) {
    case 'GET':
      const { category } = req.query; // Récupérer la catégorie depuis les paramètres de requête
      try {
        const products = category
          ? await Product.find({ category }) // Filtrer par catégorie
          : await Product.find(); // Sinon, retourner tous les produits
        res.status(200).json(products);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
      break;

    case 'POST':
      const { name, price, description, image, category: newCategory } = req.body;

      // Validation basique
      if (!name || !price || !description || !image || !newCategory) {
        return res.status(400).json({ message: 'Tous les champs sont requis.' });
      }

      try {
        const newProduct = new Product({
          name,
          price,
          description,
          image,
          category: newCategory,
        });
        await newProduct.save();
        res.status(201).json(newProduct);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
      break;

    case 'DELETE':
      // Gestion de la suppression si vous le souhaitez, sinon vous pouvez ignorer cette méthode
      res.status(405).json({ message: 'Méthode non autorisée' });
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Méthode ${req.method} non autorisée`);
  }
}
