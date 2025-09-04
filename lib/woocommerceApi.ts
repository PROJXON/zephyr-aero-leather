import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

let api: WooCommerceRestApi | null = null;

export default function getWooCommerceApi() {
  if (!api) {
    const { WOOCOMMERCE_API_URL, WOOCOMMERCE_API_KEY, WOOCOMMERCE_API_SECRET } = process.env;

    if (!WOOCOMMERCE_API_URL) throw new Error("WOOCOMMERCE_API_URL is not defined");
    if (!WOOCOMMERCE_API_KEY) throw new Error("WOOCOMMERCE_API_KEY is not defined");
    if (!WOOCOMMERCE_API_SECRET) throw new Error("WOOCOMMERCE_API_SECRET is not defined");

    api = new WooCommerceRestApi({
      url: WOOCOMMERCE_API_URL,
      consumerKey: WOOCOMMERCE_API_KEY,
      consumerSecret: WOOCOMMERCE_API_SECRET,
      version: "wc/v3" as const,
      queryStringAuth: false,
      timeout: 60000,
    });
  }
  return api;
} 