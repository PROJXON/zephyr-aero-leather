import fetchProducts from "../../../../lib/woocommerce";
import ProductList from "../../../components/ProductList";

export default async function CategoryPage({ params }) {
  const { slug } = params;
  const products = await fetchProducts({ category: slug });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 capitalize">
        Products in "{slug}" category
      </h1>

      {products.length > 0 ? (
        <ProductList products={products} />
      ) : (
        <p>No products found in this category.</p>
      )}
    </div>
  );
}
