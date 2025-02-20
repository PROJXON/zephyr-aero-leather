import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const API_KEY = import.meta.env.VITE_CONSUMER_KEY;
const API_SECRET = import.meta.env.VITE_CONSUMER_SECRET;

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}products`, {
      auth: {
        username: API_KEY,
        password: API_SECRET,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};