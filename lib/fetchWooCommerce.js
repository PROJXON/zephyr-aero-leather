export default async function fetchWooCommerce(endpoint, errorMessage, token = null) {
    const url = `${process.env.WOOCOMMERCE_API_URL}/wp-json/${endpoint}`
    const auth = token ? `Bearer ${token}` : `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`

    const res = await fetch(url, { headers: { Authorization: auth } })
    if (!res.ok) throw new Error(errorMessage)
    return res.json()
}