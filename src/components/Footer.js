"use client";

import Link from "next/link";
import Image from "next/image";
import { FaFacebook, FaLinkedin, FaInstagram } from "react-icons/fa";
import ZephyrLogo from "../../public/zephyrlogo.jpg";

const Footer = () => {
  return (
    <footer className="bg-black text-white py-12 mt-16">
      <div className="max-w-screen-xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
          {/* Logo & About Section */}
          <div>
            <Link href="/">
              <Image 
                src={ZephyrLogo} 
                alt="Zephyr Logo" 
                width={150}
                height={75}
                className="mx-auto md:mx-0"
              />
            </Link>
            <p className="mt-3 text-gray-400 text-sm leading-relaxed">
              Your one-stop shop for premium quality products. Discover the latest trends with Zephyr.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {["Home", "Shop", "About Us", "Contact"].map((item, index) => (
                <li key={index}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-gray-200 transition">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social Media Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-white">Follow Us</h3>
            <div className="flex justify-center md:justify-start space-x-6">
              <Link href="https://www.facebook.com/ZephyrAeroLeather/" className="text-gray-400 hover:text-gray-200 transition">
                <FaFacebook size={26} />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-gray-200 transition">
                <FaLinkedin size={26} />
              </Link>
              <Link href="https://www.instagram.com/zephyr.aero.leather/" className="text-gray-400 hover:text-gray-200 transition">
                <FaInstagram size={26} />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-6"></div>

        {/* Copyright Section */}
        <div className="text-center text-gray-400 text-sm">
          &copy; {new Date().getFullYear()} Zephyr. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
