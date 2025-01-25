import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ManageUsers.css";
import { toast } from "react-toastify";

const ManageUsers = () => {
	const [users, setUsers] = useState([]);
	const [loading, setLoading] = useState(true);
	const [newUser, setNewUser] = useState({
		username: "", 
		email: "",
		password: "",
		role: "user",
	});

	useEffect(() => {
		const fetchUsers = async () => {
			try {
				const response = await axios.get(
					"https://haurly-shop.onrender.com/api/users"
				);
				console.log("Utilisateurs récupérés :", response.data); 
				setUsers(response.data);
			} catch (error) {
				console.error(
					"Erreur lors de la récupération des utilisateurs :",
					error
				);
			} finally {
				setLoading(false);
			}
		};
		fetchUsers();
	}, []);

	const handleAddUser = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				"https://haurly-shop.onrender.com/api/users/register",
				newUser
			);
			toast.success("Utilisateur ajouté !");
			setUsers([...users, response.data.user]); 
			setNewUser({ username: "", email: "", password: "", role: "user" });
		} catch (error) {
			console.error(error);
			toast.error(
				`Erreur lors de l'ajout de l'utilisateur : ${
					error.response?.data?.message || "Erreur inconnue"
				}`
			);
		}
	};

	const handleDeleteUser = async (userId) => {
		console.log("ID utilisateur à supprimer :", userId);
		try {
			await axios.delete(
				`https://haurly-shop.onrender.com/api/users/${userId}`
			);
			setUsers(users.filter((user) => user._id !== userId));
			toast.success("Utilisateur supprimé !");
		} catch (error) {
			console.error(error);
			toast.error("Erreur lors de la suppression.");
		}
	};

	if (loading) return <div>Chargement...</div>;

	return (
		<section className="min-h-[81.3vh] md:min-h-[79.3vh] ">
			<div className="manage-users md:flex ">
				<div className="md:w-[45%] mx-auto w-full">
					<h2>Gestion des utilisateurs</h2>
					<form onSubmit={handleAddUser} className="user-form">
						<input
							type="text"
							placeholder="Nom de l'utilisateur"
							value={newUser.username} 
							onChange={(e) =>
								setNewUser({ ...newUser, username: e.target.value })
							}
							required
							className="input-field"
						/>
						<input
							type="email"
							placeholder="Email"
							value={newUser.email}
							onChange={(e) =>
								setNewUser({ ...newUser, email: e.target.value })
							}
							required
							className="input-field"
						/>
						<input
							type="password"
							placeholder="Mot de passe"
							value={newUser.password}
							onChange={(e) =>
								setNewUser({ ...newUser, password: e.target.value })
							}
							required
							className="input-field"
						/>
						<select
							value={newUser.role}
							onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
							className="input-field"
						>
							<option value="user">Utilisateur</option>
							<option value="admin">Admin</option>
						</select>
						<button type="submit" className="add-user-button">
							Ajouter utilisateur
						</button>
					</form>
				</div>
				<div className="md:w-[45%] mx-auto w-full">
					<h3>Liste des utilisateurs</h3>
					<ul className="user-list">
						{users.map((user) => (
							<li key={user._id} className="user-item md:flex">
								<div>
									<strong>{user.username}</strong> <br />
									{user.email} - <span className="role-label">{user.role}</span>
								</div>
								<button
									onClick={() => handleDeleteUser(user._id)}
									className="delete-button"
								>
									Supprimer
								</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		</section>
	);
};

export default ManageUsers;
