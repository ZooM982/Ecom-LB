import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { CiLogin } from "react-icons/ci";
import { useAuth } from "../context/AuthContext";

const LoginButton = () => {
	const navigate = useNavigate();
	const { auth, onLogout } = useAuth(); // Utilisation de auth pour accéder à user

	const handleLogout = () => {
		onLogout();
		navigate("/");
	};

	return (
		<div>
			{auth.user ? ( // Vérifiez si l'utilisateur est authentifié via auth.user
				<button onClick={handleLogout} className="flex items-center text-white">
					Déconnexion
				</button>
			) : (
				<Link to="/login" className="flex items-center text-white">
					<CiLogin />
				</Link>
			)}
		</div>
	);
};

export default LoginButton;
