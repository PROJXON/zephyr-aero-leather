import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_URL;
const API_KEY = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_KEY;
const API_SECRET = process.env.NEXT_PUBLIC_WOOCOMMERCE_API_SECRET;

// Ensure environment variables are set
console.log("API URL:", API_URL);
console.log("API KEY:", API_KEY ? "EXISTS" : "MISSING");
console.log("API SECRET:", API_SECRET ? "EXISTS" : "MISSING");

// Generate Base64 authorization header
const authHeader = `Basic ${Buffer.from(`${API_KEY}:${API_SECRET}`).toString("base64")}`;
console.log("Auth Header:", authHeader); // Log the full auth header

const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: authHeader,
    "Content-Type": "application/json",
  },
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
