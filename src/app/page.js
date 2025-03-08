import { fetchCategories } from "../../lib/woocommerce.js";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const categories = await fetchCategories();

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">Shop by Category</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {categories.length === 0 ? (
          <p className="text-center text-gray-600">No categories found.</p>
        ) : (
          categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/category/${category.id}`} 
              className="group block overflow-hidden rounded-lg shadow-lg bg-white transition-transform transform hover:scale-105"
            >
              <div className="w-full h-56 overflow-hidden">
                <Image
                  src={category.image?.src || "/placeholder.jpg"}
                  alt={category.name}
                  width={300} 
                  height={200}
                  className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-90"
                />
              </div>
              {/*<div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <h2 className="text-white text-2xl font-semibold">{category.name}</h2>
              </div>*/}
              <div className="p-4 text-center bg-white rounded-b-lg">
                <h2 className="text-lg font-bold text-gray-900 transition-colors group-hover:text-gray-600">{category.name}</h2>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
