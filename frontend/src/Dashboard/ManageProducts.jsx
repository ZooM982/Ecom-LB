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
			setPreviewImage(URL.createObjectURL(files[0])); // Prévisualisation de l'image principale
		} else {
			setNewProduct((prev) => ({
				...prev,
				[name]:
					name === "sizes" || name === "colors" ? value.split(",") : value,
			}));
		}
	};

	const handleAddProduct = async (e) => {
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
			const response = await axios.post(
				"https://ecom-lb.onrender.com/api/products",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
					},
				}
			);

			setProducts([...products, response.data]);
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
		} catch (error) {
			console.error("Erreur lors de l'ajout du produit", error);
		}
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
					onSubmit={handleAddProduct}
					className="space-y-6 bg-gray-100 p-6 rounded-lg md:w-[48%] mx-auto "
				>
					<h3 className="text-xl font-bold">Ajouter un Produit</h3>
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
					<div>
						<label className="block text-gray-700">Image Principale</label>
						<input
							type="file"
							name="image"
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
						{previewImage && (
							<img
								src={previewImage}
								alt="Prévisualisation"
								className="mt-2 w-32 h-auto"
							/>
						)}
					</div>
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
						Ajouter Produit
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
											<p>{product.quantity}</p>
											<p>{product.stock} Article(s)</p>
										</div>
									</div>
									<button
										onClick={() => handleDeleteProduct(product._id)}
										className="bg-red-500 text-white px-3 py-1 rounded-lg"
									>
										Supprimer
									</button>
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
