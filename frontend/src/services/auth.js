import axios from "../axios";

// Service pour créer un administrateur
export const registerAdmin = async (name, username, email, password) => {
	const adminData = { name, username, email, password };
	console.log("Données à envoyer :", adminData);
	const response = await axios.post(
		"https://harlyshop.onrender.com/api/users/create-admin",
		adminData
	);
	return response.data;
};

// Service pour inscrire un utilisateur
export const registerUser = async (username, email, password) => {
	const userData = { username, email, password };
	console.log("Données à envoyer :", userData);
	const response = await axios.post(
		"https://harlyshop.onrender.com/api/users/register",
		userData
	);
	return response.data;
};

// Service pour connecter un utilisateur
export const loginUser = async (username, password) => {
	const response = await axios.post(
		"https://harlyshop.onrender.com/api/users/login",
		{
			username,
			password,
		}
	);
	return response.data;
};
