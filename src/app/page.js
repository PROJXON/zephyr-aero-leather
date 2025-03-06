import fetchProducts from "../../lib/fetchProducts.js";
import Image from "next/image";

export default async function Home() {
  const products = await fetchProducts();
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">WooCommerce Products</h1>
      <div className="grid grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="p-4 border rounded shadow">
              <Image
                src={product.images[0]?.src || "/placeholder.jpg"}
                alt={product.name}
                width={300}
                height={200}
                className="object-cover"
              />
              <h2 className="text-lg font-bold">{product.name}</h2>
              <p className="text-gray-600">
                {product.price ? `$${product.price}` : "Price not available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
