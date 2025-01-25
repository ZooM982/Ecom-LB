import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginButton from "../buttons/LoginButton";
import CartIcon from "../components/CartIcon";
import { useAuth } from "../context/AuthContext";
import Modal from "./Modal/Modal";
import { TiThMenu } from "react-icons/ti";
import Logo from "../Image/Icon.png";

const Header = ({ toggleCart, cartItems }) => {
	const { isAuthenticated, onLogout } = useAuth();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const location = useLocation();

	const navigationLinks = [
		{ path: "/", label: "Home" },
		{ path: "/men", label: "Men" },
		{ path: "/women", label: "Women" },
		{ path: "/kids", label: "Kids" },
		{ path: "/accessories", label: "Accessories" },
		{ path: "/sale", label: "Sale" },
	];

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	// Classe conditionnelle pour les liens actifs
	const getLinkClasses = (path) =>
		location.pathname === path
			? "bg-gray-700 border-b-4 border-white text-white"
			: "hover:underline";

	return (
		<header className="bg-[#001806] text-white p-4">
			<nav className="container mx-auto flex justify-between items-center text-center">
				<div className="text-lg font-bold">
					<Link to="/">
						<img src={Logo} alt="Logo" className="w-[60px] rounded-lg " />
					</Link>
				</div>

				{/* Navigation pour les grands écrans */}
				<div className="hidden md:flex space-x-5">
					{navigationLinks.map((link) => (
						<Link
							to={link.path}
							key={link.label}
							className={`px-3 py-2 rounded ${getLinkClasses(link.path)}`}
						>
							{link.label}
						</Link>
					))}
					{isAuthenticated && (
						<Link
							to="/dashboard/products"
							className={`px-3 py-2 rounded ${getLinkClasses(
								"/dashboard/products"
							)}`}
						>
							Dashboard
						</Link>
					)}
				</div>

				{/* Bouton du menu pour les petits écrans */}
				<button
					onClick={openModal}
					className="p-2 text-[40px] md:hidden"
					aria-label="Ouvrir le menu de navigation"
				>
					<TiThMenu />
				</button>

				{/* Boutons de droite */}
				<div className="flex items-center space-x-4 text-[25px]">
					<button onClick={toggleCart} aria-label="Ouvrir le panier">
						<CartIcon cartItems={cartItems} />
					</button>
					<LoginButton isAuthenticated={isAuthenticated} onLogout={onLogout} />
				</div>
			</nav>

			{/* Modale pour les petits écrans */}
			<Modal isOpen={isModalOpen} onClose={closeModal}>
				<div className="flex flex-col space-y-4 text-gray-700 ">
					{navigationLinks.map((link) => (
						<Link
							to={link.path}
							key={link.label}
							className={`px-3 py-2 rounded ${getLinkClasses(link.path)}`}
							onClick={closeModal}
						>
							{link.label}
						</Link>
					))}
					{isAuthenticated && (
						<Link
							to="/dashboard/products"
							className={`px-3 py-2 rounded ${getLinkClasses(
								"/dashboard/products"
							)}`}
							onClick={closeModal}
						>
							Dashboard
						</Link>
					)}
				</div>
			</Modal>
		</header>
	);
};

export default Header;
