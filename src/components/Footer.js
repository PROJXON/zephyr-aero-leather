"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Shop */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-neutral-dark">Shop</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/best-sellers" className="text-sm text-neutral-medium hover:text-primary">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/gifts-idea" className="text-sm text-neutral-medium hover:text-primary">
                  Gifts Idea
                </Link>
              </li>
            </ul>
          </div>

          {/* About */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-neutral-dark">About</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/our-story" className="text-sm text-neutral-medium hover:text-primary">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/sustainability" className="text-sm text-neutral-medium hover:text-primary">
                  Sustainability
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-neutral-dark">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-sm text-neutral-medium hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-neutral-medium hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="mb-4 text-sm font-medium text-neutral-dark">Connect</h3>
            <div className="flex space-x-4">
              <Link href="https://facebook.com" className="text-neutral-medium hover:text-primary">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="https://instagram.com" className="text-neutral-medium hover:text-primary">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="https://twitter.com" className="text-neutral-medium hover:text-primary">
                <Twitter className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-sm text-neutral-medium">
            © {new Date().getFullYear()} Zephyr Aero Leather. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
