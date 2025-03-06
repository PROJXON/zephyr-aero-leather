import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3"
});

const fetchProducts = async () => {
  try {
    const response = await api.get("products");
    return response.data;
  } catch (error) {
    console.log("Error fetching products:", error.response?.data || error.message);
    return [];
  }
};

export default fetchProducts;