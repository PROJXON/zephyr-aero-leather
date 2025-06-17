import { WooRequestBody } from "../types/woocommerce";

export default async function fetchWooCommerce<T = unknown>(
  endpoint: string,
  errorMessage: string = "WooCommerce request failed",
  token: string | null = null,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: WooRequestBody | null = null
): Promise<T> {
  const url = `${process.env.WOOCOMMERCE_API_URL}/wp-json/${endpoint}`;
  const auth = token
    ? `Bearer ${token}`
    : `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
      ).toString("base64")}`;

  const init: RequestInit = {
    method,
    headers: {
      Authorization: auth,
    },
  };

  if (body) {
    init.body = JSON.stringify(body);
    (init.headers as Record<string, string>)["Content-Type"] = "application/json";
  }

  const res = await fetch(url, init);
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`${errorMessage}:`, errorText);
    throw new Error(errorMessage);
  }

  return res.json() as T;
};
