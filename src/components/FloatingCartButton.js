"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";

export default function FloatingCartButton() {
  const { cart } = useCart();

  return (
    <Link href="/cart" className="fixed bottom-4 right-4">
      <Button
        variant="default"
        size="icon"
        className="relative h-12 w-12 rounded-full bg-primary text-white shadow-lg hover:bg-accent"
      >
        <ShoppingBag className="h-6 w-6" />
        {cart.length > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-primary">
            {cart.length}
          </span>
        )}
      </Button>
    </Link>
  );
} 