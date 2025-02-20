import https from "https";

export default async function handler(req, res) {
  try {
    const url = `${process.env.WOOCOMMERCE_API_URL}/products?consumer_key=${process.env.WOOCOMMERCE_API_KEY}&consumer_secret=${process.env.WOOCOMMERCE_API_SECRET}`;

    console.log("Fetching from WooCommerce:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      agent: new https.Agent({ rejectUnauthorized: false }),
      cache: "no-store",
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("API Response Error:", errorData);
      return res.status(response.status).json({ error: errorData });
    }

    const data = await response.json();
    return res.status(200).json(data);
  } catch (error) {
    console.error("WooCommerce API Error:", error.message);
    return res.status(500).json({ error: error.message });
  }
}
