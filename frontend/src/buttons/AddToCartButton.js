import React, { useState } from "react";

const AddToCartButton = ({ product, addToCart }) => {
	const [quantity, setQuantity] = useState(1);

	const handleIncrease = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const handleDecrease = () => {
		setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	};

	const handleAddToCart = () => {
		addToCart({ ...product, quantity }); // Passer la quantité correcte
		setQuantity(1); // Réinitialiser la quantité après l'ajout
	};

	return (
		<div className="flex items-center">
			<button
				onClick={handleDecrease}
				className="bg-gray-300 text-black py-1 px-2 rounded-l-md"
				aria-label="Diminuer la quantité"
			>
				-
			</button>
			<input
				type="number"
				value={quantity}
				onChange={(e) => setQuantity(Math.max(1, e.target.value))}
				className="w-12 text-center border border-gray-300 rounded-md mx-1"
			/>
			<button
				onClick={handleIncrease}
				className="bg-gray-300 text-black py-1 px-2 rounded-r-md"
				aria-label="Augmenter la quantité"
			>
				+
			</button>
			<button
				onClick={handleAddToCart}
				className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 ml-2"
			>
				Add to Cart
			</button>
		</div>
	);
};

export default AddToCartButton;
