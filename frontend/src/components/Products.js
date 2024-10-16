import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import AddToCartButton from '../buttons/AddToCartButton';

function Products({ addToCart }) {
  const [products, setProducts] = useState([]);
  const { category } = useParams(); 

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Si une catégorie est spécifiée, passer cette catégorie dans la requête API
        const response = await axios.get(`https://ecom-lb.onrender.com/api/products`, {
          params: {
            category: category || '' // Envoyer la catégorie dans la requête
          }
        });

        setProducts(response.data); // Récupérer les produits filtrés
      } catch (error) {
        console.error('Erreur lors de la récupération des produits:', error);
      }
    };

    fetchProducts();
  }, [category]);

  return (
    <section className="container mx-auto py-12">
      <h2 className="text-3xl font-bold mb-8">
        {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection` : 'Featured Collections'}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-lg shadow-md p-4">
            <Link to={`/products/${product._id}`}>
            <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
            <h3 className="text-lg font-semibold">{product.name}</h3>
            </Link>
            <p className="text-gray-600 mb-2">${product.price}</p>
            <AddToCartButton product={product} addToCart={addToCart} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;
