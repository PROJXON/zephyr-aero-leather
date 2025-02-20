"use server";

// import { fetchProducts } from "../../utils/wooCommerceApi";
import Image from "next/image";

import axios from "axios";
import https from "https";

const API_URL = process.env.WOOCOMMERCE_API_URL;
const API_KEY = process.env.WOOCOMMERCE_API_KEY;
const API_SECRET = process.env.WOOCOMMERCE_API_SECRET;

// Ensure environment variables are set
console.log("API URL:", API_URL);
console.log("API KEY:", API_KEY ? "EXISTS" : "MISSING");
console.log("API SECRET:", API_SECRET ? "EXISTS" : "MISSING");


const fetchProducts = async () => {
  try {
    const response = await axios.get(
      `${process.env.WOOCOMMERCE_API_URL}/products?consumer_key=${process.env.WOOCOMMERCE_API_KEY}&consumer_secret=${process.env.WOOCOMMERCE_API_SECRET}`,
      {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false, // Ignore self-signed SSL certificate errors
        }),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error.response?.data || error.message);
    return [];
  }
};


export default async function Home() {
  let products = [];

  try {
    products = await fetchProducts();
  } catch (error) {
    console.error("Failed to fetch products in Next.js:", error);
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">WooCommerce Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow">
              <Image
                src={product.images[0]?.src || "/placeholder.jpg"} 
                alt={product.name}
                width={300}
                height={200}
                className="object-cover"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-600">
                {product.price ? `$${product.price}` : "Price not available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
