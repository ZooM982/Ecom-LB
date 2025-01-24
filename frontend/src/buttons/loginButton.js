import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrLogout, GrLogin } from "react-icons/gr";
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
			{auth.user ? ( 
				<button onClick={handleLogout} className="flex items-center text-white">
					<GrLogout />
				</button>
			) : (
				<Link to="/login" className="flex items-center text-white">
					<GrLogin />
				</Link>
			)}
		</div>
	);
};

export default LoginButton;
