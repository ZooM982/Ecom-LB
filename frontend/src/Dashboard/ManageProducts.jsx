import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm ";
import ProductList from "./ProductList ";

const ManageProducts = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		category: "",
		description: "",
		price: "",
		image: "",
		sizes: [],
		colors: [],
		stock: 0,
	});
	const [previewImage, setPreviewImage] = useState(null);
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingProduct, setEditingProduct] = useState(null);

	// Récupérer tous les produits
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

	const handleInputChange = (e) => {
		const { name, value, type, files } = e.target;

		if (type === "file") {
			setNewProduct((prev) => ({ ...prev, image: files[0] }));
			setPreviewImage(URL.createObjectURL(files[0]));
		} else {
			setNewProduct((prev) => ({
				...prev,
				[name]:
					name === "sizes" || name === "colors" ? value.split(",") : value,
			}));
		}
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", newProduct.name);
		formData.append("category", newProduct.category);
		formData.append("description", newProduct.description);
		formData.append("price", newProduct.price);
		formData.append("stock", newProduct.stock);

		if (newProduct.image) {
			formData.append("image", newProduct.image);
		}

		formData.append("sizes", newProduct.sizes.join(","));
		formData.append("colors", newProduct.colors.join(","));

		try {
			let response;

			if (editingProduct) {
				// Mise à jour d'un produit existant
				response = await axios.put(
					`https://ecom-lb.onrender.com/api/products/${editingProduct._id}`,
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);

				setProducts(
					products.map((product) =>
						product._id === editingProduct._id ? response.data : product
					)
				);
			} else {
				// Ajout d'un nouveau produit
				response = await axios.post(
					"https://ecom-lb.onrender.com/api/products",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				setProducts([...products, response.data]);
			}

			setNewProduct({
				name: "",
				category: "",
				description: "",
				price: "",
				image: "",
				sizes: [],
				colors: [],
				stock: 0,
			});
			setPreviewImage(null);
			setEditingProduct(null);
		} catch (error) {
			console.error("Erreur lors de l'ajout/modification du produit", error);
		}
	};

	const handleEditProduct = (product) => {
		setNewProduct({
			name: product.name,
			category: product.category,
			description: product.description,
			price: product.price,
			image: product.image,
			sizes: product.sizes,
			colors: product.colors,
			stock: product.stock,
		});
		setPreviewImage(product.image);
		setEditingProduct(product);
	};

	const handleDeleteProduct = async (productId) => {
		try {
			const response = await axios.delete(
				`https://ecom-lb.onrender.com/api/products/${productId}`
			);
			if (response.status === 200) {
				setProducts(products.filter((product) => product._id !== productId));
				console.log("Produit supprimé avec succès");
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
					newProduct={newProduct}
					handleInputChange={handleInputChange}
					handleSubmit={handleSubmit}
					previewImage={previewImage}
					setPreviewImage={setPreviewImage}
					editingProduct={editingProduct}
				/>
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
