const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const Product = require("../models/Product");

const router = express.Router();

// Configure Multer pour gérer les fichiers en mémoire
const storage = multer.memoryStorage();
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
			console.log("Début du processus d'ajout du produit.");
			const { name, price, description, category, sizes, colors, stock } =
				req.body;

			// Upload de l'image principale sur Cloudinary
			let mainImageUrl = "";
			const imageFile = req.files?.image ? req.files.image[0] : null;
			if (imageFile) {
				console.log("Upload de l'image principale...");
				const result = await new Promise((resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{ resource_type: "auto" },
						(error, result) => {
							if (error) {
								console.error(
									"Erreur lors de l'upload de l'image principale :",
									error
								);
								reject(error);
							} else {
								console.log(
									"Image principale uploadée avec succès :",
									result.secure_url
								);
								resolve(result);
							}
						}
					);
					uploadStream.end(imageFile.buffer);
				});
				mainImageUrl = result.secure_url;
			} else {
				return res
					.status(400)
					.json({ message: "L'image principale est requise." });
			}

			// Upload des images supplémentaires sur Cloudinary
			const additionalImages = [];
			if (req.files?.additionalImages) {
				console.log("Début de l'upload des images supplémentaires...");
				for (let i = 0; i < req.files.additionalImages.length; i++) {
					const file = req.files.additionalImages[i];
					const result = await new Promise((resolve, reject) => {
						const uploadStream = cloudinary.uploader.upload_stream(
							{ resource_type: "auto" },
							(error, result) => {
								if (error) {
									console.error(
										`Erreur lors de l'upload de l'image supplémentaire ${
											i + 1
										} :`,
										error
									);
									reject(error);
								} else {
									console.log(
										`Image supplémentaire ${i + 1} uploadée avec succès :`,
										result.secure_url
									);
									resolve(result);
								}
							}
						);
						uploadStream.end(file.buffer);
					});
					additionalImages.push(result.secure_url);
				}
				console.log("Toutes les images supplémentaires ont été uploadées.");
			}

			// Conversion des tailles et couleurs en tableaux
			const productSizes = sizes
				? sizes.split(",").map((size) => size.trim())
				: [];
			const productColors = colors
				? colors.split(",").map((color) => color.trim())
				: [];

			// Création du produit
			const newProduct = new Product({
				name,
				price,
				description,
				category,
				image: mainImageUrl, // URL de l'image principale sur Cloudinary
				sizes: productSizes,
				colors: productColors,
				stock,
				additionalImages,
			});

			await newProduct.save();
			console.log("Produit ajouté avec succès :", newProduct);
			res.status(201).json(newProduct);
		} catch (error) {
			console.error("Erreur lors de l'ajout du produit :", error);
			res
				.status(500)
				.json({ message: "Erreur serveur lors de l'ajout du produit.", error });
		}
	}
);

// Récupérer tous les produits
router.get("/", async (req, res) => {
	const { category } = req.query;
	try {
		console.log("Récupération des produits...");
		const products = category
			? await Product.find({ category })
			: await Product.find();
		console.log("Produits récupérés avec succès :", products);
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
		console.log(`Récupération du produit avec l'ID : ${req.params.id}`);
		const product = await Product.findById(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé." });
		}
		console.log("Produit récupéré avec succès :", product);
		res.json(product);
	} catch (error) {
		console.error("Erreur lors de la récupération du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la récupération du produit." });
	}
});

// Modifier un produit
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
			console.log(`Mise à jour du produit avec l'ID : ${id}`);
			const product = await Product.findById(id);
			if (!product) {
				return res.status(404).json({ message: "Produit non trouvé." });
			}

			// Mise à jour des champs principaux
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

			// Mise à jour de l'image principale
			if (req.files?.image) {
				console.log("Mise à jour de l'image principale...");
				const imageFile = req.files.image[0];
				const result = await new Promise((resolve, reject) => {
					const uploadStream = cloudinary.uploader.upload_stream(
						{ resource_type: "auto" },
						(error, result) => {
							if (error) {
								console.error(
									"Erreur lors de l'upload de la nouvelle image principale :",
									error
								);
								reject(error);
							} else {
								console.log(
									"Nouvelle image principale uploadée avec succès :",
									result.secure_url
								);
								resolve(result);
							}
						}
					);
					uploadStream.end(imageFile.buffer);
				});
				product.image = result.secure_url;
			}

			// Ajout ou remplacement des images supplémentaires
			if (req.files?.additionalImages) {
				console.log("Mise à jour des images supplémentaires...");
				for (let i = 0; i < req.files.additionalImages.length; i++) {
					const file = req.files.additionalImages[i];
					const result = await new Promise((resolve, reject) => {
						const uploadStream = cloudinary.uploader.upload_stream(
							{ resource_type: "auto" },
							(error, result) => {
								if (error) {
									console.error(
										`Erreur lors de l'upload de l'image supplémentaire ${
											i + 1
										} :`,
										error
									);
									reject(error);
								} else {
									console.log(
										`Nouvelle image supplémentaire ${
											i + 1
										} uploadée avec succès :`,
										result.secure_url
									);
									resolve(result);
								}
							}
						);
						uploadStream.end(file.buffer);
					});
					product.additionalImages.push(result.secure_url);
				}
			}

			await product.save();
			console.log("Produit mis à jour avec succès :", product);
			res.status(200).json(product);
		} catch (error) {
			console.error("Erreur lors de la mise à jour du produit :", error);
			res.status(500).json({
				message: "Erreur serveur lors de la mise à jour du produit.",
				error,
			});
		}
	}
);

// Supprimer un produit
router.delete("/:id", async (req, res) => {
	try {
		console.log(`Suppression du produit avec l'ID : ${req.params.id}`);
		const product = await Product.findByIdAndDelete(req.params.id);
		if (!product) {
			return res.status(404).json({ message: "Produit non trouvé." });
		}
		console.log("Produit supprimé avec succès :", product);
		res.status(200).json({ message: "Produit supprimé avec succès." });
	} catch (error) {
		console.error("Erreur lors de la suppression du produit :", error);
		res
			.status(500)
			.json({ message: "Erreur serveur lors de la suppression du produit." });
	}
});

module.exports = router;
