import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BackButton from '../buttons/backbutton';

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // État pour gérer les erreurs

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!id) {
        console.error('ID de produit manquant');
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(`https://ecom-lb.onrender.com/api/products/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des détails du produit', error);
        setError('Erreur lors de la récupération des détails du produit. Veuillez réessayer plus tard.'); // Gérer l'erreur
      } finally {
        setLoading(false); // Assurez-vous que le chargement est arrêté
      }
    };

    fetchProductDetails();
  }, [id]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>; // Afficher l'erreur
  if (!product) return <div>Produit non trouvé.</div>;

  return (
    <div className="product-details m:size-[30%] mx-auto text-center">
      <BackButton />
      <h1 className='font-bold text-[50px]'>{product.name}</h1>
      <img className='size-[300px] mx-auto' src={product.image} alt={product.name} />
      <div className='text-[19px] text-left ms-[10px]'>
        <p>Description: {product.description}</p>
        <p>Prix: {product.price} $</p>
        <p>Taille(s) disponible(s): {product.sizes.join(', ')}</p>
        <p>Couleur(s) disponible(s): {product.colors.join(', ')}</p>
        <h3>Images supplémentaires:</h3>
      </div>
      <div className="additional-images grid grid-cols-2 gap-4"> {/* Ajout de styles pour les images supplémentaires */}
        {product.additionalImages.map((image, index) => (
          <img key={index} className="w-full h-auto rounded" src={image} alt={`${product.name} - ${index}`} />
        ))}
      </div>
    </div>
  );
};

export default ProductDetails;
