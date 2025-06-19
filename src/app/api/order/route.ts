import { NextResponse } from "next/server";
import getCookieInfo from "../../../../lib/getCookieInfo";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

export async function GET(): Promise<Response> {
  const [token] = await getCookieInfo();
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ordersError = "Error fetching orders";

  try {
    // Fetch all orders without status filter to get completed and other statuses
    const orders = await fetchWooCommerce("wc/v3/orders?per_page=100", ordersError, token);
    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: ordersError }, { status: 500 });
  }
}
