import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm ";
import ProductList from "./ProductList ";

const ManageProducts = () => {
	const [products, setProducts] = useState([]); // Liste des produits
	const [loading, setLoading] = useState(true); // État de chargement
	const [editingProduct, setEditingProduct] = useState(null); // Produit en cours d'édition

	// Charger les produits depuis l'API
	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://ecom-lb.onrender.com/api/products"
				);
				setProducts(response.data);
			} catch (error) {
				console.error("Erreur lors de la récupération des produits", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, []);

	// Ajouter ou mettre à jour un produit
	const handleSubmit = async (productData, imageFile) => {
		const formData = new FormData();
		Object.entries(productData).forEach(([key, value]) => {
			if (key === "sizes" || key === "colors") {
				formData.append(key, value.join(",")); // Convertir en chaîne
			} else {
				formData.append(key, value);
			}
		});

		if (imageFile) {
			formData.append("image", imageFile);
		}

		try {
			let response;

			if (editingProduct) {
				// Mise à jour
				response = await axios.put(
					`https://ecom-lb.onrender.com/api/products/${editingProduct._id}`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				setProducts((prev) =>
					prev.map((product) =>
						product._id === editingProduct._id ? response.data : product
					)
				);
			} else {
				// Création
				response = await axios.post(
					"https://ecom-lb.onrender.com/api/products",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				setProducts((prev) => [...prev, response.data]);
			}

			// Réinitialisation après soumission
			setEditingProduct(null);
		} catch (error) {
			console.error("Erreur lors de l'ajout/mise à jour du produit", error);
		}
	};

	// Préparer un produit pour l'édition
	const handleEditProduct = (product) => {
		setEditingProduct(product);
	};

	// Supprimer un produit
	const handleDeleteProduct = async (productId) => {
		try {
			const response = await axios.delete(
				`https://ecom-lb.onrender.com/api/products/${productId}`
			);
			if (response.status === 200) {
				setProducts((prev) =>
					prev.filter((product) => product._id !== productId)
				);
			}
		} catch (error) {
			console.error("Erreur lors de la suppression du produit", error);
		}
	};

	return (
		<div className="md:p-6 p-2 space-y-8">
			<h2 className="text-3xl font-bold text-center">Gérer les Produits</h2>
			<div className="grid md:grid-cols-2 gap-5">
				<ProductForm
					initialData={editingProduct} // Produit en cours d'édition ou vide
					onSubmit={handleSubmit} // Soumission (ajout/mise à jour)
				/>
				<ProductList
					products={products}
					onEdit={handleEditProduct} // Édition
					onDelete={handleDeleteProduct} // Suppression
				/>
			</div>
		</div>
	);
};

export default ManageProducts;
