"use client";

import { useEffect } from "react";
import Image from "next/image";
import setupGiftIdeas from "./script.js";

export default function GiftIdeasPage() {
  useEffect(() => {
    console.log("Gift Ideas Page Loaded!");
    setupGiftIdeas();
  }, []);

  return (
    <div className="bg-gray-200 text-gray-900">
      <header className="text-center py-20 bg-gray-300">
        <h2 className="text-4xl font-bold">Find the Perfect Gift for Every Occasion</h2>
        <p className="text-lg mt-2">Explore our handpicked collections and surprise your loved ones.</p>
        <button className="mt-5 bg-yellow-500 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-800 hover:text-yellow-500 transition-all">
          Shop Now
        </button>
      </header>

      <section className="text-center py-8">
        <h3 className="text-2xl font-semibold mb-4">Trending Leather Products</h3>
        <div className="relative overflow-hidden w-full max-w-lg mx-auto bg-blue-100 p-4 rounded-lg shadow-lg">
          <div id="carousel-track" className="flex space-x-4 transition-transform duration-500 ease-in-out">
            {[
              { img: "leather-bag.jpg", name: "Leather Bag", price: "$129.99" },
              { img: "leather-jacket.jpg", name: "Leather Jacket", price: "$199.99" },
              { img: "leather-belt.jpg", name: "Leather Belt", price: "$49.99" },
              { img: "leather-shoes.jpg", name: "Leather Shoes", price: "$159.99" },
            ].map((item, index) => (
              <div key={index} className="carousel-item bg-white p-4 rounded-lg shadow-md text-center min-w-[150px] border-2 border-blue-500">
                <Image src={`/images/${item.img}`} alt={item.name} width={150} height={100} className="rounded-md" />
                <p className="text-sm mt-2">{item.name}</p>
                {/*<span className="text-yellow-600 font-bold">{item.price}</span>*/}
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="flex flex-col lg:flex-row gap-6 max-w-5xl mx-auto p-6">
        <section className="flex-1">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">Featured Gifts</h3>
            <select id="price-sort" className="border p-2 rounded-md">
              <option value="default">Default</option>
              <option value="low-high">Low to High</option>
              <option value="high-low">High to Low</option>
            </select>
          </div>
          <div id="gift-grid" className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { name: "Luxury Watch", price: "89.99", img: "gift1.jpg", category: "him" },
              { name: "Perfume Set", price: "49.99", img: "gift2.jpg", category: "her" },
              { name: "Toy Car", price: "19.99", img: "gift3.jpg", category: "kids" },
              { name: "Anniversary Necklace", price: "99.99", img: "gift4.jpg", category: "occasion" },
              { name: "Budget-Friendly Mug", price: "12.99", img: "gift5.jpg", category: "price" },
            ].map((item, index) => (
              <div key={index} className="gift-item bg-yellow-50 p-4 rounded-lg shadow-md text-center cursor-pointer border border-yellow-400"
                   data-price={item.price} data-category={item.category} data-name={item.name} data-image={`/images/${item.img}`}>
                <Image src={`/images/${item.img}`} alt={item.name} width={150} height={100} className="rounded-md" />
                <p className="font-semibold mt-2">{item.name}</p>
                <span className="text-yellow-600 font-bold">${item.price}</span>
              </div>
            ))}
          </div>
        </section>

        <aside className="bg-gray-800 text-white p-4 rounded-lg w-48">
          <h3 className="text-lg font-semibold mb-2">Shop by Category</h3>
          <ul className="space-y-2">
            {[
              { label: "All Gifts", filter: "all" },
              { label: "Gifts for Him", filter: "him" },
              { label: "Gifts for Her", filter: "her" },
              { label: "Gifts for Kids", filter: "kids" },
              { label: "By Occasion", filter: "occasion" },
            ].map((category, index) => (
              <li key={index} className="p-2 cursor-pointer hover:bg-yellow-500 hover:text-gray-900 rounded-md"
                  data-filter={category.filter}>
                {category.label}
              </li>
            ))}
          </ul>
        </aside>
      </div>

      <section className="text-center bg-gray-300 p-10 rounded-lg mx-6 my-10">
        <h3 className="text-2xl font-semibold">Can't Decide? Take a Short Quiz!</h3>
        <button className="mt-4 bg-yellow-500 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-800 hover:text-yellow-500 transition-all">Quiz</button>
      </section>

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
          {/*<p id="modal-description" className="mt-2 text-gray-700 text-sm text-left"></p>*/}
          <button className="mt-4 w-full bg-yellow-500 text-gray-800 py-2 px-6 rounded-full hover:bg-gray-800 hover:text-yellow-500 transition-all">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
