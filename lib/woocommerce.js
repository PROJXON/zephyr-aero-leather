import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import categoryMap from "../src/utils/categoryMap";

if (!process.env.WOOCOMMERCE_API_URL) throw new Error("WOOCOMMERCE_API_URL is not defined");
if (!process.env.WOOCOMMERCE_API_KEY) throw new Error("WOOCOMMERCE_API_KEY is not defined");
if (!process.env.WOOCOMMERCE_API_SECRET) throw new Error("WOOCOMMERCE_API_SECRET is not defined");

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  queryStringAuth: true,
  timeout: 30000,
});

const fetchProducts = async ({ category } = {}) => {
  try {
    const params = {
      per_page: 100,
      status: "publish",
    };

    if (category) {
      // Convert generic category into WooCommerce slugs
      const slugs = categoryMap[category];

      if (!slugs || slugs.length === 0) {
        console.warn(`No category slugs mapped for: ${category}`);
        return [];
      }

      // Fetch WooCommerce categories and find matching IDs
      const catResponse = await api.get("products/categories", { per_page: 100 });
      const allCategories = catResponse.data;

      const matchedIds = allCategories
        .filter((cat) => slugs.includes(cat.slug))
        .map((cat) => cat.id);

      if (matchedIds.length === 0) {
        console.warn(`No category IDs found for: ${category}`);
        return [];
      }

      params.category = matchedIds.join(",");
    }

    const response = await api.get("products", params);

    if (!response.data) {
      throw new Error("No product data received");
    }

    // Add genericCategory field to each product
    const mappedProducts = response.data.map((product) => {
      const categories = product.categories || [];

      const genericCategory =
        categories.map((cat) => {
          // Reverse-map each WooCommerce slug to the generic key
          return Object.entries(categoryMap).find(([_, slugs]) =>
            slugs.includes(cat.slug)
          )?.[0];
        }).find(Boolean) || "Uncategorized";

      return {
        ...product,
        genericCategory,
      };
    });

    return mappedProducts;
  } catch (error) {
    console.error("Error fetching products:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

export default fetchProducts;