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
import { Sling as Hamburger } from "hamburger-react";
import NavDropdown from "./NavDropdown";

const productCategories = [
  { name: "Wallets", slug: "wallets" },
  { name: "iPhone Leather Cases", slug: "iphoneCases" },
  { name: "Sunglass Cases", slug: "sunglasses" },
  { name: "Belts", slug: "belts" },
  { name: "Bags", slug: "bags" },
  { name: "Shoulder Holsters", slug: "holsters" },
  { name: "Moto Guzzi Collection", slug: "moto" },
];

const collectionCategories = [
  { name: "Aviator", slug: "aviator" },
  { name: "Explorer", slug: "explorer" },
  { name: "Traveler", slug: "traveler" },
  { name: "Commuter", slug: "commuter" },
  { name: "Minimalist", slug: "minimalist" }
]

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
      if (
        accountOpen &&
        !document.getElementById("profileBtn")?.contains(e.target)
      ) {
        setAccountOpen(false);
      }
      if (
        cartOpen &&
        !document.getElementById("cartBtn")?.contains(e.target) &&
        !e.target.classList.contains("addToCartBtn")
      ) {
        setCartOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen, cartOpen]);

  const navItems = ["About Us"];

  return (
    <nav className="bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 sticky top-0 z-50">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <Link href="/">
              <Image
                className="w-[100px] object-contain"
                src={ZephyrLogo}
                alt="Logo"
                width={200}
                height={100}
                priority
              />
            </Link>

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

              <NavDropdown
                label="Collections"
                items={collectionCategories}
                basePath="collections"
                linkToBase={true}
              />
              <NavDropdown
                label="Categories"
                items={productCategories}
                basePath="categories"
                linkToBase={true}
              />


            </ul>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">
            {/* Cart - Desktop */}
            <div id="cartBtn" className="relative hidden lg:block">
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
                          const itemName =
                            allProducts.find((product) => product.id === item.id)
                              ?.name || "Item";
                          return (
                            <li
                              key={`${item.id}-${item.lineItemId || "temp"}`}
                              className="grid grid-cols-[1fr_auto] border-b py-2 gap-1"
                            >
                              <span>{itemName}</span>
                              <div className="m-auto">
                                <div className="text-center">
                                  x {item.quantity}
                                </div>
                                <div className="flex items-center flex-wrap gap-1">
                                  <ChangeQuantitySpans
                                    cqs={changeQuantity}
                                    item={item}
                                  />
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="mt-4 flex justify-end">
                        <button
                          className="py-2 px-4 text-sm font-medium bg-neutral-light text-neutral-dark rounded hover:bg-neutral-medium transition-colors"
                          onClick={() => replace("/checkout")}
                        >
                          Checkout
                        </button>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-900">Your cart is empty.</p>
                  )}
                </div>
              )}
            </div>

            {/* Auth - Desktop */}
            <div className="hidden lg:block">
              {!isAuthenticated ? (
                <div className="flex gap-2">
                  <NavLoggedOutBtn href="/login" text="Sign In" />
                  <NavLoggedOutBtn href="/register" text="Create Account" />
                </div>
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
            </div>

            {/* Hamburger - Mobile Only */}
            <div className="lg:hidden">
              <Hamburger toggled={menuOpen} toggle={setMenuOpen} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full right-4 mt-2 w-42 bg-white rounded-lg p-4 space-y-1 shadow-xl z-[9999]">
            <Link href="/about-us" onClick={() => setMenuOpen(false)} className="block text-lg">About Us</Link>
            <Link href="/collections" onClick={() => setMenuOpen(false)} className="block text-lg">Collections</Link>
            <Link href="/categories" onClick={() => setMenuOpen(false)} className="block text-lg">Categories</Link>

            {!isAuthenticated ? (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-lg">Sign In</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="block text-lg">Create Account</Link>
              </div>
            ) : (
              <div className="space-y-2">
                <button onClick={() => { replace("/order-history"); setMenuOpen(false); }} className="block w-full text-left text-blue-600">Order History</button>
                <button onClick={handleLogout} className="block w-full text-left text-red-600">Logout</button>
              </div>
            )}

            <Link href="/checkout" onClick={() => setMenuOpen(false)} className="block text-lg">View Cart</Link>
          </div>
        )}

      </div>
    </nav>
  );
};

export default Navbar;
