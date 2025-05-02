import fetchProducts from "../../lib/woocommerce"
import ProductList from "../components/ProductList"

export const revalidate = 60

export default async function Home() {
  const products = await fetchProducts()

  return (<div className="container mx-auto p-6">
    <h1 className="text-3xl font-bold mb-4">WooCommerce Products</h1>
    <ProductList products={products} />
  </div>)
}