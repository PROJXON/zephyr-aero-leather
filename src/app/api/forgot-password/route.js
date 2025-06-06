import { NextResponse } from "next/server";
import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

const api = new WooCommerceRestApi({
  url: process.env.WOOCOMMERCE_API_URL,
  consumerKey: process.env.WOOCOMMERCE_API_KEY,
  consumerSecret: process.env.WOOCOMMERCE_API_SECRET,
  version: "wc/v3",
});

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user exists in WooCommerce
    const { data: users } = await api.get("customers", {
      email: email,
    });

    if (!users || users.length === 0) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Store reset token in user meta
    // First, get existing meta data
    const { data: existingUser } = await api.get(`customers/${users[0].id}`);
    const existingMetaData = existingUser.meta_data || [];
    
    // Update or add our new meta data
    const updatedMetaData = [
      ...existingMetaData.filter(meta => 
        meta.key !== 'reset_token' && meta.key !== 'reset_token_expiry'
      ),
      {
        key: "reset_token",
        value: resetToken,
      },
      {
        key: "reset_token_expiry",
        value: resetTokenExpiry.toISOString(),
      }
    ];

    await api.put(`customers/${users[0].id}`, {
      meta_data: updatedMetaData
    });

    // Send reset email using Resend
    const resetUrl = `${process.env.PAGE_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: "Reset Your Password - Zephyr Aero Leather",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #605137; margin-bottom: 20px;">Reset Your Password</h1>
          <p style="color: #333; line-height: 1.6;">You requested to reset your password for your Zephyr Aero Leather account.</p>
          <p style="color: #333; line-height: 1.6;">Click the button below to reset your password:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #605137; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
          </div>
          <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
          <p style="color: #666; font-size: 14px;">If you didn't request this password reset, please ignore this email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #999; font-size: 12px;">This is an automated message, please do not reply to this email.</p>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Password reset email sent",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
