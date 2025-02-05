import React from "react";
import axios from "axios";
import { PiPaypalLogoLight } from "react-icons/pi";

const PaymentButton = ({ orderId, name, email, amount }) => {
	const handlePayment = async () => {
		try {
			const response = await axios.post(
				"https://haurly-shop.onrender.com/api/payments",
				{
					orderId,
					name,
					email,
					amount,
				}
			);

			if (response.data.redirectUrl) {
				window.location.href = response.data.redirectUrl;
			} else {
				alert("Erreur lors du paiement !");
			}
		} catch (error) {
			console.error("Erreur paiement:", error);
			alert("Une erreur s'est produite. Réessayez plus tard.");
		}
	};

	return (
		<button
			onClick={handlePayment}
			className="bg-blue-600 text-white text-center p-2 h-[40px] flex justify-between ps-3 items-center rounded"
		>
			<p className="hidden md:inline-block text-[20px]">Payer par PayDunya</p>
			<span className="text-white text-[40px] mx-auto">
				<PiPaypalLogoLight />
			</span>
		</button>
	);
};

export default PaymentButton;
