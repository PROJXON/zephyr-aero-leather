import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import categoryMap from "@/utils/categoryMap";
import type { Product } from "../types/types";

const { WOOCOMMERCE_API_URL, WOOCOMMERCE_API_KEY, WOOCOMMERCE_API_SECRET } = process.env;

if (!WOOCOMMERCE_API_URL) throw new Error("WOOCOMMERCE_API_URL is not defined");
if (!WOOCOMMERCE_API_KEY) throw new Error("WOOCOMMERCE_API_KEY is not defined");
if (!WOOCOMMERCE_API_SECRET) throw new Error("WOOCOMMERCE_API_SECRET is not defined");

const api = new WooCommerceRestApi({
  url: WOOCOMMERCE_API_URL,
  consumerKey: WOOCOMMERCE_API_KEY,
  consumerSecret: WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
  queryStringAuth: true,
  timeout: 30000,
});

// Type for the categoryMap keys
type CategoryKey = keyof typeof categoryMap;

// Add genericCategory tag to each product
const mapAndTag = (products: Product[]): Product[] =>
  products.map((product) => {
    const categories = product.categories || [];

    const genericCategory =
      categories
        .map((cat: { slug: string }) =>
          (Object.entries(categoryMap) as [CategoryKey, readonly string[]][])
            .find(([_, slugs]) => slugs.includes(cat.slug))?.[0]
        )
        .find(Boolean) || "Uncategorized";

    // Transform the product data to match our Product type
    const { images, ...rest } = product;
    return {
      ...rest,
      genericCategory,
      images: images?.map((img: any) => ({
        src: img.src,
        alt: img.alt || '',
        width: img.width || 800,
        height: img.height || 800
      }))
    };
  });

interface FetchProductsOptions {
  category?: CategoryKey;
  per_page?: number;
}

// Fetch products from WooCommerce, optionally filtered by category
const fetchProducts = async ({
  category,
  per_page = 100,
}: FetchProductsOptions = {}): Promise<Product[]> => {
  try {
    const params: Record<string, any> = {
      per_page,
      status: "publish",
    };

    if (category) {
      // Get slugs for the requested category as a mutable array
      const slugs = (categoryMap[category] as readonly string[]).slice();

      if (!slugs?.length) {
        console.warn(`[WooCommerce] No category slugs mapped for: ${category}`);
        return [];
      }

      // Fetch all categories and match IDs for the slugs
      const catResponse = await api.get("products/categories?per_page=100");
      const matchedIds = catResponse.data
        .filter((cat: { slug: string }) => slugs.includes(cat.slug))
        .map((cat: { id: number }) => cat.id);

      if (!matchedIds.length) {
        console.warn(`[WooCommerce] No category IDs found for: ${category}`);
        return [];
      }

      // Build query string for products endpoint
      const query = new URLSearchParams({
        per_page: String(per_page),
        status: "publish",
        category: matchedIds.join(","),
      }).toString();
      const response = await api.get(`products?${query}`);
      return mapAndTag(response.data);
    } else {
      // Fetch all products, paginated
      let page = 1;
      let allProducts: Product[] = [];

      while (true) {
        const query = new URLSearchParams({
          ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
          page: String(page),
        }).toString();
        const res = await api.get(`products?${query}`);
        if (!res.data.length) break;

        allProducts = allProducts.concat(res.data);
        if (res.data.length < per_page) break;

        page++;
      }

      return mapAndTag(allProducts);
    }
  } catch (error: any) {
    // Improved error logging for debugging
    console.error("[WooCommerce] Error fetching products:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return [];
  }
};

export default fetchProducts;
