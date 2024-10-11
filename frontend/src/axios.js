import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ecom-lb.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json', // Ajoute cet en-tête
  },
});

export default instance;
