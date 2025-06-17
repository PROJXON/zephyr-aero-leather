import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import categoryMap from "../src/utils/categoryMap";
import type { Product, Category, CategoryKey, FetchProductsOptions } from "../types/types";
import type { WooCommerceCategory } from "../types/woocommerce";

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
  timeout: 60000,
});

const mapAndTag = (products: Product[]): Product[] =>
  products.map((product) => {
    const categories = product.categories || [];
    const genericCategory =
      categories
        .map((cat: WooCommerceCategory) =>
          (Object.entries(categoryMap) as [CategoryKey, readonly string[]][])
            .find(([_, slugs]) => slugs.includes(cat.slug))?.[0]
        )
        .find(Boolean) || "Uncategorized";

    return {
      ...product,
      genericCategory,
    };
  });

const fetchProducts = async ({
  category,
  per_page = 100,
}: FetchProductsOptions = {}): Promise<Product[]> => {
  try {
    const params: Record<string, string | number> = {
      per_page,
      status: "publish",
    };

    if (category) {
      const slugs = (categoryMap[category] as readonly string[]).slice();

      if (!slugs?.length) {
        console.warn(`[WooCommerce] No category slugs mapped for: ${category}`);
        return [];
      }

      const catResponse = await api.get<WooCommerceCategory[]>("products/categories?per_page=100");
      const matchedIds = catResponse.data
        .filter((cat: WooCommerceCategory) => slugs.includes(cat.slug))
        .map((cat: WooCommerceCategory) => cat.id);

      if (!matchedIds.length) {
        console.warn(`[WooCommerce] No category IDs found for: ${category}`);
        return [];
      }

      const query = new URLSearchParams({
        per_page: String(per_page),
        status: "publish",
        category: matchedIds.join(","),
      }).toString();
      const response = await api.get<Product[]>(`products?${query}`);
      return mapAndTag(response.data);
    } else {
      let page = 1;
      let allProducts: Product[] = [];

      while (true) {
        const query = new URLSearchParams({
          ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
          page: String(page),
        }).toString();
        const res = await api.get<Product[]>(`products?${query}`);
        if (!res.data.length) break;

        allProducts = allProducts.concat(res.data);
        if (res.data.length < per_page) break;

        page++;
      }

      return mapAndTag(allProducts);
    }
  } catch (error: unknown) {
    const err = error as { message?: string; response?: { data?: unknown; status?: number } };
    console.error("[WooCommerce] Error fetching products:", {
      message: err.message,
      response: err.response?.data,
      status: err.response?.status,
    });
    return [];
  }
};

export default fetchProducts;