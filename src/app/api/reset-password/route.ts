import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import type { NextRequest } from "next/server";
import type { ResetPasswordRequest,  WooCustomer } from "../../../../types/types";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL!,
  consumerKey: process.env.WOOCOMMERCE_API_KEY!,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET!,
  version: "wc/v3",
});

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { token, password }: ResetPasswordRequest = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    const { data: users }: { data: WooCustomer[] } = await api.get(
      "customers?per_page=100"
    );

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

    const resetTokenExpiry = user.meta_data?.find(
      (meta) => meta.key === "reset_token_expiry"
    )?.value;

    if (!resetTokenExpiry || new Date(resetTokenExpiry as string) < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

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
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}