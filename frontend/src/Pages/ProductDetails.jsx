// ProductDetails.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import BackButton from "../buttons/Backbutton";
import AddToCartButton from "../buttons/AddToCartButton";

const ProductDetails = ({ addToCart }) => {
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
					`https://haurly-shop.onrender.com/api/products/${id}`
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

	if (loading)
		return (
			<div className="text-center text-2xl font-semibold">Chargement...</div>
		);
	if (error) return <div className="text-center text-red-500">{error}</div>;
	if (!product)
		return <div className="text-center text-lg">Produit non trouvé.</div>;

	// Vérification et traitement des données
	const additionalImages = Array.isArray(product.additionalImages)
		? product.additionalImages
		: [];
	const sizes = product.sizes ? product.sizes.join(", ") : "Non spécifiées";
	const colors = product.colors ? product.colors.join(", ") : "Non spécifiées";

	return (
		<section className="min-h-[81.3vh] md:min-h-[79.3vh] bg-gray-100 py-8">
			{/* Bouton retour avec animation d'icône */}
			<BackButton />
			<div className="container mx-auto px-4 md:px-16 text-center bg-white shadow-lg rounded-lg">
				<h1 className="font-bold text-4xl md:text-5xl text-gray-800">
					{product.name}
				</h1>
				<div className="my-6">
					<img
						className="w-[300px] h-auto mx-auto rounded-lg shadow-md hover:scale-105 transition-transform duration-300"
						src={product.image}
						alt={`Image de ${product.name}`}
					/>
				</div>
				<div className="text-xl text-left mx-4 md:mx-16 mt-6 space-y-4">
					<p className="text-gray-700">
						<strong>Description:</strong> {product.description}
					</p>
					<p className="text-gray-700">
						<strong>Prix:</strong>{" "}
						<span className="text-green-600">{product.price} FCFA</span>
					</p>
					<p className="text-gray-700">
						<strong>Taille(s) disponible(s):</strong> {sizes}
					</p>
					<p className="text-gray-700">
						<strong>Couleur(s) disponible(s):</strong> {colors}
					</p>
				</div>

				{/* Bouton "Ajouter au panier" avec animation */}
				<div className="w-[30%] mx-auto border m-3 p-2 ">
					<AddToCartButton product={product} addToCart={addToCart} />
				</div>
				<h3 className="mt-8 text-2xl font-semibold text-gray-800">
					Images supplémentaires
				</h3>

				{/* Images supplémentaires avec une animation */}
				<div className="additional-images grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
					{additionalImages.length > 0 ? (
						additionalImages.map((image, index) => (
							<img
								key={index}
								className="w-full h-auto rounded-lg shadow-sm hover:scale-105 transition-transform duration-300"
								src={image}
								alt={`${product.name} - Image supplémentaire ${index + 1}`}
							/>
						))
					) : (
						<p className="col-span-2 text-center text-gray-500">
							Aucune image supplémentaire disponible.
						</p>
					)}
				</div>
			</div>
		</section>
	);
};

export default ProductDetails;
