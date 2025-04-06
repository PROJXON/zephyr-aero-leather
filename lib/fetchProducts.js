import wcAPI from './wcAPI'

const fetchProducts = async () => {
  try {
    const response = await wcAPI.get("products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return [];
  }
};

export default fetchProducts;