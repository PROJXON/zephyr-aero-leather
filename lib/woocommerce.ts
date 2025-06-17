import categoryMap from "../src/utils/categoryMap";
import type { Product, CategoryKey, FetchProductsOptions } from "../types/types";
import type { WooCommerceCategory } from "../types/woocommerce";
import getWooCommerceApi from "./woocommerceApi";

const api = getWooCommerceApi();

const mapAndTag = (products: Product[]): Product[] =>
  products.map((product) => {
    const categories = product.categories || [];
    const genericCategory =
      categories
        .map((cat: WooCommerceCategory) =>
          (Object.entries(categoryMap) as [CategoryKey, readonly string[]][])
            .find(entry => entry[1].includes(cat.slug))?.[0]
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

      // @ts-expect-error - Custom type definition supports generic parameters
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
      // @ts-expect-error - Custom type definition supports generic parameters
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
        // @ts-expect-error - Custom type definition supports generic parameters
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