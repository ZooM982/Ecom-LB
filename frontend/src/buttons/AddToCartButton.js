import React, { useState } from "react";
import { MdShoppingCart } from "react-icons/md";
import { toast } from "react-toastify";

const AddToCartButton = ({ product, addToCart }) => {
	const [quantity, setQuantity] = useState(1);
	const [selectedSize, setSelectedSize] = useState("");
	const [selectedColor, setSelectedColor] = useState("");

	const handleIncrease = () => {
		setQuantity((prevQuantity) => prevQuantity + 1);
	};

	const handleDecrease = () => {
		setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
	};

	const handleAddToCart = () => {
		// Vérification si la taille et la couleur sont sélectionnées avant d'ajouter
		if (!selectedSize || !selectedColor) {
			toast.error("Veuillez sélectionner une taille et une couleur.");
			return;
		}
		toast.success("Article ajouter au panier")

		// Passer la taille, la couleur et la quantité dans le panier
		addToCart({ ...product, quantity, selectedSize, selectedColor });
		setQuantity(1); 
		setSelectedSize(""); 
		setSelectedColor(""); 
	};

	return (
		<div className="grid grid-cols-2 gap-5 items-center space-y-4 md:space-y-0">
			{/* Sélecteur de taille */}
			<div className="grid items-center">
				<label htmlFor="size" className="text-lg">
					Taille:
				</label>
				<select
					id="size"
					value={selectedSize}
					onChange={(e) => setSelectedSize(e.target.value)}
					className="p-2 border border-gray-300 w-[95%] rounded-md"
				>
					<option value="">Sélectionner</option>
					{product.sizes?.map((size, index) => (
						<option key={index} value={size}>
							{size}
						</option>
					))}
				</select>
			</div>

			{/* Sélecteur de couleur */}
			<div className="grid items-center">
				<label htmlFor="color" className="text-lg">
					Couleur:
				</label>
				<select
					id="color"
					value={selectedColor}
					onChange={(e) => setSelectedColor(e.target.value)}
					className="p-2 border border-gray-300 w-[100%]  rounded-md"
				>
					<option value="">Sélectionner</option>
					{product.colors?.map((color, index) => (
						<option key={index} value={color}>
							{color}
						</option>
					))}
				</select>
			</div>

			{/* Quantité */}
			<div className="flex items-center space-x-2 w-[100%]">
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
					className="w-12 text-center border border-gray-300 w-[100%] rounded-md"
				/>
				<button
					onClick={handleIncrease}
					className="bg-gray-300 text-black py-1 px-2 rounded-r-md"
					aria-label="Augmenter la quantité"
				>
					+
				</button>
			</div>

			{/* Bouton Ajouter au panier */}
			<button
				onClick={handleAddToCart}
				className="bg-green-500 text-white py-2 px-4 rounded-full hover:bg-blue-600 transition-all duration-300 ease-in-out flex items-center w-[50%]"
			>
				<MdShoppingCart size={24} />
			</button>
		</div>
	);
};

export default AddToCartButton;
