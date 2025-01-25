import React from "react";
import { Link } from "react-router-dom";

const CardProduit = ({ product }) => {
	return (
		<div className="bg-white shadow-md p-4 rounded-lg">
			<Link to={`/products/${product._id}`}>
				<img
					src={product.image}
					alt={product.name}
					className="w-full h-48 object-cover rounded-md mb-4"
				/>
				<h3 className="text-lg font-semibold">{product.name}</h3>
			</Link>
			<p className="text-gray-600 mb-2">{product.description}</p>
			<p className="text-blue-500 font-bold">{product.price} FCFA</p>
		</div>
	);
};

export default CardProduit;
