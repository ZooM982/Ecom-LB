const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const router = express.Router();

// Configuration de multer pour l'upload des fichiers
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Dossier où les fichiers seront enregistrés
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname)); // Renommer le fichier pour éviter les collisions
	},
});

const upload = multer({ storage: storage });

// Route pour récupérer tous les produits ou par catégorie
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

// Route pour ajouter un nouveau produit
router.post("/", upload.array("additionalImages"), async (req, res) => {
	const { name, price, description, image, category, sizes, colors, stock } =
		req.body;

	// Validation des champs
	if (!name || !price || !description || !image || !category) {
		return res.status(400).json({ message: "Tous les champs sont requis." });
	}

	try {
		// Sauvegarder les fichiers supplémentaires
		const additionalImages = req.files.map((file) => file.filename);

		// Créer un nouveau produit
		const newProduct = new Product({
			name,
			price,
			description,
			image, // Assurez-vous que l'image principale est correctement envoyée
			category,
			additionalImages, // Les fichiers supplémentaires
			sizes,
			colors,
			stock,
		});

		// Sauvegarder le produit dans la base de données
		await newProduct.save();

		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

// Route pour supprimer un produit par ID
router.delete("/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé" });
		}
		res.status(200).json({ message: "Produit supprimé avec succès" });
	} catch (error) {
		res.status(500).json({ message: "Erreur serveur", error });
	}
});

module.exports = router;
