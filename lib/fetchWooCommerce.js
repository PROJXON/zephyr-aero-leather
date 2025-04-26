export default async function fetchWooCommerce(
    endpoint,
    errorMessage,
    token = null,
    method = "GET",
    body = null
) {
    const url = `${process.env.WOOCOMMERCE_API_URL}/wp-json/${endpoint}`
    const auth = token ? `Bearer ${token}` : `Basic ${Buffer.from(
        `${process.env.WOOCOMMERCE_API_KEY}:${process.env.WOOCOMMERCE_API_SECRET}`
    ).toString("base64")}`
    let init = {
        method,
        headers: { Authorization: auth }
    }

    if (body) {
        init.body = JSON.stringify(body)
        init.headers["Content-Type"] = "application/json"
    }

    const res = await fetch(url, init)
    if (!res.ok) {
        const errorText = await res.text()
        console.error(errorMessage + ":", errorText)
        throw new Error(errorMessage)
    }
    return await res.json()
}