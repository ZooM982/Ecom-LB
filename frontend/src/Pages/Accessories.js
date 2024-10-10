import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Accessories = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/products?category=Accessories"
        );
        setProducts(response.data);
      } catch (error) {
        setError("Erreur lors du chargement des produits.");
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Accessories</h1>
      {products.length === 0 ? (
        <p className="text-red-500">No products available in this category.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-md p-4 rounded-lg">
              <Link to={`/products/${product._id}`}>
              <img src={product.image} alt={product.name} className="w-full h-48 object-cover rounded-md mb-4" />
              <h3 className="text-lg font-semibold">{product.name}</h3>
            </Link>
              <p className="text-gray-600 mb-2">{product.description}</p>
              <p className="text-blue-500 font-bold">${product.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Accessories;
