import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrLogout, GrLogin } from "react-icons/gr";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const LoginButton = () => {
	const navigate = useNavigate();
	const { auth, onLogout } = useAuth();

	const handleLogout = () => {
		const toastId = toast(
			<div className="grid grid-cols-3 gap-5">
				<span className="col-span-3">
					Êtes-vous sûr de vouloir vous déconnecter ?
				</span>
				<button
					onClick={() => {
						onLogout();
						toast.success("Déconnexion réussie !");
						toast.dismiss(toastId);
						navigate("/");
					}}
					className="ml-2 w-full text-white rounded-lg h-[30px]  bg-green-500"
				>
					Confirmer
				</button>
				<button
					onClick={() => {
						toast.dismiss(toastId);
					}}
					className="ml-2 w-full text-white rounded-lg h-[30px]  bg-red-500"
				>
					Annuler
				</button>
			</div>,
			{
				position: "top-right",
				autoClose: false,
				closeOnClick: false,
				draggable: false,
				theme: "light",
			}
		);
	};

	const handleLoginRedirect = () => {
		toast.warning("Redirection vers la page de connexion.");
		setTimeout(() => {
			navigate("/login");
		}, 3000);
	};

	return (
		<div>
			{auth.user ? (
				<button
					onClick={handleLogout}
					className="flex items-center text-white hover:text-gray-300 transition-colors"
				>
					<GrLogout />
				</button>
			) : (
				<Link
					to="#"
					onClick={handleLoginRedirect}
					className="flex items-center text-white hover:text-gray-300 transition-colors"
				>
					<GrLogin />
				</Link>
			)}
		</div>
	);
};

export default LoginButton;
