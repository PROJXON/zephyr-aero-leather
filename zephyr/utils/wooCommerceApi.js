import https from "https";

export async function fetchProducts() {
  try {
    const url = "https://zephyr.local/wp-json/wc/v3/products?consumer_key=ck_a18c3985d68572523626d44b44a5d886ee11b48a&consumer_secret=cs_d7a3f18df7ea215dd9079d0d8ef445da561238b0";
    
    console.log("Fetching from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      agent: new https.Agent({ rejectUnauthorized: false }), // Forces Node.js fetch
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      throw new Error(`Failed to fetch products: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("API Response:", data);
    return data;
  } catch (error) {
    console.error("WooCommerce API Error:", error.message);
    throw new Error(error);
  }
}
