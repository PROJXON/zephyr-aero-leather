"use client";
import { useCart } from "@/app/context/CartContext";

export default function CheckoutCart() {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const handleChange = (id, value) => {
    const qty = parseInt(value);
    if (qty > 0) {
      updateQuantity(id, qty);
    }
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (cart.length === 0) {
    return <p>Your cart is empty.</p>;
  }

  return (
    <div className="space-y-4">
      {cart.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 border p-4 rounded-lg shadow-sm"
        >
          <img
            src={item.images[0]?.src}
            alt={item.name}
            className="w-20 h-20 object-cover"
          />
          <div className="flex-1">
            <h2 className="font-medium">{item.name}</h2>
            <p className="text-sm text-gray-500">${item.price}</p>
            <input
              type="number"
              value={item.quantity}
              onChange={(e) => handleChange(item.id, e.target.value)}
              min="1"
              className="border rounded px-2 py-1 w-16 mt-2"
            />
          </div>
          <button
            onClick={() => removeFromCart(item.id)}
            className="text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}
      <p className="mt-6 text-lg font-bold">Total: ${total.toFixed(2)}</p>
    </div>
  );
}
