import React, { useState, useEffect } from "react";
import axios from "axios";

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
			setPreviewImage(URL.createObjectURL(files[0])); // Prévisualisation de l'image
		} else {
			setNewProduct((prev) => ({
				...prev,
				[name]:
					name === "sizes" || name === "colors" ? value.split(",") : value,
			}));
		}
	};

	// Fonction pour ajouter ou modifier un produit
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
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);

				// Mise à jour de la liste des produits après modification
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
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				);
				setProducts([...products, response.data]);
			}

			// Réinitialiser l'état après ajout ou modification
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
			setEditingProduct(null); // Réinitialiser l'état d'édition
		} catch (error) {
			console.error("Erreur lors de l'ajout/modification du produit", error);
		}
	};

	// Fonction pour charger un produit dans le formulaire pour modification
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
		setPreviewImage(product.image); // Prévisualisation de l'image existante
		setEditingProduct(product); // Marquer le produit comme étant en cours de modification
	};

	const handleDeleteProduct = async (productId) => {
		try {
			const response = await axios.delete(
				`https://ecom-lb.onrender.com/api/products/${productId}`
			);
			if (response.status === 200) {
				setProducts(products.filter((product) => product._id !== productId));
				console.log("Produit supprimé avec succès");
			} else {
				console.error(
					"Erreur lors de la suppression du produit :",
					response.status
				);
			}
		} catch (error) {
			console.error(
				"Erreur lors de la suppression du produit :",
				error.response ? error.response.data : error.message
			);
		}
	};

	return (
		<div className="md:p-6 p-2 space-y-8">
			<h2 className="text-3xl font-bold text-center">Gérer les Produits</h2>
			{/* Formulaire d'ajout de produit */}
			<div className="md:flex">
				<form
					onSubmit={handleSubmit}
					className="space-y-6 bg-gray-100 p-6 rounded-lg md:w-[48%] mx-auto"
				>
					<h3 className="text-xl font-bold">
						{editingProduct ? "Modifier" : "Ajouter"} un Produit
					</h3>
					{/* Nom du produit */}
					<div>
						<label className="block text-gray-700">Nom</label>
						<input
							type="text"
							name="name"
							value={newProduct.name}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					{/* Catégorie du produit */}
					<div>
						<label className="block text-gray-700">Catégorie</label>
						<select
							name="category"
							value={newProduct.category}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						>
							<option value="">Sélectionner une catégorie</option>
							<option value="Men">Men</option>
							<option value="Women">Women</option>
							<option value="Kids">Kids</option>
							<option value="Accessories">Accessories</option>
							<option value="Sale">Sale</option>
						</select>
					</div>
					{/* Description du produit */}
					<div>
						<label className="block text-gray-700">Description</label>
						<textarea
							name="description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					{/* Prix du produit */}
					<div>
						<label className="block text-gray-700">Prix</label>
						<input
							type="number"
							name="price"
							value={newProduct.price}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					{/* Image du produit */}
					<div>
						<label className="block text-gray-700">Image Principale</label>
						{previewImage ? (
							<div className="flex items-center space-x-4">
								<img
									src={previewImage}
									alt="Prévisualisation"
									className="mt-2 w-[50%] h-auto rounded-md"
								/>
								<button
									type="button"
									onClick={() => setPreviewImage(null)}
									className="bg-red-500 text-white px-2 py-1 rounded-md"
								>
									Supprimer
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => document.getElementById("file-input").click()}
								className="bg-blue-500 w-full h-[70px] text-white px-4 py-2 rounded-lg"
							>
								+
							</button>
						)}
						<input
							type="file"
							id="file-input"
							name="image"
							onChange={handleInputChange}
							className="hidden" // Cacher l'input file
						/>
					</div>

					{/* Tailles du produit */}
					<div>
						<label className="block text-gray-700">
							Tailles (séparées par des virgules)
						</label>
						<input
							type="text"
							name="sizes"
							value={newProduct.sizes.join(",")}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					{/* Couleurs du produit */}
					<div>
						<label className="block text-gray-700">
							Couleurs (séparées par des virgules)
						</label>
						<input
							type="text"
							name="colors"
							value={newProduct.colors.join(",")}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					{/* Stock du produit */}
					<div>
						<label className="block text-gray-700">Stock</label>
						<input
							type="number"
							name="stock"
							value={newProduct.stock}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-500 text-white py-2 rounded-lg"
					>
						{editingProduct ? "Modifier Produit" : "Ajouter Produit"}
					</button>
				</form>

				{/* Liste des produits */}
				<div className="md:w-[48%] mx-auto">
					<h3 className="text-xl font-bold mb-4">Produits Disponibles</h3>
					{loading ? (
						<p>Chargement des produits...</p>
					) : (
						<ul className="space-y-4">
							{products.map((product) => (
								<li
									key={product._id}
									className="flex justify-between items-center"
								>
									<h1>{product.category}</h1>
									<div className="flex items-center space-x-4">
										<img
											src={product.image}
											alt={product.name}
											className="w-16 h-16 object-cover rounded-lg"
										/>
										<div>
											<h4 className="text-lg font-bold">{product.name}</h4>
											<p>{product.price} FCFA</p>
											<p>{product.stock} Article(s)</p>
										</div>
									</div>
									<div className="flex space-x-2">
										<button
											onClick={() => handleEditProduct(product)}
											className="bg-yellow-500 text-white px-4 py-2 rounded-md"
										>
											Modifier
										</button>
										<button
											onClick={() => handleDeleteProduct(product._id)}
											className="bg-red-500 text-white px-4 py-2 rounded-md"
										>
											Supprimer
										</button>
									</div>
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default ManageProducts;
