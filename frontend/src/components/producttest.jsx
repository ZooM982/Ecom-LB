import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddToCartButton from "../buttons/AddToCartButton";
import SplashScreen from "./SplashScreen/SplashScreen";

function Products({ addToCart }) {
	const [products, setProducts] = useState([]);
	const { category } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	const categoryRefs = useRef({});

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

	return (
		<section className="container mx-auto pb-12">
			{products.length === 0 ? (
				<p className="text-red-500 text-center">
					No products available! Coming soon.
				</p>
			) : (
				<>
					{Object.keys(groupedProducts).map((cat) => {
						const limitedProducts = groupedProducts[cat].slice(0, 6); // Limiter à 6 produits

						return (
							<div key={cat} className="mb-12">
								<div className="bg-[#001806] flex items-center justify-between px-4 py-2">
									<h3 className="text-2xl text-white font-serif italic md:text-5xl font-bold">
										{cat}
									</h3>
									{/* Lien vers la page de la catégorie */}
									<Link
										to={`/${cat.toLowerCase()}`}
										className="text-white underline"
									>
										voir tout
									</Link>
								</div>

								{/* Ligne défilante des produits */}
								<div className="relative px-8">
									<div
										ref={(el) => (categoryRefs.current[cat] = el)}
										className="flex overflow-x-scroll scrollbar-hide gap-5 py-4"
									>
										{limitedProducts.map((product) => (
											<div
												key={product._id}
												className="bg-white rounded-lg shadow-md p-4 w-48 flex-shrink-0"
											>
												<Link to={`/products/${product._id}`}>
													<img
														src={product.image}
														alt={product.name}
														className="w-full h-32 object-cover rounded-md mb-4"
													/>
													<h3 className="text-sm font-semibold">
														{product.name}
													</h3>
												</Link>
												<p className="text-gray-600 mb-2 text-sm">
													{product.price} FCFA
												</p>
												<AddToCartButton
													product={product}
													addToCart={addToCart}
												/>
											</div>
										))}
									</div>

									{/* Bouton voir tout */}
									{groupedProducts[cat].length > 6 && (
										<div className="absolute right-0 top-1/2 transform -translate-y-1/2">
											<Link
												to={`/${cat.toLowerCase()}`}
												className="bg-[#001806] text-white py-2 px-4 rounded-md hover:bg-[#013009] transition"
											>
												Voir tout
											</Link>
										</div>
									)}
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
