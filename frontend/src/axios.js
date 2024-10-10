import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Remplace par l'URL de ton backend
});

export default instance;
