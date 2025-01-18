const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");
const router = express.Router();

// Multer configuration
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

const upload = multer({ storage });

// Add a new product
router.post("/", upload.single("image"), async (req, res) => {
	const { name, price, description, category, sizes, colors, stock } = req.body;
	const image = req.file ? req.file.filename : null;

	try {
		const newProduct = new Product({
			name,
			price,
			description,
			image,
			category,
			sizes: sizes.split(","),
			colors: colors.split(","),
			stock,
		});
		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
});

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
