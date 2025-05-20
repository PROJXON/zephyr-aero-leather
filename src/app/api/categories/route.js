import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import categoryMap from "../../../utils/categoryMap";


const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  queryStringAuth: true,
});

export default async function fetchProducts({ category } = {}) {
  try {
    const params = {
      per_page: 100,
    };

    if (category) {
      params.category = category;
    }

    const response = await api.get("products", { params });
    return response.data;
  } catch (err) {
    console.error("Failed to fetch products:", err.message);
    return [];
  }
}

// Named export for the GET method
export async function GET() {
  // Build an array of generic categories from categoryMap keys
  const categories = Object.keys(categoryMap).map((key) => ({
    name: key,
    slug: key.toLowerCase().replace(/\s+/g, "-"), // slugify: e.g. "Accessories" -> "accessories"
    label: key,
  }));

  return new Response(JSON.stringify(categories), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}