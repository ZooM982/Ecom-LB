const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

// Configuration de Multer
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Dossier de stockage des images
	},
	filename: (req, file, cb) => {
		// Générer un nom unique pour chaque image téléchargée
		cb(null, Date.now() + path.extname(file.originalname));
	},
});

// Créer une instance de multer avec la configuration de stockage
const upload = multer({ storage }).single("image");

// Ajouter un produit
router.post("/", upload, async (req, res) => {
	const { name, price, description, category, sizes, colors, stock } = req.body;

	// Vérifiez si le fichier est fourni
	const image = req.file
		? `https://ecom-lb.onrender.com/uploads/${req.file.filename}`
		: null;

	if (!image) {
		return res.status(400).json({ message: "L'image est obligatoire." });
	}

	try {
		// Convertir les tailles et couleurs en tableaux si ce ne sont pas déjà des tableaux
		const productSizes = Array.isArray(sizes) ? sizes : sizes.split(",");
		const productColors = Array.isArray(colors) ? colors : colors.split(",");

		// Créer un nouveau produit
		const newProduct = new Product({
			name,
			price,
			description,
			image,
			category,
			sizes: productSizes,
			colors: productColors,
			stock,
		});

		// Sauvegarder le produit dans la base de données
		await newProduct.save();
		res.status(201).json(newProduct);
	} catch (error) {
		console.error("Erreur lors de l'ajout du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de l'ajout du produit." });
	}
});

// Récupérer tous les produits ou filtrer par catégorie
router.get("/", async (req, res) => {
	const { category } = req.query;

	try {
		const products = category
			? await Product.find({ category }) // Filtrer par catégorie
			: await Product.find(); // Tous les produits

		res.json(products);
	} catch (error) {
		console.error("Erreur lors de la récupération des produits :", error);
		res.status(500).json({
			message: "Erreur serveur lors de la récupération des produits.",
		});
	}
});

// Récupérer un produit par ID
router.get("/:id", async (req, res) => {
	try {
		const product = await Product.findById(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé." });
		}

		res.json(product);
	} catch (error) {
		console.error("Erreur lors de la récupération du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la récupération du produit." });
	}
});

// Supprimer un produit
router.delete("/:id", async (req, res) => {
	try {
		const product = await Product.findByIdAndDelete(req.params.id);

		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé." });
		}

		res.status(200).json({ message: "Produit supprimé avec succès." });
	} catch (error) {
		console.error("Erreur lors de la suppression du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la suppression du produit." });
	}
});

// Route PUT pour mettre à jour un produit
router.put("/:id", upload, async (req, res) => {
	const { id } = req.params;
	const { name, category, description, price, stock, sizes, colors } = req.body;

	try {
		// Recherche du produit dans la base de données
		const product = await Product.findById(id);
		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé" });
		}

		// Mise à jour des champs du produit, en gardant les valeurs existantes si non modifiées
		if (name) product.name = name;
		if (category) product.category = category;
		if (description) product.description = description;
		if (price) product.price = price;
		if (stock) product.stock = stock;

		// Validation et mise à jour des tailles et couleurs
		if (sizes) {
			const productSizes = sizes.trim() ? sizes.split(",") : [];
			if (productSizes.length === 0) {
				return res
					.status(400)
					.json({ message: "La liste des tailles ne peut pas être vide!" });
			}
			product.sizes = productSizes;
		}

		if (colors) {
			const productColors = colors.trim() ? colors.split(",") : [];
			if (productColors.length === 0) {
				return res
					.status(400)
					.json({ message: "La liste des couleurs ne peut pas être vide!" });
			}
			product.colors = productColors;
		}

		// Gestion de l'image : mettre à jour l'image si elle est envoyée
		if (req.file) {
			product.image = `https://ecom-lb.onrender.com/uploads/${req.file.filename}`;
		}

		// Sauvegarde du produit mis à jour
		await product.save();

		// Retourner le produit mis à jour
		res.status(200).json(product);
	} catch (error) {
		console.error("Erreur lors de la mise à jour du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la mise à jour du produit." });
	}
});

module.exports = router;
