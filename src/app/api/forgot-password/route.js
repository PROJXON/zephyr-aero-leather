import wcAPI from '../../../../lib/wcAPI'

export async function POST(req) {
  const { email } = await req.json();

  try {
    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400 }
      );
    }

    const response = await wcAPI.post("customers/reset_password", { email });

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
