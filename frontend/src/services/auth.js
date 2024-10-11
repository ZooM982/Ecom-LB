import axios from '../axios';

// Le service d'inscription
export const registerUser = async (username, email, password) => {
  const response = await axios.post('https://ecom-lb.onrender.com/api/users/register', {
    username,  // Mappé avec "name" côté backend
    email,
    password,
  });
  return response.data;
};


// Le service de connexion
export const loginUser = async (username, password) => {
  const response = await axios.post('https://ecom-lb.onrender.com/api/users/login', { username, password });
  return response.data; // Renvoie le token ou d'autres données nécessaires
};

