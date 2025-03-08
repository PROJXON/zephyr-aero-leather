import { fetchProductsByCategory, fetchCategoryById } from "../../../../lib/woocommerce";
import Image from "next/image";

export default async function CategoryPage({ params }) {
  const { id } = params;

  // Fetch category details (name, product count, etc.)
  const category = await fetchCategoryById(id);
  console.log("Category Data:", category); 

  const products = await fetchProductsByCategory(id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10"> 
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{category?.name || "Category Products"}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {category?.count ? `${category.count} products available` : "No products in this category"}
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4"> 
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className="group relative bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-full h-44 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden"> 
                <Image
                  src={product.images[0]?.src || "/placeholder.jpg"}
                  alt={product.name}
                  width={220}
                  height={160}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="text-center mt-3">
                <h2 className="text-base font-bold text-gray-900">{product.name}</h2> 
                <p className="text-sm text-gray-600 mt-1">
                  {product.price ? `$${product.price}` : "Price not available"}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
