import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    image: ''
  });
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Récupérer tous les produits
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://ecom-np486kaq0-roll-haurlys-projects.vercel.app/api/products');
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
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://ecom-np486kaq0-roll-haurlys-projects.vercel.app/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        name: '',
        category: '',
        description: '',
        price: '',
        image: ''
      });
    } catch (error) {
      console.error("Erreur lors de l'ajout du produit", error);
    }
  };

  // Suppression d'un produit avec gestion d'erreur
  const handleDeleteProduct = async (productId) => {
    try {
      const response = await axios.delete(`https://ecom-np486kaq0-roll-haurlys-projects.vercel.app/api/products/${productId}`);
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

  // Modification d'un produit
  const handleEditProduct = async (product) => {
    console.log("Modifier le produit:", product);
  };

  // Regrouper les produits par catégorie
  const groupedProducts = products.reduce((acc, product) => {
    const category = product.category || 'Autres';
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  return (
    <div className="md:flex space-x-8 p-8">
      {/* Colonne de gauche - Formulaire d'ajout */}
      <div className="md:w-1/3 bg-gray-100 p-6 rounded-lg">
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
            <label className="block text-gray-700">Image (URL)</label>
            <input
              type="text"
              name="image"
              value={newProduct.image}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Ajouter le produit
          </button>
        </form>
      </div>

      {/* Colonne de droite - Liste des produits */}
      <div className="w-2/3">
        <h2 className="text-2xl font-bold mb-4">Liste des produits</h2>
        {loading ? (
          <p>Chargement des produits...</p>
        ) : (
          <div>
            {Object.keys(groupedProducts).map((category) => (
              <div key={category} className="mb-6">
                <h3 className="text-xl font-semibold mb-2">{category}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {groupedProducts[category].map((product) => (
                    <div key={product._id} className="bg-white p-4 rounded-lg shadow-md">
                      <img src={product.image} alt={product.name} className="w-full h-32 object-cover mb-2 rounded-md" />
                      <h4 className="font-bold">{product.name}</h4>
                      <p>{product.description}</p>
                      <p className="text-blue-500 font-bold">{product.price} $</p>
                      <div className="mt-4">
                        <button
                          onClick={() => handleEditProduct(product)}
                          className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="bg-red-500 text-white py-1 px-2 rounded"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageProducts;
