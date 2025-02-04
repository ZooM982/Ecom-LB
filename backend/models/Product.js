const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		price: { type: Number, required: true, min: 0 },
		description: { type: String, required: true },
		image: { type: String, required: true },
		sizes: {
			type: [String],
			required: true,
			validate: {
				validator: (v) => v.length > 0,
				message: "La liste des tailles ne peut pas être vide!",
			},
		},
		colors: {
			type: [String],
			required: true,
			validate: {
				validator: (v) => v.length > 0,
				message: "La liste des couleurs ne peut pas être vide!",
			},
		},
		category: {
			type: String,
			enum: ["Men", "Women", "Kids", "Accessories", "Sale"],
			required: true,
		},
		stock: { type: Number, default: 0 },
		additionalImages: { type: [String], default: [] },

		// Ajout des statistiques
		views: { type: Number, default: 0 }, // Nombre de vues du produit
		purchases: { type: Number, default: 0 }, // Nombre d'achats du produit
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
