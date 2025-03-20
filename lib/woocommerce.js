import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3"
});

export const fetchProducts = async () => {
  try {
    const response = await api.get("products");
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return [];
  }
};

export const fetchCategories = async () => {
  try {
    const response = await api.get("products/categories", {
      per_page: 100,
      hide_empty: false 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error.response?.data || error.message);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await api.get(`products?category=${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error.response?.data || error.message);
    return [];
  }
};

export const fetchCategoryById = async (categoryId) => {
  try {
    const response = await api.get(`products/categories/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching category ${categoryId}:`, error.response?.data || error.message);
    return null;
  }
};

export const fetchGiftProducts = async () => {
  try {
    const response = await api.get("products", {
      category: process.env.WOOCOMMERCE_GIFT_CATEGORY_ID, 
      per_page: 10 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return [];
  }
};