import React, { useEffect, useState } from "react";
import axios from "axios";
import BackButton from "../buttons/Backbutton";
import CardProduit from "../components/CardProduit";

const Sale = () => {
	const [products, setProducts] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProducts = async () => {
			try {
				const response = await axios.get(
					"https://haurly-shop.onrender.com/api/products?category=Sale"
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
		<section className="min-h-[81.3vh] md:min-h-[79.3vh] ">
			<BackButton />
			<div className="container mx-auto px-[20px] py-[50px] ">
				<h1 className="text-3xl font-bold mb-6">Sale Products</h1>
				{products.length === 0 ? (
					<p className="text-red-500">
						No products available in this category.
					</p>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
						{products.map((product) => (
							<CardProduit key={product._id} product={product} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default Sale;
