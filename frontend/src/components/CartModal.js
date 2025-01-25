import React from "react";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import { toast } from "react-toastify";

const CartModal = ({ isOpen, onRequestClose, cartItems, clearCart }) => {
	const handleWhatsApp = () => {
		if (cartItems.length === 0) {
			toast.error("Votre panier est vide, rien à envoyer.");
			return;
		}

		const message = cartItems
			.map(
				(item) =>
					`🛒 *${item.name}* (x${item.quantity})\n💰 Prix: *${
						item.price * item.quantity
					} FCFA*\n🖼️ [Voir l'image](${item.image})\nTaille: *${
						item.selectedSize
					}*\nCouleur: *${item.selectedColor}*\n`
			)
			.join("\n");

		const headerMessage = "*Voici mon panier :*\n\n";
		const phoneNumber = "+221785975058";
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
			headerMessage + message
		)}`;

		window.open(whatsappUrl, "_blank");
		clearCart();
	};

	return isOpen ? (
		<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-85 z-50">
			<div className="bg-white rounded-lg p-6 w-96 md:w-[700px]">
				<h2 className="text-lg font-bold">Votre Panier</h2>
				{cartItems.length === 0 ? (
					<p>Votre panier est vide.</p>
				) : (
					<ul className="divide-y">
						{cartItems.map((item, index) => (
							<li
								key={item.productKey}
								className="flex justify-between items-center py-2"
							>
								<img
									src={item.image}
									alt={item.name}
									className="w-12 h-12 rounded"
								/>
								<div>
									<p>{item.name}</p>
									<p>Quantité: {item.quantity}</p>
									<p>Taille: {item.selectedSize}</p>
									<p>Couleur: {item.selectedColor}</p>
								</div>
								<p>
									{item.price} * {item.quantity} = {item.price * item.quantity}{" "}
									FCFA
								</p>
							</li>
						))}
					</ul>
				)}
				<div className="flex justify-between content-center items-center text-center md:grid md:grid-cols-3 md:gap-5 mt-4">
					<button
						onClick={onRequestClose}
						className="bg-gray-700 text-white  text-center h-[40px] flex justify-between ps-3 items-center rounded"
					>
						<p className="hidden md:inline-block text-[20px] ">Fermer le panier </p>
						<span className=" text-red-500 text-[40px] mx-auto ">
							<IoClose />
						</span>
					</button>
					<button
						onClick={handleWhatsApp}
						className={`text-white  text-center h-[40px] flex justify-between ps-3 items-center rounded ${
							cartItems.length === 0
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 "
						}`}
					>
						<p className="hidden md:inline-block text-[20px] ">Payer par </p>
						<span className=" text-green-600 text-[40px] mx-auto ">
							<FaWhatsapp />
						</span>
					</button>
					<button
						onClick={clearCart}
						className=" bg-red-600 text-center h-[40px] flex justify-between ps-3 items-center text-white rounded"
					>
						<p className="hidden md:inline-block text-[20px] ">Vider le panier </p>
						<span className=" text-[40px] mx-auto ">
							<RiDeleteBin6Line />
						</span>
					</button>
				</div>
			</div>
		</div>
	) : null;
};

export default CartModal;
