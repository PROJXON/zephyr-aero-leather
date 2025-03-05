import fetchProducts from "../../lib/woocommerce.js";
import ProductList from "../components/ProductList";

export default async function Home() {
  const products = await fetchProducts(); 

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">WooCommerce Products</h1>
      <ProductList products={products} />
    </div>
  );
}
