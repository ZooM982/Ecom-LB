import axios from '../axios';

export const registerUser = async (username, email, password) => {
  const userData = { username, email, password }; // Crée l'objet à envoyer
  console.log('Données à envoyer :', userData); // Affiche les données
  const response = await axios.post('https://ecom-lb.onrender.com/api/users/register', userData);
  return response.data;
};


// Le service de connexion
export const loginUser = async (username, password) => {
  const response = await axios.post('https://ecom-lb.onrender.com/api/users/login', { username, password });
  return response.data; // Renvoie le token ou d'autres données nécessaires
};
