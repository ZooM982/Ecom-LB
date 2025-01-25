import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../buttons/backbutton";

const ProductDetails = () => {
	const { id } = useParams();
	const [product, setProduct] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProductDetails = async () => {
			if (!id) {
				console.error("ID de produit manquant");
				setLoading(false);
				return;
			}
			try {
				const response = await axios.get(
					`https://ecom-lb.onrender.com/api/products/${id}`
				);
				setProduct(response.data);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des détails du produit",
					error
				);
				setError(
					"Erreur lors de la récupération des détails du produit. Veuillez réessayer plus tard."
				);
			} finally {
				setLoading(false);
			}
		};

		fetchProductDetails();
	}, [id]);

	if (loading) return <div>Chargement...</div>;
	if (error) return <div>{error}</div>;
	if (!product) return <div>Produit non trouvé.</div>;

	// Vérification et traitement des données
	const additionalImages = Array.isArray(product.additionalImages)
		? product.additionalImages
		: [];
	const sizes = product.sizes ? product.sizes.join(", ") : "Non spécifiées";
	const colors = product.colors ? product.colors.join(", ") : "Non spécifiées";

	return (
		<div className="product-details m:size-[30%] mx-auto text-center">
			<BackButton />
			<h1 className="font-bold text-[50px]">{product.name}</h1>
			<img
				className="w-[300px] h-auto mx-auto rounded-lg shadow-md"
				src={product.image}
				alt={`Image de ${product.name}`}
			/>
			<div className="text-[19px] text-left mx-4 mt-6">
				<p>
					<strong>Description:</strong> {product.description}
				</p>
				<p>
					<strong>Prix:</strong> {product.price} FCFA
				</p>
				<p>
					<strong>Taille(s) disponible(s):</strong> {sizes}
				</p>
				<p>
					<strong>Couleur(s) disponible(s):</strong> {colors}
				</p>
				<h3 className="mt-4 text-lg font-semibold">Images supplémentaires:</h3>
			</div>

			<div className="additional-images grid grid-cols-2 gap-4 mt-4">
				{additionalImages.length > 0 ? (
					additionalImages.map((image, index) => (
						<img
							key={index}
							className="w-full h-auto rounded-lg shadow-sm"
							src={image}
							alt={`${product.name} - Image supplémentaire ${index + 1}`}
						/>
					))
				) : (
					<p className="col-span-2 text-gray-500">
						Aucune image supplémentaire disponible.
					</p>
				)}
			</div>
		</div>
	);
};

export default ProductDetails;
