import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

// Verificar que las variables de entorno estén definidas
if (!process.env.WOOCOMMERCE_API_URL) {
  throw new Error("WOOCOMMERCE_API_URL is not defined");
}
if (!process.env.WOOCOMMERCE_API_KEY) {
  throw new Error("WOOCOMMERCE_API_KEY is not defined");
}
if (!process.env.WOOCOMMERCE_API_SECRET) {
  throw new Error("WOOCOMMERCE_API_SECRET is not defined");
}

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  queryStringAuth: true, // Usar query string auth en lugar de headers
  timeout: 30000, // 30 segundos de timeout
});

const fetchProducts = async () => {
  try {
    console.log("Fetching products from:", process.env.WOOCOMMERCE_API_URL);
    const response = await api.get("products", {
      per_page: 100, // Limitar a 100 productos por página
      status: "publish", // Solo productos publicados
    });
    
    if (!response.data) {
      throw new Error("No data received from WooCommerce API");
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: process.env.WOOCOMMERCE_API_URL,
    });
    return [];
  }
};

export default fetchProducts;