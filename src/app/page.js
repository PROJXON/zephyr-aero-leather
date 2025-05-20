import fetchProducts from "../../lib/woocommerce";
import ProductList from "@/components/ProductList";
import CategoryMenu from "@/components/CategoryMenu";

export default async function Home({ searchParams }) {
  const category = searchParams?.category || '';
  const products = await fetchProducts({ category });

return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">WooCommerce Products</h1>
      <CategoryMenu />
      <ProductList products={products} />
    </div>
  );
}
