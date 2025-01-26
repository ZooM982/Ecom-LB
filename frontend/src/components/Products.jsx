import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddToCartButton from "../buttons/AddToCartButton";
import SplashScreen from "./SplashScreen/SplashScreen";
import NavigationButton from "../buttons/NavigationButton"; // Importation du composant

function Products({ addToCart }) {
	const [products, setProducts] = useState([]);
	const { category } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	// Références pour chaque catégorie
	const categoryRefs = useRef({});

	// Groupement des produits par catégorie
	const groupedProducts = useMemo(() => {
		return products.reduce((acc, product) => {
			acc[product.category] = acc[product.category] || [];
			acc[product.category].push(product);
			return acc;
		}, {});
	}, [products]);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					`https://haurly-shop.onrender.com/api/products`,
					{
						params: {
							category: category || "",
						},
					}
				);

				setProducts(response.data);
			} catch (error) {
				setError("Erreur lors du chargement des produits.");
				console.error("Erreur lors de la récupération des produits:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchProducts();
	}, [category]);

	if (loading) return <SplashScreen />;
	if (error) return <div>{error}</div>;

	// Fonction de défilement des produits
	const handleScroll = (direction, cat) => {
		const categoryRef = categoryRefs.current[cat];
		if (categoryRef) {
			const scrollAmount = 200; // 
			categoryRef.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="container mx-auto pb-12 ">
			{/* <h2 className="text-8xl font-bold mb-8">
				{category
					? `${category.charAt(0).toUpperCase() + category.slice(1)} Collection`
					: "Collections"}
			</h2> */}

			{products.length === 0 ? (
				<p className="text-red-500 text-center">
					No products available! Coming soon.
				</p>
			) : (
				<>
					{Object.keys(groupedProducts).map((cat) => {
						return (
							<div key={cat} className="mb-12">
								<h3 className="text-2xl text-white font-serif italic md:text-5xl py-2 md:py-4 font-bold mb-4 bg-[#001806]">
									{cat}
								</h3>

								{/* Section de défilement horizontal */}
								<div className="relative px-8">
									{/* Bouton de défilement à gauche */}
									<button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
										<NavigationButton
											direction="left"
											onClick={() => handleScroll("left", cat)} // Passer la catégorie
											disabled={false}
										/>
									</button>

									{/* Produits de la catégorie */}
									<div
										ref={(el) => (categoryRefs.current[cat] = el)} // Référence unique pour chaque catégorie
										className="flex overflow-x-scroll scrollbar-hide gap-5 py-2"
									>
										{groupedProducts[cat].map((product) => (
											<div
												key={product._id}
												className="bg-white rounded-lg shadow-md p-4 w-[60%] md:w-[20%] flex-shrink-0"
											>
												<Link to={`/products/${product._id}`}>
													<img
														src={product.image}
														alt={product.name}
														className="w-full h-48 object-cover rounded-md mb-4"
													/>
													<h3 className="text-lg font-semibold">
														{product.name}
													</h3>
												</Link>
												<p className="text-gray-600 mb-2">
													{product.price} FCFA
												</p>
												<AddToCartButton
													product={product}
													addToCart={addToCart}
												/>
											</div>
										))}
									</div>

									{/* Bouton de défilement à droite */}
									<button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
										<NavigationButton
											direction="right"
											onClick={() => handleScroll("right", cat)} // Passer la catégorie
											disabled={false}
										/>
									</button>
								</div>
							</div>
						);
					})}
				</>
			)}
		</section>
	);
}

export default Products;
