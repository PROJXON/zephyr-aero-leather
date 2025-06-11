'use client';

import Image from "next/image";
import { useState } from "react";
const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

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
      {/* Our Commitment */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
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
                <h4 className="text-xl font-medium mb-2 text-neutral-dark">
                  {item.title}
                </h4>
                <p className="text-neutral-medium">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Shop With Us */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
            Why Shop With Us
          </h2>

        {/* Tab Buttons */}
        <div className="flex justify-center gap-4 flex-wrap mb-8">
          {Object.keys(tabContent).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`px-6 py-2 rounded-full font-medium text-sm transition-colors
                ${
                  activeTab === key
                    ? "bg-neutral-medium"
                    : "bg-neutral-light text-neutral-dark hover:bg-neutral-medium"
                }`}
            >
              {tabContent[key].title}
            </button>
          ))}
        </div>


          {/* Tab Content */}
          <div className="flex flex-col md:flex-row items-center gap-8 text-leftp-6 rounded-lg shadow-lg">
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
              <h3 className="text-2xl font-medium mb-3 text-neutral-dark">
                {tabContent[activeTab].title}
              </h3>
              <p className="text-neutral-medium text-lg">
                {tabContent[activeTab].text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Zephyr Stands Out */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
              Why Zephyr Stands Out
            </h2>
            <p className="text-lg leading-relaxed text-neutral-medium mt-4">
              Zephyr Aero Leather is committed to exceptional quality, using only full-grain leather—the highest grade available—for every product we create.
              Each piece is meticulously handcrafted by skilled artisans, ensuring durability, elegance, and a personal touch in every stitch.
              Proudly made in the USA, our products reflect a legacy of craftsmanship and a passion for timeless design.
            </p>
          </div>
          <div>
            <Image
              src={`${CDN_URL}/collections/minimalist/minimalist2.jpg`}
              alt="Why choose Zephyr"
              width={600}
              height={400}
              className="rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-20 text-center bg-background">
        <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
          Ready to Soar?
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-6 text-neutral-medium">
          Join the community of adventurers who appreciate the perfect blend of heritage, quality, and style.
          Discover the Zephyr Aero Leather difference.
        </p>
        <a
          href="/collections"
          className="inline-block bg-neutral-light text-neutral-dark px-6 py-3 rounded-full font-medium hover:bg-neutral-medium transition-colors"
        >
          Visit Our Collection
        </a>
      </section>
    </div>
  );
}
