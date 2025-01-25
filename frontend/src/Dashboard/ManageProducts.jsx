import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductForm from "./ProductForm ";
import ProductList from "./ProductList ";
import Modal from "../components/Modal/Modal"
import { toast } from "react-toastify";


const ManageProducts = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [editingProduct, setEditingProduct] = useState(null);
	
	const [isModalOpen, setIsModalOpen] = useState(false);
	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

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
				toast.success("Produit mis à jour avec succès !");
			} else {
				// Création
				response = await axios.post(
					"https://ecom-lb.onrender.com/api/products",
					formData,
					{ headers: { "Content-Type": "multipart/form-data" } }
				);
				setProducts((prev) => [...prev, response.data]);
				toast.success("Produit ajouté avec succès !");
			}

			// Réinitialisation après soumission
			setEditingProduct(null);
		} catch (error) {
			console.error("Erreur lors de l'ajout/mise à jour du produit", error);
			toast.error("Une erreur s'est produite. Veuillez réessayer.");
		}
	};

	// Préparer un produit pour l'édition
	const handleEditProduct = (product) => {
		setEditingProduct(product);
		openModal();
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
				toast.success("Produit supprimé avec succès !");
			}
		} catch (error) {
			console.error("Erreur lors de la suppression du produit", error);
			toast.error("Une erreur s'est produite. Veuillez réessayer.");
		}
	};

	return (
		<section className="min-h-[81.3vh] md:min-h-[79.3vh] ">
			<div className="md:p-6 p-2 space-y-8">
				<div className="grid">
					<button onClick={openModal} className="p-2 md:w-[20%] text-[20px] bg-blue-400 float-right">
						Ajouter un produit
					</button>
					<ProductList
						products={products}
						handleEditProduct={handleEditProduct}
						handleDeleteProduct={handleDeleteProduct}
					/>
				</div>
			</div>
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<ProductForm initialData={editingProduct} onSubmit={handleSubmit} />
			</Modal>
		</section>
	);
};

export default ManageProducts;
