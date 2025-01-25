// src/components/CartModal.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaWhatsapp } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
const CartModal = ({ isOpen, onRequestClose, cartItems, clearCart }) => {
	// const navigate = useNavigate();
	const { auth } = useAuth();

	// const handleCheckout = () => {
	// 	if (!auth.token) {
	// 		alert("Veuillez vous connecter pour procéder au paiement.");
	// 		navigate("/login");
	// 	} else {
	// 		alert("Redirection vers la page de paiement...");
	// 	}
	// };

const handleWhatsApp = () => {
	if (cartItems.length === 0) {
		alert("Votre panier est vide, rien à envoyer.");
		return;
	}

	// Formater le contenu du panier
	const message = cartItems
		.map(
			(item) =>
				`🛒 *${item.name}* (x${item.quantity})\n💰 Prix: *${
					item.price * item.quantity
				} FCFA*\n🖼️ [Voir l'image](${item.image})\n`
		)
		.join("\n");

	// Ajouter un message d'en-tête
	const headerMessage = "*Voici mon panier :*\n\n";

	// Remplace le numéro par celui que tu veux
	const phoneNumber = "+221785975058";
	const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
		headerMessage + message
	)}`;

	// Ouvrir WhatsApp
	window.open(whatsappUrl, "_blank");

	// Effacer le contenu du panier
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
						{cartItems.length === 0 ? (
							<p>Votre panier est vide.</p>
						) : (
							<ul className="divide-y">
								{cartItems.map((item, index) => (
									<li
										key={index}
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
										</div>
										<p>
											{item.price} * {item.quantity} ={" "}
											{item.price * item.quantity} FCFA
										</p>
									</li>
								))}
							</ul>
						)}
					</ul>
				)}
				<div className="grid grid-cols-3 gap-5 mt-4">
					<button
						onClick={onRequestClose}
						className="bg-gray-300 grid grid-cols-2 gap-2 w-full rounded"
					>
						<p>Fermer le panier </p>
						<span>
							<IoClose />
						</span>
					</button>
					{/* <button
						onClick={handleCheckout}
						className={`rounded text-white ${
							cartItems.length === 0
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-600 hover:bg-blue-700"
						}`}
						aria-label="Procéder au paiement"
						disabled={cartItems.length === 0}
					>
						Payer
					</button> */}
					<button
						onClick={handleWhatsApp}
						className={`text-whitegrid grid-cols-2 gap-2 w-full  rounded ${
							cartItems.length === 0
								? "bg-gray-400 cursor-not-allowed"
								: "bg-green-600 "
						}`}
					>
						<p>Payer vers </p>
						<span><FaWhatsapp /></span>
					</button>
					<button
						onClick={clearCart}
						className="bg-red-600 grid grid-cols-2 gap-2 w-full text-white rounded"
					>
						<p className="w-full">Vider le panier </p>
						<span className="w-full"><RiDeleteBin6Line /></span>
					</button>
				</div>
			</div>
		</div>
	) : null;
};

export default CartModal;
