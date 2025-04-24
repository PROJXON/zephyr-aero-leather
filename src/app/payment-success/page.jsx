import fetchProducts from "../../../lib/woocommerce"
import PaymentDetails from "@/components/PaymentDetails"

export default async function PaymentSuccess() {
  const products = await fetchProducts()

  return <PaymentDetails products={products} />
}