const express = require("express");
const multer = require("multer");
const path = require("path");
const Product = require("../models/Product");

const router = express.Router();

// Configuration de Multer pour le stockage des fichiers
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/"); // Chemin où les fichiers seront sauvegardés
	},
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${file.originalname}`);
	},
});

// Instance multer pour gérer les fichiers
const upload = multer({ storage });

// Ajouter un produit
router.post(
	"/",
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "additionalImages", maxCount: 10 },
	]),
	async (req, res) => {
		try {
			const { name, price, description, category, sizes, colors, stock } =
				req.body;

			// Gérer l'image principale
			const image = req.files?.image
				? `https://ecom-lb.onrender.com/uploads/${req.files.image[0].filename}`
				: null;

			if (!image) {
				return res
					.status(400)
					.json({ message: "L'image principale est requise." });
			}

			// Gérer les images supplémentaires
			const additionalImages = req.files?.additionalImages
				? req.files.additionalImages.map(
						(file) => `https://ecom-lb.onrender.com/uploads/${file.filename}`
				  )
				: [];

			// Convertir les tailles et couleurs en tableaux
			const productSizes = sizes
				? sizes.split(",").map((size) => size.trim())
				: [];
			const productColors = colors
				? colors.split(",").map((color) => color.trim())
				: [];

			const newProduct = new Product({
				name,
				price,
				description,
				category,
				image,
				sizes: productSizes,
				colors: productColors,
				stock,
				additionalImages,
			});

			await newProduct.save();
			res.status(201).json(newProduct);
		} catch (error) {
			console.error("Erreur lors de l'ajout du produit :", error);
			res
				.status(500)
				.json({ message: "Erreur serveur lors de l'ajout du produit." });
		}
	}
);

// Récupérer tous les produits
router.get("/", async (req, res) => {
	const { category } = req.query;
	try {
		const products = category
			? await Product.find({ category })
			: await Product.find();

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

// Mettre à jour un produit
router.put(
	"/:id",
	upload.fields([
		{ name: "image", maxCount: 1 },
		{ name: "additionalImages", maxCount: 10 },
	]),
	async (req, res) => {
		const { id } = req.params;
		const { name, price, description, category, sizes, colors, stock } =
			req.body;

		try {
			const product = await Product.findById(id);
			if (!product) {
				return res.status(404).json({ message: "Produit non trouvé." });
			}

			// Mise à jour des champs
			product.name = name || product.name;
			product.price = price || product.price;
			product.description = description || product.description;
			product.category = category || product.category;
			product.stock = stock || product.stock;

			if (sizes) {
				product.sizes = sizes.split(",").map((size) => size.trim());
			}
			if (colors) {
				product.colors = colors.split(",").map((color) => color.trim());
			}

			// Gérer l'image principale
			if (req.files?.image) {
				product.image = `https://ecom-lb.onrender.com/uploads/${req.files.image[0].filename}`;
			}

			// Ajouter les nouvelles images supplémentaires
			if (req.files?.additionalImages) {
				const additionalImages = req.files.additionalImages.map(
					(file) => `https://ecom-lb.onrender.com/uploads/${file.filename}`
				);
				product.additionalImages.push(...additionalImages);
			}

			await product.save();
			res.status(200).json(product);
		} catch (error) {
			console.error("Erreur lors de la mise à jour du produit :", error);
			res
				.status(500)
				.json({ message: "Erreur serveur lors de la mise à jour du produit." });
		}
	}
);

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

module.exports = router;
