import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://ecom-lb.onrender.com/api', 
});

export default instance;
