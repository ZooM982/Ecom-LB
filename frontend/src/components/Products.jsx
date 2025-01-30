import React, { useEffect, useState, useMemo, useRef } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import AddToCartButton from "../buttons/AddToCartButton";
import SplashScreen from "./SplashScreen/SplashScreen";
import NavigationButton from "../buttons/NavigationButton";
import { FaChevronRight } from "react-icons/fa";

function Products({ addToCart }) {
	const [products, setProducts] = useState([]);
	const { category } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState();

	const categoryRefs = useRef({});

	// Groupement des produits par catégorie avec tri et limitation à 6 produits
	const groupedProducts = useMemo(() => {
		const grouped = products.reduce((acc, product) => {
			acc[product.category] = acc[product.category] || [];
			acc[product.category].push(product);
			return acc;
		}, {});

		// Trier par date de création (du plus récent au plus ancien) et limiter à 6
		Object.keys(grouped).forEach((cat) => {
			grouped[cat] = grouped[cat]
				.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
				.slice(0, 5);
		});

		return grouped;
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

	const handleScroll = (direction, cat) => {
		const categoryRef = categoryRefs.current[cat];
		if (categoryRef) {
			const scrollAmount = 200;
			categoryRef.scrollBy({
				left: direction === "left" ? -scrollAmount : scrollAmount,
				behavior: "smooth",
			});
		}
	};

	return (
		<section className="container mx-auto pb-12">
			{products.length === 0 ? (
				<p className="text-red-500 text-center">
					No products available! Coming soon.
				</p>
			) : (
				<>
					{Object.keys(groupedProducts).map((cat) => (
						<div key={cat} className="mb-12">
							<div className="bg-[#001806] px-5 flex justify-between text-center">
								<h3 className="text-2xl text-white font-serif italic md:text-5xl py-2 md:py-4 font-bold mb-4">
									{cat}
								</h3>
								<button className="text-white me-5 items-center underline flex font-bold ">
									<Link to={`/${cat.toLowerCase()}`}>voir tout</Link>
									<span className="ms-2">
										<FaChevronRight />
									</span>
								</button>
							</div>

							<div className="relative px-8">
								<button className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10">
									<NavigationButton
										direction="left"
										onClick={() => handleScroll("left", cat)}
										disabled={false}
									/>
								</button>

								<div
									ref={(el) => (categoryRefs.current[cat] = el)}
									className="flex overflow-x-scroll scrollbar-hide gap-5 py-2"
								>
									{groupedProducts[cat].map((product) => (
										<div
											key={product._id}
											className="bg-white rounded-lg shadow-md p-4 w-[60%] md:w-[20%] flex-shrink-0"
										>
											<Link to={`/products/${product._id}`}>
												<p className="bg-[#001806] text-white w-[50%] md:w-[35%] text-center rounded-full mb-2 animate-bounce ">
													Nouveau
												</p>
												<img
													src={product.image}
													alt={product.name}
													className="w-full h-48 object-cover rounded-md mb-4"
												/>
												<h3 className="text-lg font-semibold">
													{product.name}
												</h3>
											</Link>
											<p className="text-gray-600 mb-2">{product.price} FCFA</p>
											<AddToCartButton
												product={product}
												addToCart={addToCart}
											/>
										</div>
									))}
								</div>

								<button className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10">
									<NavigationButton
										direction="right"
										onClick={() => handleScroll("right", cat)}
										disabled={false}
									/>
								</button>
							</div>
						</div>
					))}
				</>
			)}
		</section>
	);
}

export default Products;
