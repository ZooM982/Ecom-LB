const express = require("express");
const Product = require("../models/Product");
const auth = require("../middleware/auth");

const router = express.Router();

// Récupérer tous les produits ou par catégorie
router.get("/", async (req, res) => {
  const { category } = req.query; // Récupérer la catégorie depuis les paramètres de requête

  try {
    let products;

    if (category) {
      // Filtrer les produits par catégorie si spécifiée
      products = await Product.find({ category });
    } else {
      // Si aucune catégorie n'est spécifiée, retourner tous les produits
      products = await Product.find();
    }

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour récupérer un produit par ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Ajouter un nouveau produit
router.post("/", async (req, res) => {
  const { name, price, description, image, category } = req.body;

  // Validation basique
  if (!name || !price || !description || !image || !category) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  try {
    const newProduct = new Product({
      name,
      price,
      description,
      image,
      category,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/users/:id", async (req, res) => {
  console.log("ID reçu pour suppression:", req.params.id); // Ajout d'un log pour voir l'ID reçu
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      console.log("Produit non trouvé"); // Ajout d'un log si le produit n'est pas trouvé
      return res.status(404).json({ message: "Produit non trouvé" });
    }
    res.status(200).json({ message: "Produit supprimé avec succès" });
  } catch (error) {
    console.log("Erreur lors de la suppression:", error); // Log en cas d'erreur serveur
    res.status(500).json({ message: "Erreur serveur", error });
  }
});

module.exports = router;
