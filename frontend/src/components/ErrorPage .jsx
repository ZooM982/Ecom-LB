import React from "react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
	return (
		<div className="flex flex-col items-center justify-center h-[76.2vh] bg-gray-100 text-gray-800">
			<h1 className="text-9xl font-bold text-red-500 mb-4 animate-bounce">
				404
			</h1>
			<h2 className="text-2xl font-semibold mb-2">
				Oups! La page que vous cherchez est introuvable.
			</h2>
			<p className="text-gray-600 mb-6">
				Il semble que cette page n'existe pas ou a été déplacée.
			</p>
			<Link
				to="/"
				className="px-6 py-3 bg-[#001806] text-white text-lg font-semibold rounded-lg shadow-md hover:bg-[#11ef48] focus:outline-none"
			>
				Retour à l'accueil
			</Link>
		</div>
	);
};

export default ErrorPage;
