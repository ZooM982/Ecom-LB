import axios from '../axios';

export const getProducts = async () => {
  const response = await axios.get('/products', {timeout: 5000});
  return response.data;
};

export const addProduct = async (product) => {
  const response = await axios.post('/products', product);
  return response.data;
};
