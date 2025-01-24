const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		price: {
			type: Number,
			required: true,
			min: 0,
		},
		description: {
			type: String,
			required: true,
		},
		image: {
			type: String,
			required: true,
		},
		sizes: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return v.length > 0;
				},
				message: (props) => `La liste des tailles ne peut pas être vide!`,
			},
		},
		colors: {
			type: [String],
			required: true,
			validate: {
				validator: function (v) {
					return v.length > 0;
				},
				message: (props) => `La liste des couleurs ne peut pas être vide!`,
			},
		},
		category: {
			type: String,
			enum: ["Men", "Women", "Kids", "Accessories", "Sale"],
			required: true,
		},
		stock: {
			type: Number,
			default: 0,
		},
	},
	{
		timestamps: true,
	}
);

module.exports = mongoose.model("Product", productSchema);
