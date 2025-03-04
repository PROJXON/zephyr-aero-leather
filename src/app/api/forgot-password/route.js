import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL, // 
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
});

export async function POST(req) {
  const { email } = await req.json();

  try {
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    const response = await api.post("customers/reset_password", { email });

    if (response.status === 200) {
      return new Response(
        JSON.stringify({ success: true }),
        { status: 200 }
      );
    } else {
      return new Response(
        JSON.stringify({ error: "Failed to send reset email" }),
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error in password reset:", error);
    return new Response(
      JSON.stringify({
        error: error.response?.data?.message || "Internal server error",
      }),
      { status: 500 }
    );
  }
}
