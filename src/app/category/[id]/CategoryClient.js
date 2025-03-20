"use client"; 
import { useEffect } from "react";
import Image from "next/image";
import setupGiftIdeas from "./script.js"; 

export default function CategoryClient({ products }) {
  useEffect(() => {
    console.log("Category Client Component Loaded!");
    setupGiftIdeas(); 
  }, []);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {products.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No products found in this category.</p>
        ) : (
          products.map((product) => (
            <div 
              key={product.id} 
              className="group relative bg-white p-3 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
              data-name={product.name}
              data-price={product.price || "N/A"}
              data-image={product.images[0]?.src || "/placeholder.jpg"}
              data-description={product.description || "No description available"}
            >
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

      <div id="quick-view-modal" className="hidden fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded-lg shadow-lg relative w-96">
          <span id="close-btn" className="absolute top-2 right-4 cursor-pointer text-xl">&times;</span>
          <Image id="modal-image" src="/images/placeholder.jpg" alt="Product Image" width={300} height={200} className="rounded-md mx-auto" />
          <div className="flex justify-between items-center mt-3">
            <h2 id="modal-title" className="text-xl font-bold text-left"></h2>
            <div className="flex items-center">
              <button id="decrease-qty" className="px-3 py-1 bg-gray-300 text-gray-700 rounded">-</button>
              <span id="quantity" className="mx-2">1</span>
              <button id="increase-qty" className="px-3 py-1 bg-gray-300 text-gray-700 rounded">+</button>
            </div>
          </div>

          <span id="modal-price" className="text-yellow-500 font-bold block mt-1 text-left"></span>
          <p id="modal-description" className="mt-2 text-gray-700 text-left"></p>

          <button className="mt-4 w-full bg-yellow-500 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-800 hover:text-yellow-500 transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}
