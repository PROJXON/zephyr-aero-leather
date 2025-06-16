import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { NextRequest } from "next/server";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL!,
  consumerKey: process.env.WOOCOMMERCE_API_KEY!,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET!,
  version: "wc/v3",
});

interface WooCustomerMeta {
  id?: number;
  key: string;
  value: any;
}

interface WooCustomer {
  id: number;
  email: string;
  meta_data?: WooCustomerMeta[];
  [key: string]: any;
}

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { token, password }: { token: string; password: string } =
      await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Find user with matching reset token
    const { data: users }: { data: WooCustomer[] } = await api.get(
      "customers?per_page=100"
    );

    // Find user with matching reset token in their meta data
    const user = users.find((user) =>
      user.meta_data?.some(
        (meta) => meta.key === "reset_token" && meta.value === token
      )
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    // Find the reset token expiry in meta data
    const resetTokenExpiry = user.meta_data?.find(
      (meta) => meta.key === "reset_token_expiry"
    )?.value;

    if (!resetTokenExpiry || new Date(resetTokenExpiry) < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const updatedMetaData =
      user.meta_data?.filter(
        (meta) => meta.key !== "reset_token" && meta.key !== "reset_token_expiry"
      ) || [];

    await api.put(`customers/${user.id}`, {
      password,
      meta_data: updatedMetaData,
    });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error: any) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}