"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import type { ReactElement } from "react";
import ZephyrLogo from "../../public/zephyrlogo.jpg";

export default function Footer(): ReactElement {
  return (
    <footer className="bg-neutral-dark text-white py-8 md:py-10">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Logo & About Section */}
          <div className="flex flex-col items-center md:items-center">
            <Link href="/">
              <Image 
                src={ZephyrLogo} 
                alt="Zephyr Logo" 
                width={150}
                height={75}
                sizes="250px"
                style={{ width: "auto", height: "auto" }}
                className="mx-auto rounded-xl"
              />
            </Link>
            <p className="mt-3 text-gray-300 text-sm leading-relaxed">
              Your one-stop shop for premium quality products
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-gray-300 text-sm">
              {[
                {
                  name: "Home",
                  href: "/",
                },
                {
                  name: "About Us",
                  href: "/about-us",
                },
                {
                  name: "Contact",
                  href: "/contact",
                },
              ].map(({ name, href }) => (
                <li key={name} className="group">
                  <Link
                    href={href}
                    className="text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <span className="relative inline-block">
                      {name}
                      <span className="absolute left-1/2 bottom-[-1px] h-[1.5px] w-full bg-white scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-center -translate-x-1/2 pointer-events-none" />

                    </span>
                  </Link>
                </li>
              ))}
            </ul>


          </div>

          {/* Social Media Links */}
          <div className="flex flex-col items-center md:items-center">
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex justify-center space-x-6">
              <Link href="https://www.facebook.com/ZephyrAeroLeather/" className="text-gray-300 hover:text-white transform hover:scale-110 transition duration-200"
>
                <FaFacebook size={26} />
              </Link>
              <Link href="https://www.instagram.com/zephyr.aero.leather/" className="text-gray-400 hover:text-white transform hover:scale-110 transition duration-200"
>
                <FaInstagram size={26} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Copyright Section */}
        <div className="text-center text-gray-300 text-sm">
          &copy; {new Date().getFullYear()} Zephyr. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
