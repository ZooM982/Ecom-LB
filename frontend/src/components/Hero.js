import React, { useEffect, useState } from "react";
import axios from "axios";

function Hero({ category }) {
	const [backgroundImages, setBackgroundImages] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://haurly-shop.onrender.com/api/products",
					{
						params: { category },
					}
				);

				// Récupérer les images des produits
				const images = response.data.map((product) => product.image);
				setBackgroundImages(images);
			} catch (error) {
				console.error("Erreur lors de la récupération des produits:", error);
			}
		};

		fetchProducts();
	}, [category]);

	useEffect(() => {
		if (backgroundImages.length > 0) {
			// Change l'image de fond toutes les 5 secondes
			const interval = setInterval(() => {
				setCurrentIndex(
					(prevIndex) => (prevIndex + 1) % backgroundImages.length
				);
			}, 5000);

			return () => clearInterval(interval);
		}
	}, [backgroundImages]);

	return (
		<section
			className="bg-cover bg-center h-[100vh] transition-all duration-1000"
			style={{
				backgroundImage: `url(${
					backgroundImages[currentIndex] ||
					"https://img.freepik.com/photos-gratuite/vetements_144627-25214.jpg?size=626&ext=jpg"
				})`,
			}}
		>
			<div className="container mx-auto h-full flex items-center justify-center">
				<h2 className="text-4xl text-white font-bold">
					{category
						? `${
								category.charAt(0).toUpperCase() + category.slice(1)
						  } Collection`
						: "Featured Collections"}
				</h2>
			</div>
		</section>
	);
}

export default Hero;
