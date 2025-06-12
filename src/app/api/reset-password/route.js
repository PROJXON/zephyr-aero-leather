import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
});

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json(
        { error: "Token and password are required" },
        { status: 400 }
      );
    }

    // Find user with matching reset token
    const { data: users } = await api.get("customers", {
      per_page: 100 // Get more users to ensure we find the right one
    });

    // Find user with matching reset token in their meta data
    const user = users.find(user => 
      user.meta_data?.some(meta => 
        meta.key === 'reset_token' && meta.value === token
      )
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired reset token" },
        { status: 400 }
      );
    }
    
    // Find the reset token expiry in meta data
    const resetTokenExpiry = user.meta_data.find(
      (meta) => meta.key === "reset_token_expiry"
    )?.value;
    
    if (!resetTokenExpiry || new Date(resetTokenExpiry) < new Date()) {
      return NextResponse.json(
        { error: "Reset token has expired" },
        { status: 400 }
      );
    }

    // Update password and clear reset token
    const updatedMetaData = user.meta_data.filter(meta => 
      meta.key !== 'reset_token' && meta.key !== 'reset_token_expiry'
    );

    await api.put(`customers/${user.id}`, {
      password,
      meta_data: updatedMetaData
    });

    return NextResponse.json({
      success: true,
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);
    return NextResponse.json(
      { error: "Failed to reset password" },
      { status: 500 }
    );
  }
} 