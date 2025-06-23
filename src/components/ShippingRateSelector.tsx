"use client";
import { useState, useEffect } from "react";
import { ShippingRate, ShippingRateSelectorProps } from "../../types/types";
import { getAvailableShippingRates, calculateShipping } from "../../lib/calculateShipping";
import { formatCurrency } from "../../lib/calculateTotalWithTaxAndShipping";
import calculateTotal from "../../lib/calculateTotal";

export default function ShippingRateSelector({
  state,
  zipCode,
  cartItems,
  products,
  selectedRateId,
  onRateSelect,
  className = ""
}: ShippingRateSelectorProps) {
  const [availableRates, setAvailableRates] = useState<ShippingRate[]>([]);

  useEffect(() => {
    if (state && zipCode && cartItems.length > 0) {
      const baseRates = getAvailableShippingRates();
      const subtotal = calculateTotal(cartItems, products);
      
      // Calculate actual prices for each rate
      const calculatedRates = baseRates.map(rate => {
        const { shipping } = calculateShipping(subtotal, zipCode, cartItems, products, rate.id);
        return {
          ...rate,
          price: shipping
        };
      });
      
      setAvailableRates(calculatedRates);
      
      // Auto-select first rate if none selected
      if (!selectedRateId && calculatedRates.length > 0) {
        onRateSelect(calculatedRates[0].id);
      }
    }
  }, [state, zipCode, cartItems, products, selectedRateId, onRateSelect]);

  if (!state || !zipCode || availableRates.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-3 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900">Shipping Options</h3>
      <div className="space-y-2">
        {availableRates.map((rate) => (
          <label
            key={rate.id}
            className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
              selectedRateId === rate.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <input
              type="radio"
              name="shippingRate"
              value={rate.id}
              checked={selectedRateId === rate.id}
              onChange={(e) => onRateSelect(e.target.value)}
              className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
            />
            <div className="ml-3 flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-900">{rate.name}</p>
                  <p className="text-sm text-gray-500">{rate.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {rate.price === 0 ? "Calculating..." : formatCurrency(rate.price)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {rate.deliveryDays === 1 ? "Next day" : `${rate.deliveryDays} days`}
                  </p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
} 