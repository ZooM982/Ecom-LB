import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm ";
import ProductList from "./ProductList ";

const ManageProducts = () => {
	const [products, setProducts] = useState([]); 
	const [loading, setLoading] = useState(true); 
	const [editingProduct, setEditingProduct] = useState(null); 

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
				formData.append(key, value.join(","));
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
				alert("Produit mis à jour avec succès !");
			} else {
				// Création
				response = await axios.post(
					"https://ecom-lb.onrender.com/api/products",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				setProducts((prev) => [...prev, response.data]);
				alert("Produit ajouté avec succès !");
			}

			// Réinitialisation après soumission
			setEditingProduct(null);
		} catch (error) {
			console.error("Erreur lors de l'ajout/mise à jour du produit", error);
			alert("Une erreur s'est produite. Veuillez réessayer.");
		}
	};

	// Préparer un produit pour l'édition
	const handleEditProduct = (product) => {
		setEditingProduct(product);
	};

	// Supprimer un produit
	const handleDeleteProduct = async (productId) => {
		const confirmation = window.confirm(
			"Êtes-vous sûr de vouloir supprimer ce produit ?"
		);
		if (!confirmation) return;

		try {
			const response = await axios.delete(
				`https://ecom-lb.onrender.com/api/products/${productId}`
			);
			if (response.status === 200) {
				setProducts((prev) =>
					prev.filter((product) => product._id !== productId)
				);
				alert("Produit supprimé avec succès !");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression du produit", error);
			alert("Une erreur s'est produite. Veuillez réessayer.");
		}
	};

	return (
		<div className="md:p-6 p-2 space-y-8">
			<h2 className="text-3xl font-bold text-center">Gérer les Produits</h2>
			<div className="grid md:grid-cols-2 gap-5">
				<ProductForm initialData={editingProduct} onSubmit={handleSubmit} />
				<ProductList
					products={products}
					handleEditProduct={handleEditProduct}
					handleDeleteProduct={handleDeleteProduct}
				/>
			</div>
		</div>
	);
};

export default ManageProducts;
