import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const wcAPI = new WooCommerceRestApi({
    url: process.env.WOOCOMMERCE_API_URL,
    consumerKey: process.env.WOOCOMMERCE_API_KEY,
    consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
    version: "wc/v3"
});

export default wcAPI