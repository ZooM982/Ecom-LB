import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

const Register = () => {
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const { onLogin } = useAuth();
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("Données à envoyer:", { username, email, password });
		try {
			const response = await registerUser(username, email, password);

			if (response.user) {
				onLogin(response.token || "", response.user); 
				alert(response.message || "Inscription réussie !");
				navigate("/"); 
			} else {
				setError(response.message || "Inscription échouée.");
			}
		} catch (error) {
			console.error(error);
			setError("Erreur lors de l'inscription. Veuillez réessayer.");
		}
	};

	return (
		<div className="flex items-center justify-center h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold text-center mb-6">Créer un compte</h2>
				{error && <p className="text-red-500 text-center mb-4">{error}</p>}
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Nom d'utilisateur
						</label>
						<input
							type="text"
							placeholder="Nom d'utilisateur"
							value={username}
							onChange={(e) => setUsername(e.target.value)}
							required
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
						/>
					</div>
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700">
							Votre email
						</label>
						<input
							type="email"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
						/>
					</div>
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700">
							Mot de passe
						</label>
						<input
							type="password"
							placeholder="Mot de passe"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
						/>
					</div>
					<button
						type="submit"
						className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition duration-200"
					>
						S'inscrire
					</button>
				</form>
				<p className="mt-4 text-sm text-center">
					Déjà un compte ?{" "}
					<Link to="/login" className="text-blue-600 hover:underline">
						Connectez-vous
					</Link>
				</p>
			</div>
		</div>
	);
};

export default Register;
