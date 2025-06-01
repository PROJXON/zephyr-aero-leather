"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import ZephyrLogo from "../../public/zephyrlogotransperant.png";
import { useAuth } from "@/app/context/AuthContext";
import NavButton from "./NavButton";
import NavLoggedOutBtn from "./NavLoggedOutBtn";
import ChangeQuantitySpans from "./ChangeQuantitySpans";
import { useCart } from "@/app/context/CartContext";
import getChangeQuantity from "../../lib/getChangeQuantity";

const productCategories = [
  { name: "Wallets", slug: "wallets" },
  { name: "iPhone Cases", slug: "iphone-cases" },
  { name: "Sunglass Cases", slug: "sunglasses" },
  { name: "Belts", slug: "belts" },
  { name: "Bags", slug: "bags" },
  { name: "Shoulder Holsters", slug: "shoulder-holsters" },
  { name: "Moto Guzzi", slug: "moto-guzzi" },
];

const Navbar = ({ allProducts }) => {
  const { isAuthenticated, user, logout, fetchUserFromServer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { cartItems, updateQuantity, setCartOpen, cartOpen } = useCart();
  const { replace } = useRouter();
  const pathname = usePathname();

  const changeQuantity = getChangeQuantity({ updateQuantity });

  useEffect(() => {
    fetchUserFromServer();
  }, []);

  useEffect(() => {
    setCartOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (accountOpen && !document.getElementById("profileBtn")?.contains(e.target)) {
        setAccountOpen(false);
      }
      if (cartOpen && !document.getElementById("cartBtn")?.contains(e.target) && !e.target.classList.contains("addToCartBtn")) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen, cartOpen]);

  const navItems = ["Collections", "About Us"];

  return (
    <nav className="bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <Link href="/">
                <Image
                  className="w-[100px] object-contain"
                  src={ZephyrLogo}
                  alt="Logo"
                  width={200}
                  height={100}
                  priority={true}
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <ul className="hidden lg:flex items-center gap-8 py-3 relative">
              {navItems.map((item) => (
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

              {/* Categories Dropdown */}
              <li className="relative group">
                <button className="text-lg font-medium text-black transition-all duration-300">
                  Categories
                </button>
                <div className="absolute left-0 mt-2 w-48 bg-white shadow-md rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-50">
                  <ul className="py-2">
                    {productCategories.map((cat) => (
                      <li key={cat.slug}>
                        <Link
                          href={`/category/${cat.slug}`}
                          className="block px-4 py-2 hover:bg-gray-100 text-sm text-gray-800"
                        >
                          {cat.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <div className="flex items-center">
            {/* Cart Dropdown */}
            <div id="cartBtn" className="relative">
              <NavButton
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setAccountOpen(false);
                }}
                srOnly="Cart"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                text={isAuthenticated ? "My Cart" : "Guest Cart"}
              />
              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4 z-50">
                  {cartItems?.length > 0 ? (
                    <>
                      <ul>
                        {cartItems.map((item) => {
                          const itemName = allProducts.filter((product) => product.id === item.id)[0]?.name || "Item";
                          return (
                            <li key={`${item.id}-${item.lineItemId || "temp"}`} className="grid grid-cols-[1fr_auto] border-b py-2 gap-1">
                              <span>{itemName}</span>
                              <div className="m-auto">
                                <div className="text-center">x {item.quantity}</div>
                                <div className="flex items-center flex-wrap gap-1">
                                  <ChangeQuantitySpans cqs={changeQuantity} item={item} />
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <button
                        className="w-full bg-blue-500 text-white mt-4 p-2 rounded"
                        onClick={() => replace("/checkout")}
                      >
                        Checkout
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-900">Your cart is empty.</p>
                  )}
                </div>
              )}
            </div>

            {/* Auth Buttons */}
            {!isAuthenticated ? (
              <ul className="font-medium text-gray-900 flex">
                <NavLoggedOutBtn href="/login" text="Sign In" />
                <NavLoggedOutBtn href="/register" text="Create Account" />
              </ul>
            ) : (
              <div id="profileBtn" className="relative">
                <NavButton
                  onClick={() => {
                    setAccountOpen(!accountOpen);
                    setCartOpen(false);
                  }}
                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  text={user?.first_name || "Account"}
                />
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
                    <NavButton
                      onClick={() => replace("/order-history")}
                      srOnly="Order History"
                      text="Order History"
                      fill="none"
                    />
                    <NavButton
                      onClick={handleLogout}
                      srOnly="Logout"
                      text="Logout"
                      fill="none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <NavButton
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden"
              srOnly="Open Menu"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg py-3 px-4 mt-4">
            <ul className="text-gray-900 text-sm font-medium space-y-3">
              {productCategories.map((cat) => (
                <li key={cat.slug}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-primary-700">
                    {cat.name}
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
