'use client';

import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faWallet,
  faMobileAlt,
  faGlasses,
  faLink,
  faBriefcase,
} from "@fortawesome/free-solid-svg-icons";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState("shop");

  const tabContent = {
    shop: {
      title: "Online Shopping",
      text: "Enjoy a seamless shopping experience with our user-friendly online store. Browse collections, customize orders, and track your purchase from anywhere.",
      image: "/about-us/online-shopping.png",
    },
    shipping: {
      title: "Fast Shipping",
      text: "We ensure that every order is processed and shipped quickly. Receive your handcrafted leather goods on time, every time.",
      image: "/about-us/fast-shipping.png",
    },
    return: {
      title: "Easy Returns",
      text: "Not satisfied with your purchase? Our hassle-free return policy lets you shop with confidence.",
      image: "/about-us/easy-returns.png",
    },
  };

  return (
    <div>
      {/* Our Story */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-2 border-b-4 border-yellow-500 inline-block pb-1">
              Our Story
            </h2>
            <p className="text-lg leading-relaxed mt-4">
              Zephyr Aero Leather was born from a passion for vintage aviation and masterful leather craftsmanship.
              Every stitch we make reflects the enduring spirit of explorers and pilots who paved the skies before us.
            </p>
          </div>
          <div>
            <Image
              src="/about-us/story.png"
              alt="Leather craftsmanship"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Commitment */}
      <section className="py-16 px-6 md:px-20 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-12 border-b-4 border-yellow-500 inline-block pb-1">
            Our Commitment
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            {[
              {
                title: "Quality Materials",
                text: "We source only the finest leather from reputable suppliers who share our commitment to excellence.",
              },
              {
                title: "Skilled Artisans",
                text: "Every piece is crafted by experienced artisans who bring decades of expertise to their work.",
              },
              {
                title: "Timeless Design",
                text: "Our designs transcend trends, focusing on classic aesthetics that never go out of style.",
              },
              {
                title: "Functional Beauty",
                text: "We believe that beautiful products should also be highly functional for everyday life.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transform transition duration-300 hover:-translate-y-1"
              >
                <h4 className="text-xl font-semibold mb-2">{item.title}</h4>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-16 px-6 md:px-20 bg-gray-50 border-t">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 border-b-4 border-yellow-500 inline-block pb-1">
            Why Shop With Us
          </h2>

          {/* Tab Buttons */}
          <div className="flex justify-center gap-4 flex-wrap mb-8">
            <button
              onClick={() => setActiveTab("shop")}
              className={`px-5 py-2 rounded-full border font-semibold transition ${
                activeTab === "shop" ? "bg-yellow-500 text-white" : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              🖥️ Online Shopping
            </button>
            <button
              onClick={() => setActiveTab("shipping")}
              className={`px-5 py-2 rounded-full border font-semibold transition ${
                activeTab === "shipping" ? "bg-yellow-500 text-white" : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              🚚 Fast Shipping
            </button>
            <button
              onClick={() => setActiveTab("return")}
              className={`px-5 py-2 rounded-full border font-semibold transition ${
                activeTab === "return" ? "bg-yellow-500 text-white" : "bg-white text-gray-800 border-gray-300"
              }`}
            >
              📦 Easy Returns
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex flex-col md:flex-row items-center gap-8 text-left bg-white p-6 rounded-lg shadow-lg">
            <div className="w-full md:w-1/2">
              <Image
                src={tabContent[activeTab].image}
                alt={tabContent[activeTab].title}
                width={500}
                height={350}
                className="rounded-lg"
              />
            </div>
            <div className="w-full md:w-1/2">
              <h3 className="text-2xl font-bold mb-3">{tabContent[activeTab].title}</h3>
              <p className="text-gray-700 text-lg">{tabContent[activeTab].text}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Zephyr Stands Out */}
      <section className="py-16 px-6 md:px-20 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4 border-b-4 border-yellow-500 inline-block pb-1">
              Why Zephyr Stands Out
            </h2>
            <p className="text-lg leading-relaxed text-gray-700 mt-4">
              Zephyr Aero Leather is committed to exceptional quality, using only full-grain leather—the highest grade available—for every product we create.
              Each piece is meticulously handcrafted by skilled artisans, ensuring durability, elegance, and a personal touch in every stitch.
              Proudly made in the USA, our products reflect a legacy of craftsmanship and a passion for timeless design.
            </p>
          </div>
          <div>
            <Image
              src="/about-us/why-choose.png"
              alt="Why choose Zephyr"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 text-center bg-white">
        <h2 className="text-3xl font-bold mb-4 border-b-4 border-yellow-500 inline-block pb-1">
          Ready to Soar?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-gray-700">
          Join the community of adventurers who appreciate the perfect blend of heritage, quality, and style.
          Discover the Zephyr Aero Leather difference.
        </p>
        <a href="/collections" className="inline-block bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition">
          Visit Our Collection
        </a>
      </section>
    </div>
  );
}