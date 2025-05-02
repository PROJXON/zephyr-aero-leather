"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { ShoppingBag, User, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchComponent } from "./Search";
import { useCart } from "@/hooks/useCart";

export default function Navbar() {
  const pathname = usePathname();
  const { cart } = useCart();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [accountOpen, setAccountOpen] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/check");
        if (response.ok) {
          const data = await response.json();
          setIsAuthenticated(true);
          setUser(data.user);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      }
    };
    checkAuth();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setIsAuthenticated(false);
      setUser(null);
      setAccountOpen(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Image
              src="/zephyrlogo.jpg"
              alt="Zephyr Aero Leather"
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="hidden font-bold sm:inline-block">Zephyr</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/"
              className={`transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : "text-neutral-dark"
              }`}
            >
              Home
            </Link>
            <Link
              href="/categories"
              className={`transition-colors hover:text-primary ${
                pathname === "/categories" ? "text-primary" : "text-neutral-dark"
              }`}
            >
              Categories
            </Link>
            <Link
              href="/best-sellers"
              className={`transition-colors hover:text-primary ${
                pathname === "/best-sellers" ? "text-primary" : "text-neutral-dark"
              }`}
            >
              Best Sellers
            </Link>
            <Link
              href="/gifts-idea"
              className={`transition-colors hover:text-primary ${
                pathname === "/gifts-idea" ? "text-primary" : "text-neutral-dark"
              }`}
            >
              Gifts Idea
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <SearchComponent />
          </div>
          <nav className="flex items-center space-x-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingBag className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>
            {isAuthenticated ? (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setAccountOpen(!accountOpen)}
                  className="flex items-center gap-1"
                >
                  <User className="h-5 w-5" />
                  <ChevronDown className="h-4 w-4" />
                </Button>
                {accountOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-md border bg-white py-2 shadow-lg">
                    <div className="px-4 py-2 text-sm text-neutral-dark">
                      {user?.name}
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-neutral-dark hover:bg-secondary"
                      onClick={() => setAccountOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-4 py-2 text-sm text-neutral-dark hover:bg-secondary"
                      onClick={() => setAccountOpen(false)}
                    >
                      Orders
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-neutral-dark hover:bg-secondary"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
