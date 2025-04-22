import { cookies } from "next/headers"

export default async function getCookieInfo() {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value
    const userCookie = cookieStore.get("userData")?.value
    return [token, userCookie]
}