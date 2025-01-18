import React, { useState, useEffect } from "react";
import axios from "axios";

const ManageProducts = () => {
	const [newProduct, setNewProduct] = useState({
		name: "",
		category: "",
		description: "",
		price: "",
		image: "",
		additionalImages: [],
		sizes: [],
		colors: [],
		stock: 0,
	});
	const [previewImage, setPreviewImage] = useState(null);
	const [previewAdditionalImages, setPreviewAdditionalImages] = useState([]);
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
			if (name === "image") {
				setNewProduct((prev) => ({ ...prev, image: files }));
				setPreviewImage(URL.createObjectURL(files[0])); // Prévisualisation de l'image principale
			} else if (name === "additionalImages") {
				setNewProduct((prev) => {
					// S'assurer que additionalImages reste un tableau
					const newAdditionalImages = files ? Array.from(files) : [];
					return { ...prev, additionalImages: newAdditionalImages };
				});
				const filePreviews = Array.from(files).map((file) =>
					URL.createObjectURL(file)
				); // Prévisualisation des images supplémentaires
				setPreviewAdditionalImages(filePreviews);
			}
		} else {
			setNewProduct((prev) => ({
				...prev,
				[name]:
					name === "sizes" || name === "colors" || name === "additionalImages"
						? value.split(",").map((item) => item.trim())
						: value,
			}));
		}
	};

	const handleAddProduct = async (e) => {
		e.preventDefault();

		// Création de l'objet FormData
		const formData = new FormData();
		formData.append("name", newProduct.name);
		formData.append("category", newProduct.category);
		formData.append("description", newProduct.description);
		formData.append("price", newProduct.price);
		formData.append("stock", newProduct.stock);

		// Ajouter l'image principale (fichier unique)
		if (newProduct.image && newProduct.image[0]) {
			formData.append("image", newProduct.image[0]);
		}

		// Ajouter les images supplémentaires
		if (
			Array.isArray(newProduct.additionalImages) &&
			newProduct.additionalImages.length > 0
		) {
			newProduct.additionalImages.forEach((file, index) => {
				formData.append(`additionalImages[${index}]`, file);
			});
		}

		// Ajouter les tailles et couleurs sous forme de chaînes séparées par des virgules
		formData.append("sizes", newProduct.sizes.join(","));
		formData.append("colors", newProduct.colors.join(","));

		try {
			const response = await axios.post(
				"https://ecom-lb.onrender.com/api/products",
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data", // Indique que nous envoyons des fichiers
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
				additionalImages: [],
				sizes: [],
				colors: [],
				stock: 0,
			});
			setPreviewImage(null);
			setPreviewAdditionalImages([]);
		} catch (error) {
			console.error("Erreur lors de l'ajout du produit", error);
		}
	};




	// Suppression d'un produit
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

	// Regrouper les produits par catégorie
	const groupedProducts = products.reduce((acc, product) => {
		const category = product.category || "Autres";
		if (!acc[category]) acc[category] = [];
		acc[category].push(product);
		return acc;
	}, {});

	return (
		<div className="md:flex md:space-x-8 md:p-8">
			{/* Colonne de gauche - Formulaire d'ajout */}
			<div className="md:w-1/3 w-full bg-gray-100 p-6 rounded-lg">
				<h2 className="text-2xl font-bold mb-4">Ajouter un nouveau produit</h2>
				<form onSubmit={handleAddProduct}>
					<div className="mb-4">
						<label className="block text-gray-700">Nom du produit</label>
						<input
							type="text"
							name="name"
							value={newProduct.name}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					<div className="mb-4">
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
					<div className="mb-4">
						<label className="block text-gray-700">Description</label>
						<textarea
							name="description"
							value={newProduct.description}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					<div className="mb-4">
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

					{/* Prévisualisation de l'image principale */}
					<div className="mb-4">
						<label className="block text-gray-700">Image principale</label>
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
								className="mt-2 w-full h-auto max-w-[300px]"
							/>
						)}
					</div>

					{/* Images supplémentaires */}
					<div className="mb-4">
						<label className="block text-gray-700">
							Images supplémentaires
						</label>
						<input
							type="file"
							name="additionalImages"
							multiple
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
						/>
						{previewAdditionalImages.length > 0 && (
							<div className="mt-4 flex flex-wrap gap-4">
								{previewAdditionalImages.map((image, index) => (
									<img
										key={index}
										src={image}
										alt={`Preview ${index}`}
										className="w-[100px] h-[100px] object-cover"
									/>
								))}
							</div>
						)}
					</div>

					<div className="mb-4">
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
					<div className="mb-4">
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
					<div className="mb-4">
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
			</div>

			{/* Colonne de droite - Liste des produits */}
			<div className="md:w-2/3 w-full p-2 md:p-0">
				{loading ? (
					<p>Chargement des produits...</p>
				) : (
					<div>
						<h2 className="text-2xl font-bold mb-4">Liste des produits</h2>
						{Object.entries(groupedProducts).map(([category, products]) => (
							<div key={category}>
								<h3 className="text-xl font-semibold">{category}</h3>
								<ul className="list-disc pl-5 mb-4">
									{products.map((product) => (
										<li
											key={product._id}
											className="md:flex my-2 justify-between items-center"
										>
											<div className="flex w-full items-center md:justify-between">
												<img
													className="w-[45px] h-[45px]"
													src={product.image}
													alt={product.name}
												/>
												<span className="mx-auto flex">
													<p className="hidden md:block">Nom: &nbsp;</p>
													{product.name}
												</span>
												<span className="mx-auto flex">
													<p className="hidden md:block">Prix: &nbsp;</p>
													{product.price} FCFA
												</span>
												<span className="mx-auto flex">
													<p className="hidden md:block">Stock: &nbsp;</p>
													{product.stock}
												</span>
												<span className="mx-auto flex">
													<p className="hidden md:block">Taille: &nbsp;</p>
													{product.sizes}
												</span>
												<span className="mx-auto flex">
													<p className="hidden md:block">Couleur: &nbsp;</p>
													{product.colors}
												</span>
											</div>
											<div>
												<button
													onClick={() => handleDeleteProduct(product._id)}
													className="bg-red-500 text-white px-3 py-1 rounded-lg"
												>
													Supprimer
												</button>
											</div>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default ManageProducts;
