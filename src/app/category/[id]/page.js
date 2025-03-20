import { fetchProductsByCategory, fetchCategoryById } from "../../../../lib/woocommerce";
import CategoryClient from "./CategoryClient"; 

export default async function CategoryPage({ params }) {
  const { id } = params;

  const category = await fetchCategoryById(id);
  const products = await fetchProductsByCategory(id);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">{category?.name || "Category Products"}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {category?.count ? `${category.count} products available` : "No products in this category"}
        </p>
      </div>

      <CategoryClient products={products} />
    </div>
  );
}
