import React, { useState, useMemo } from "react";
import Pagination from "../components/Pagination/Pagination";
import { MdDelete } from "react-icons/md";
import { FaEdit } from "react-icons/fa";

const ProductList = ({ products, handleEditProduct, handleDeleteProduct }) => {
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	// Groupement des produits par catégorie
	const groupedProducts = useMemo(() => {
		return products.reduce((acc, product) => {
			acc[product.category] = acc[product.category] || [];
			acc[product.category].push(product);
			return acc;
		}, {});
	}, [products]);

	// Produits paginés
	const paginatedProducts = useMemo(() => {
		const allProducts = Object.values(groupedProducts).flat();
		return allProducts.slice(
			(currentPage - 1) * itemsPerPage,
			currentPage * itemsPerPage
		);
	}, [groupedProducts, currentPage, itemsPerPage]);

	const totalPages = Math.ceil(products.length / itemsPerPage);

	const handlePageChange = (page) => {
		setCurrentPage(page);
		window.scrollTo({ top: 0, behavior: "smooth" });
	};

	return (
		<section className="min-h-[81.3vh] md:min-h-[79.3vh]">
			<div className="mx-auto">
				{products.length === 0 ? (
					<p className="text-red-500 text-center">
						No products available! Coming soon.
					</p>
				) : (
					<>
						<h3 className="text-xl font-bold mb-4">Produits Disponibles</h3>
						{Object.keys(groupedProducts).map((category) => (
							<div key={category} className="mb-8">
								<h4 className="text-lg font-bold mb-4 italic">{category}</h4>
								<ul className="grid grid-cols-2 md:grid-cols-5 gap-5">
									{groupedProducts[category]
										.filter((product) => paginatedProducts.includes(product))
										.map((product) => (
											<li
												key={product._id}
												className="w-full my-2 bg-gray-100 rounded-lg p-4"
											>
												<h1 className="text-center font-bold italic font-serif m-2">
													{product.category}
												</h1>
												<div className="grid grid-cols-1 gap-2 w-full items-center">
													<img
														src={product.image}
														alt={product.name}
														className="w-[60%] h-[80px] object-cover md:w-[80%] md:h-[120px] mx-auto rounded-lg"
													/>
													<div className="px-3 h-[100px]">
														<h4 className="text-lg font-bold">
															{product.name}
														</h4>
														<div className="grid grid-cols-1">
															<p>Prix : {product.price} FCFA</p>
															<p>{product.stock} Article(s)</p>
														</div>
													</div>
												</div>
												<div className="grid grid-cols-2 gap-1 justify-between mt-4">
													<div className="text-[25px] text-center bg-yellow-500 rounded-md">
														<button
															onClick={() => handleEditProduct(product)}
															aria-label="Edit product"
															className="w-[50%] mx-auto text-white p-2"
														>
															<FaEdit />
														</button>
													</div>
													<div className="text-center bg-red-500 rounded-md">
														<button
															onClick={() => handleDeleteProduct(product._id)}
															aria-label="Delete product"
															className="w-[50%] mx-auto text-white p-2 text-[26px]"
														>
															<MdDelete />
														</button>
													</div>
												</div>
											</li>
										))}
								</ul>
							</div>
						))}
						<Pagination
							currentPage={currentPage}
							totalPages={totalPages}
							onPageChange={handlePageChange}
						/>
					</>
				)}
			</div>
		</section>
	);
};

export default ProductList;
