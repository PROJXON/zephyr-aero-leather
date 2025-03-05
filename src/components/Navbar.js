"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import ZephyrLogo from "../../public/zephyrlogo.jpg";
import { useAuth } from "@/app/context/AuthContext";
import { useCart } from "@/app/context/CartContext";
import NavButton from "./NavButton";
import NavLoggedOutBtn from "./NavLoggedOutBtn";

const Navbar = ({ initialUser }) => {
  const { isAuthenticated, user, logout, fetchUserFromServer } = useAuth();
  const { cartItems, removeFromCart } = useCart();
  const [serverUser, setServerUser] = useState(initialUser || null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    if (!initialUser) {
      fetchUserFromServer();
    }
  }, [initialUser]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setServerUser(null);
  };

  return (
    <nav className="bg-white antialiased">
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <Link href="/" passHref>
                <Image
                  className="w-64 h-32 object-contain"
                  src={ZephyrLogo}
                  alt="Logo"
                  width={128}
                  height={64}
                  priority={true}
                />
              </Link>

            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 py-3 relative">
              {["Best Sellers", "Gift Ideas", "auth-test", "login"].map((item) => (
                <li key={item} className="relative group overflow-hidden">
                  <Link
                    href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                    className="text-lg font-medium text-black transition-all duration-300"
                  >
                    {item}
                  </Link>
                  <span className="absolute left-0 bottom-0 w-full h-[2px] bg-black transition-transform duration-300 transform scale-x-0 group-hover:scale-x-100"></span>

                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-center lg:space-x-2">
            {/* Cart Dropdown */}
            <div className="relative">
              <NavButton
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setAccountOpen(false);
                }}
                srOnly="Cart"
                path={<path
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                />}
                text={`${isAuthenticated || serverUser ? "My Cart" : "Guest Cart"} ${cartItems.length > 0 ? `(${cartItems.length})` : ""}`}
              />

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                  {cartItems.length > 0 ? (
                    <>
                      <ul>
                        {cartItems.map((item) => (
                          <li key={item.id} className="flex justify-between border-b py-2">
                            <span>{item.id} x {item.quantity}</span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 text-xs"
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>

                      {/* Checkout Button */}
                      <button className="w-full bg-blue-500 text-white mt-4 p-2 rounded">
                        Checkout
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-900">Your cart is empty.</p>
                  )}
                </div>
              )}
            </div>

            {!isAuthenticated && !serverUser ? (
              <ul className="text-sm font-medium text-gray-900 flex">
                <NavLoggedOutBtn href="/login" text="Sign In" />
                <NavLoggedOutBtn href="/register" text="Create Account" />
              </ul>
            ) : (
              <div className="relative">
                <NavButton
                  onClick={() => {
                    setAccountOpen(!accountOpen);
                    setCartOpen(false);
                  }}
                  srOnly={null}
                  path={<path
                    stroke="currentColor"
                    strokeWidth="2"
                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />}
                  text={serverUser?.first_name || user?.first_name}
                />
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full px-3 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

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
              {["Best Sellers", "Gift Ideas", "Games", "Electronics", "Home & Garden"].map((item) => (
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
