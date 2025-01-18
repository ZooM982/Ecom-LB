// src/components/ManageProducts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: '',
    additionalImages: [],
    sizes: [],
    colors: [],
    stock: 0
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer tous les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://ecom-lb.onrender.com/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Erreur lors de la récupération des produits", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Gestion de l'ajout d'un nouveau produit
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prev) => ({
      ...prev,
      [name]: name === 'sizes' || name === 'colors' ? value.split(',').map(item => item.trim()) : value,
    }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecom-lb.onrender.com/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        category: '',
        description: '',
        price: '',
        image: '',
        additionalImages: [],
        sizes: [],
        colors: [],
        stock: 0
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error);
    }
  };

  // Suppression d'un produit
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`https://ecom-lb.onrender.com/api/products/${productId}`);
      if (response.status === 200) {
        setProducts(products.filter(product => product._id !== productId));
        console.log('Produit supprimé avec succès');
      } else {
        console.error('Erreur lors de la suppression du produit :', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du produit :', error.response ? error.response.data : error.message);
    }
  };

  // Regrouper les produits par catégorie
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Autres';
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
					<div className="mb-4">
						<label className="block text-gray-700">Image principale</label>
						<input
							type="text"
							name="image"
							value={newProduct.image}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
							required
						/>
					</div>
					<div className="mb-4">
						<label className="block text-gray-700">
							Images supplémentaires (séparées par des virgules)
						</label>
						<input
							type="text"
							name="additionalImages"
							value={newProduct.additionalImages.join(",")}
							onChange={handleInputChange}
							className="w-full px-3 py-2 border rounded-lg"
						/>
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
												<span className="mx-auto flex"><p className='hidden md:block'>Nom: &nbsp;</p>{product.name}</span>
												<span className="mx-auto flex"><p className='hidden md:block'>Prix: &nbsp;</p>{product.price} FCFA</span>
												<span className="mx-auto flex"><p className='hidden md:block'>Stock: &nbsp;</p>{product.stock}</span>
												<span className="mx-auto flex"><p className='hidden md:block'>Taille: &nbsp;</p>{product.sizes}</span>
												<span className="mx-auto flex"><p className='hidden md:block'>Couleur: &nbsp;</p>{product.colors}</span>
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
