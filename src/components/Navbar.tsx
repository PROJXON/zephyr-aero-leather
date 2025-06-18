"use client";
import { useState, useEffect, Fragment } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ZephyrLogo from "../../public/zephyrlogotransperant.png";
import { useAuth } from "@/app/context/AuthContext";
import NavButton from "./NavButton";
import NavLoggedOutBtn from "./NavLoggedOutBtn";
import ChangeQuantitySpans from "./ChangeQuantitySpans";
import { useCart } from "@/app/context/CartContext";
import getChangeQuantity from "../../lib/getChangeQuantity";
import { Sling as Hamburger } from "hamburger-react";
import TopNavLink from "./TopNavLink";
import NavLink from "./NavLink";
import type { NavbarProps, TopNavLinkDropdownItem } from "../../types/types";

const productCategories: TopNavLinkDropdownItem[] = [
  { name: "Wallets", slug: "wallets" },
  { name: "iPhone Leather Cases", slug: "iphoneCases" },
  { name: "Sunglass Cases", slug: "sunglasses" },
  { name: "Belts", slug: "belts" },
  { name: "Bags", slug: "bags" },
  { name: "Shoulder Holsters", slug: "holsters" },
  { name: "Moto Guzzi Collection", slug: "moto" },
];

const collectionCategories: TopNavLinkDropdownItem[] = [
  { name: "Aviator", slug: "aviator" },
  { name: "Explorer", slug: "explorer" },
  { name: "Traveler", slug: "traveler" },
  { name: "Commuter", slug: "commuter" },
  { name: "Minimalist", slug: "minimalist" },
];

const Navbar = ({ allProducts }: NavbarProps) => {
  const { isAuthenticated, user, logout, fetchUserFromServer } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { cartItems, updateQuantity, setCartOpen, cartOpen } = useCart();
  const { replace } = useRouter();

  const changeQuantity = getChangeQuantity({ updateQuantity });

  useEffect(() => {
    fetchUserFromServer();
  }, [fetchUserFromServer]);

  useEffect(() => {
    if (isAuthenticated) {
      setCartOpen(false);
    }
  }, [isAuthenticated, setCartOpen]);

  const handleLogout = async () => {
    await logout();
    setAccountOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountOpen && !(document.getElementById("profileBtn")?.contains(event.target as Node))) {
        setAccountOpen(false);
      }
      if (
        cartOpen &&
        !(document.getElementById("cartBtn")?.contains(event.target as Node)) &&
        !(event.target as HTMLElement).classList.contains("addToCartBtn")
      ) {
        setCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [accountOpen, cartOpen, setCartOpen]);

  const navItems: string[] = ["About Us"];
  const navItemsWithDropdown = [
    {
      label: "Collections",
      items: collectionCategories,
      basePath: "/collections",
    },
    {
      label: "Categories",
      items: productCategories,
      basePath: "/categories",
    },
  ];

  const mobileMenuLinks = [
    {
      label: "About Us",
      unique: "/about-us",
      show: true,
    },
    {
      label: "Collections",
      unique: "/collections",
      show: true,
    },
    {
      label: "Categories",
      unique: "/categories",
      show: true,
    },
    {
      label: "Sign In",
      unique: "/login",
      show: !isAuthenticated,
    },
    {
      label: "Create Account",
      unique: "/register",
      show: !isAuthenticated,
    },
    {
      label: "Order History",
      unique: {
        function: () => {
          replace("/order-history");
          setMenuOpen(false);
        },
        classes: "block w-full text-left text-lg",
      },
      show: isAuthenticated,
    },
    {
      label: "Logout",
      unique: {
        function: handleLogout,
        classes: "block w-full text-left text-lg",
      },
      show: isAuthenticated,
    },
    {
      label: `View Cart${cartItems?.length > 0 ? ` (${cartItems.reduce((total, item) => total + item.quantity, 0)})` : ""}`,
      unique: "/checkout",
      show: true,
    },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 z-50 py-2">
      <div className="max-w-screen-xl px-4 mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo and Desktop Menu */}
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

            <ul className="hidden lg:flex items-center gap-8 py-3 relative">
              {navItems.map((item) => (
                <TopNavLink
                  key={item}
                  href={`/${item.toLowerCase().replace(/ /g, "-")}`}
                  label={item}
                />
              ))}
              {navItemsWithDropdown.map((item) => (
                <TopNavLink
                  key={item.label}
                  href={item.basePath}
                  label={item.label}
                  dropdownItems={item.items}
                />
              ))}
            </ul>
          </div>

          {/* Right Buttons */}
          <div className="flex items-center gap-3">
            {/* Auth Buttons */}
            <div className="hidden lg:flex gap-2" id="authButtons">
              {!isAuthenticated ? (
                <>
                  <NavLoggedOutBtn href="/login" text="Sign In" />
                  <NavLoggedOutBtn href="/register" text="Create Account" />
                </>
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
                        srOnly="Log Out"
                        text="Log Out"
                        fill="none"
                        className="justify-center"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Cart Button */}
            <div id="cartBtn" className="relative hidden lg:block">
              <NavButton
                onClick={() => {
                  setCartOpen(!cartOpen);
                  setAccountOpen(false);
                }}
                srOnly="Cart"
                d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312"
                text={isAuthenticated ? "My Cart" : "Guest Cart"}
                badgeCount={cartItems?.length > 0 ? cartItems.reduce((total, item) => total + item.quantity, 0) : undefined}
                fill="none"
              />
              {cartOpen && (
                <div
                  className="fixed top-[60px] w-64 max-h-[70vh] overflow-y-auto bg-white shadow-lg rounded-lg p-4 z-50"
                  style={{
                    right: "max(calc((65vw - 1280px) / 2), 12px)",
                  }}
                >
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
                                <div className="text-center">x {item.quantity}</div>
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

            {/* Hamburger - Mobile Only */}
            <div className="lg:hidden flex items-center gap-2">
              {/* Mobile Cart Indicator */}
              {cartItems?.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => replace("/checkout")}
                    className="flex items-center justify-center"
                  >
                    <svg className="w-6 h-6 text-neutral-dark hover:text-accent-color transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 4h1.5L9 16m0 0h8m-8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm8 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm-8.5-3h9.25L19 7H7.312" />
                    </svg>
                    <span className="absolute -top-2 -right-1 text-neutral-dark text-xs font-medium">
                      {cartItems.reduce((total, item) => total + item.quantity, 0)}
                    </span>
                  </button>
                </div>
              )}
              <Hamburger toggled={menuOpen} toggle={setMenuOpen} />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-full right-4 mt-2 w-42 bg-white rounded-lg p-4 space-y-1 shadow-xl z-[9999]">
            {mobileMenuLinks.map((link) => (
              <Fragment key={link.label}>
                {link.show && (
                  <>
                    {typeof link.unique === "string" ? (
                      <NavLink
                        href={link.unique}
                        onClick={() => setMenuOpen(false)}
                        classes="block text-lg"
                        label={link.label}
                      />
                    ) : (
                      <button onClick={link.unique.function} className={link.unique.classes}>
                        {link.label}
                      </button>
                    )}
                  </>
                )}
              </Fragment>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;