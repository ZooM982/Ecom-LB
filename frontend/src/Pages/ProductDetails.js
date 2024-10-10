import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const { id } = useParams(); // Assurez-vous que l'ID est bien récupéré ici
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        console.error('ID de produit manquant');
        setLoading(false);
        return; // Arrêter si l'ID est undefined
      }
      try {
        const response = await axios.get(`https://ecom-np486kaq0-roll-haurlys-projects.vercel.app/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit', error);
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]); // Ne déclenche la récupération que lorsque l'ID change

  if (loading) return <div>Chargement...</div>;
  if (!product) return <div>Produit non trouvé.</div>;

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img src={product.image} alt={product.name} />
      <p>Description: {product.description}</p>
      <p>Prix: {product.price} $</p>
      <p>Taille(s) disponible(s): {product.sizes.join(', ')}</p>
      <p>Couleur(s) disponible(s): {product.colors.join(', ')}</p>
      <h3>Images supplémentaires:</h3>
      <div className="additional-images">
        {product.additionalImages.map((image, index) => (
          <img key={index} src={image} alt={`${product.name} - ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
