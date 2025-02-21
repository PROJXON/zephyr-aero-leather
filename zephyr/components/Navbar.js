"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import ZephyrLogo from "../public/zephyrlogo.jpg";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Tracks authentication

  return (
    <nav className="bg-white antialiased">
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <Image
                className="w-64 h-32 object-contain"
                src={ZephyrLogo}
                alt="Logo"
                width={128}
                height={64}
                priority={true}
              />
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-6 md:gap-8 py-3">
              {["Home", "Best Sellers", "Gift Ideas", "Today's Deals", "Sell"].map((item) => (
                <li key={item}>
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-sm font-medium text-gray-900 hover:text-primary-700"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center lg:space-x-2">
            {/* Cart Dropdown */}
            <div className="relative">
              <button
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setAccountOpen(false);
                }}
                className="inline-flex items-center p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-900"
              >
                <span className="sr-only">Cart</span>
                <svg className="w-5 h-5 lg:mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                  />
                </svg>
                <span className="hidden sm:flex">{isAuthenticated ? "My Cart" : "Guest Cart"}</span>
              </button>

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                  <p className="text-sm text-gray-900">Your cart is empty.</p>
                </div>
              )}
            </div>

            {!isAuthenticated ? (
              <ul className="text-sm font-medium text-gray-900 flex space-x-4">
              <li>
                <Link href="/login" className="block px-3 py-2 hover:bg-gray-100 rounded-md">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="block px-3 py-2 hover:bg-gray-100 rounded-md">
                  Create Account
                </Link>
              </li>
            </ul>
            ) : 
            <div className="relative">
              <button
                onClick={() => {
                  setAccountOpen(!accountOpen);
                  setCartOpen(false);
                }}
                className="inline-flex items-center p-2 hover:bg-gray-100 rounded-lg text-sm font-medium text-gray-900"
              >
                <svg className="w-5 h-5 mr-1" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Account
              </button>
            </div>
            }

            {/* Mobile Menu Button */}
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="inline-flex lg:hidden items-center p-2 hover:bg-gray-100 rounded-md text-gray-900"
            >
              <span className="sr-only">Open Menu</span>
              <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="M5 7h14M5 12h14M5 17h14" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 mt-4">
            <ul className="text-gray-900 text-sm font-medium space-y-3">
              {["Home", "Best Sellers", "Gift Ideas", "Games", "Electronics", "Home & Garden"].map((item) => (
                <li key={item}>
                  <Link href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="hover:text-primary-700">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
