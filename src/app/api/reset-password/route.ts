import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { ResetPasswordRequest } from "../../../../types/types";
import type { WooCustomer, WooCustomerMeta } from "../../../../types/woocommerce";
import getWooCommerceApi from "../../../../lib/woocommerceApi";
import fetchWooCommerce from "../../../../lib/fetchWooCommerce";

const api = getWooCommerceApi();

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
        (meta: WooCustomerMeta) => meta.key === "reset_token" && meta.value === token
      )
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }

    const resetTokenExpiry = user.meta_data?.find(
      (meta: WooCustomerMeta) => meta.key === "reset_token_expiry"
    )?.value;

    if (!resetTokenExpiry || new Date(resetTokenExpiry as string) < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    const updatedMetaData =
      user.meta_data?.filter(
        (meta: WooCustomerMeta) => meta.key !== "reset_token" && meta.key !== "reset_token_expiry"
      ) || [];

    await api.put(`customers/${user.id}`, {
      password,
      meta_data: updatedMetaData,
    });

    // Get the updated user data after password reset
    const updatedUser = await fetchWooCommerce(`wc/v3/customers/${user.id}`, "Failed to fetch updated user data");

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
      user: updatedUser,
    });
  } catch (error: unknown) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
}