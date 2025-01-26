import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import BackButton from "../buttons/Backbutton";

const Login = () => {
	const { onLogin } = useAuth();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState("");
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const { token, user } = await loginUser(username, password);
			onLogin(token, user);

			if (user.role === "admin") {
				toast.success(
					"Connexion réussie! Redirection vers le tableau de bord admin."
				);
				navigate("/dashboard/products");
			} else if (user.role === "user") {
				toast.success("Connexion réussie! Redirection vers la page d'accueil.");
				navigate("/");
			} else {
				setError("Rôle inconnu, contactez l'administrateur.");
			}

			setUsername("");
			setPassword("");
			setError("");
		} catch (error) {
			console.error(error);
			setError(
				"Erreur lors de la connexion. Veuillez vérifier vos identifiants."
			);
			toast.error("Erreur de connexion : identifiants incorrects.");
		}
	};

	return (
		<section>
			<BackButton />
			<div className="flex items-center justify-center h-screen bg-gray-100 px-3">
				<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
					<h2 className="text-2xl font-bold text-center mb-6">Se connecter</h2>
					{error && <p className="text-red-500 text-center mb-4">{error}</p>}
					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-sm font-medium text-gray-700">
								Email
							</label>
							<input
								type="email"
								placeholder="Email"
								value={username}
								onChange={(e) => setUsername(e.target.value)}
								required
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#001806]"
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
								className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-[#001806]"
							/>
						</div>
						<button
							type="submit"
							className="w-full bg-[#001806] text-white p-2 rounded-md hover:bg-[#00006] transition duration-200"
						>
							Se connecter
						</button>
					</form>
					<p className="mt-4 text-sm text-center">
						Pas de compte ?{" "}
						<Link to="/register" className="text-[#001806] hover:underline">
							Inscrivez-vous
						</Link>
					</p>
				</div>
			</div>
		</section>
	);
};

export default Login;
