"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"
import ZephyrLogo from "../../public/zephyrlogo.jpg";
import { useAuth } from "@/app/context/AuthContext";
import NavButton from "./NavButton";
import NavLoggedOutBtn from "./NavLoggedOutBtn";
import { useCart } from "@/app/context/CartContext";
import getChangeQuantity from "../../lib/getChangeQuantity"

const Navbar = ({ initialUser, allProducts }) => {
  const { isAuthenticated, user, login, logout, fetchUserFromServer } = useAuth();
  const [serverUser, setServerUser] = useState(initialUser || null)
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { cartItems, updateQuantity, setCartOpen, cartOpen } = useCart();
  const { replace } = useRouter()
  const pathname = usePathname()

  const changeQuantity = getChangeQuantity({ updateQuantity });

  useEffect(() => {
    if (!initialUser) {
      fetchUserFromServer();
    }
  }, [initialUser]);

  useEffect(() => {
    setCartOpen(false)
  }, [pathname])

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
    setServerUser(null);
  };

  useEffect(() => {
    const handleClickOutside = e => {
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

  const navItems = ["Best Sellers", "Gift Ideas", "auth-test", "login"];

  return (
    <nav className="bg-white antialiased">
      <div className="max-w-screen-xl px-4 mx-auto py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-8">
            <div className="shrink-0">
              <Link href="/">
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
            </ul>
          </div>

          <div className="flex items-center lg:space-x-2">
            {/* Cart Dropdown */}
            <div id="cartBtn" className="relative">
              <NavButton
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setAccountOpen(false);
                }}
                className="rounded-lg text-sm font-medium"
                srOnly="Cart"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                text={isAuthenticated || serverUser ? "My Cart" : "Guest Cart"}
              />

              {cartOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-lg p-4">
                  {cartItems?.length > 0 ? (
                    <>
                      <ul>
                        {cartItems.map((item) => {
                          const itemName = allProducts.filter(product => product.id === item.id)[0].name

                          return (<li key={`${item.id}-${item.lineItemId || "temp"}`} className="grid grid-cols-[1fr_auto] border-b py-2 gap-1">
                            <span>{itemName}</span>
                            <div className="m-auto">
                              <div className="text-center">x {item.quantity}</div>
                                <div className="flex items-center flex-wrap gap-1">
                                  {changeQuantity.map((cq, i) => (
                                    <span
                                      key={i}
                                      className="cursor-pointer text-base"
                                      onClick={() => cq.onClick(item)}
                                    >
                                    <cq.icon
                                      className={`duration-300 hover:opacity-50 ${cq.className}`}
                                      size={15}
                                    />
                                    </span>
                                  ))}
                                </div>
                            </div>
                          </li>)
                        })}
                      </ul>

                      {/* Checkout Button */}
                      <button
                        className="w-full bg-blue-500 text-white mt-4 p-2 rounded"
                        onClick={() => replace("checkout")}
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

            {!isAuthenticated && !serverUser ? (
              <ul className="text-sm font-medium text-gray-900 flex">
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
                  className="rounded-lg text-sm font-medium"
                  d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  text={serverUser?.first_name || user?.first_name}
                />
                {accountOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg p-2">
                    <button
                      onClick={handleLogout}
                      className="nav-button-no-svg w-full text-sm text-red-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <NavButton
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden rounded-md"
              srOnly="Open Menu"
              d="M5 7h14M5 12h14M5 17h14"
            />
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
