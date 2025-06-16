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

const mapAndTag = (products) =>
  products.map((product) => {
    const categories = product.categories || [];
    const genericCategory =
      categories
        .map((cat) =>
          Object.entries(categoryMap).find(([_, slugs]) =>
            slugs.includes(cat.slug)
          )?.[0]
        )
        .find(Boolean) || "Uncategorized";

    return {
      ...product,
      genericCategory,
    };
  });

const fetchProducts = async ({ category, per_page = 100 } = {}) => {
  try {
    const params = {
      per_page,
      status: "publish",
    };

    if (category) {
      const slugs = categoryMap[category];
      if (!slugs?.length) {
        console.warn(`No category slugs mapped for: ${category}`);
        return [];
      }

      const catResponse = await api.get("products/categories", { per_page: 100 });
      const matchedIds = catResponse.data
        .filter((cat) => slugs.includes(cat.slug))
        .map((cat) => cat.id);

      if (!matchedIds.length) {
        console.warn(`No category IDs found for: ${category}`);
        return [];
      }

      params.category = matchedIds.join(",");
      const response = await api.get("products", params);
      return mapAndTag(response.data);
    } else {
      // Pagination: fetch all products
      let page = 1;
      let allProducts = [];

      while (true) {
        const res = await api.get("products", { ...params, page });
        if (!res.data.length) break;

        allProducts = allProducts.concat(res.data);
        if (res.data.length < per_page) break;
        page++;
      }

      return mapAndTag(allProducts);
    }
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
