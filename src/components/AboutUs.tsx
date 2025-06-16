import Image from "next/image";
import Link from "next/link";
import type { ReactElement } from "react";
import type { CommitmentItem, WhyShopItem } from "../../types/types";

const CDN_URL = process.env.NEXT_PUBLIC_CDN_URL;

export default function AboutUs(): ReactElement {
  const commitmentItems: CommitmentItem[] = [
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
  ];

  const whyShopItems: WhyShopItem[] = [
    {
      title: "Online Shopping",
      text: "Enjoy a seamless shopping experience with our user-friendly store. Browse collections, customize orders, and track purchases easily.",
      image: `/about-us/online-shipping.png`,
    },
    {
      title: "Fast Shipping",
      text: "We process and ship every order promptly. Receive your handcrafted goods on time, every time.",
      image: `/about-us/fast-shipping.png`,
    },
    {
      title: "Easy Returns",
      text: "Not satisfied? Our hassle-free return policy ensures a confident shopping experience.",
      image: `/about-us/easy-returns.png`,
    },
  ];

  return (
    <div>
      {/* Our Commitment */}
      <section className="py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
            Our Commitment
          </h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            {commitmentItems.map((item, i) => (
              <div
                key={i}
                className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
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
      <section className="py-16 px-6 md:px-20 bg-neutral-light">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-normal mb-12 text-neutral-dark">
            Why Shop With Us
          </h2>
          <div className="grid md:grid-cols-3 gap-10 text-left">
            {whyShopItems.map((item, i) => (
              <div
                key={i}
                className="group p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition duration-300 hover:-translate-y-1"
              >
                <div className="w-full h-[300px] relative mb-4 rounded-xl overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xl font-medium mb-2 text-neutral-dark">
                  {item.title}
                </h4>
                <p className="text-neutral-medium">{item.text}</p>
              </div>
            ))}
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
              Zephyr Aero Leather is committed to exceptional quality, using only
              full-grain leather—the highest grade available—for every product we
              create. Each piece is meticulously handcrafted by skilled artisans,
              ensuring durability, elegance, and a personal touch in every stitch.
              Proudly made in the USA, our products reflect a legacy of
              craftsmanship and a passion for timeless design.
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
          Join the community of adventurers who appreciate the perfect blend of
          heritage, quality, and style. Discover the Zephyr Aero Leather
          difference.
        </p>
        <Link
          href="/collections"
          className="inline-block bg-neutral-light text-neutral-dark px-6 py-3 rounded-full font-medium hover:bg-neutral-medium transition-colors"
        >
          Visit Our Collection
        </Link>
      </section>
    </div>
  );
}