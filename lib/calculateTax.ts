import { TaxRate, TaxCalculation } from "../types/types";

// State tax rates (as of 2024 - you should update these regularly)
const stateTaxRates: TaxRate[] = [
  { state: "AL", rate: 0.04, name: "Alabama" },
  { state: "AK", rate: 0.00, name: "Alaska" }, // No state sales tax
  { state: "AZ", rate: 0.056, name: "Arizona" },
  { state: "AR", rate: 0.065, name: "Arkansas" },
  { state: "CA", rate: 0.0725, name: "California" },
  { state: "CO", rate: 0.029, name: "Colorado" },
  { state: "CT", rate: 0.0635, name: "Connecticut" },
  { state: "DE", rate: 0.00, name: "Delaware" }, // No state sales tax
  { state: "FL", rate: 0.06, name: "Florida" },
  { state: "GA", rate: 0.04, name: "Georgia" },
  { state: "HI", rate: 0.04, name: "Hawaii" },
  { state: "ID", rate: 0.06, name: "Idaho" },
  { state: "IL", rate: 0.0625, name: "Illinois" },
  { state: "IN", rate: 0.07, name: "Indiana" },
  { state: "IA", rate: 0.06, name: "Iowa" },
  { state: "KS", rate: 0.065, name: "Kansas" },
  { state: "KY", rate: 0.06, name: "Kentucky" },
  { state: "LA", rate: 0.0445, name: "Louisiana" },
  { state: "ME", rate: 0.055, name: "Maine" },
  { state: "MD", rate: 0.06, name: "Maryland" },
  { state: "MA", rate: 0.0625, name: "Massachusetts" },
  { state: "MI", rate: 0.06, name: "Michigan" },
  { state: "MN", rate: 0.06875, name: "Minnesota" },
  { state: "MS", rate: 0.07, name: "Mississippi" },
  { state: "MO", rate: 0.04225, name: "Missouri" },
  { state: "MT", rate: 0.00, name: "Montana" }, // No state sales tax
  { state: "NE", rate: 0.055, name: "Nebraska" },
  { state: "NV", rate: 0.0685, name: "Nevada" },
  { state: "NH", rate: 0.00, name: "New Hampshire" }, // No state sales tax
  { state: "NJ", rate: 0.06625, name: "New Jersey" },
  { state: "NM", rate: 0.05125, name: "New Mexico" },
  { state: "NY", rate: 0.04, name: "New York" },
  { state: "NC", rate: 0.0475, name: "North Carolina" },
  { state: "ND", rate: 0.05, name: "North Dakota" },
  { state: "OH", rate: 0.0575, name: "Ohio" },
  { state: "OK", rate: 0.045, name: "Oklahoma" },
  { state: "OR", rate: 0.00, name: "Oregon" }, // No state sales tax
  { state: "PA", rate: 0.06, name: "Pennsylvania" },
  { state: "RI", rate: 0.07, name: "Rhode Island" },
  { state: "SC", rate: 0.06, name: "South Carolina" },
  { state: "SD", rate: 0.045, name: "South Dakota" },
  { state: "TN", rate: 0.07, name: "Tennessee" },
  { state: "TX", rate: 0.0625, name: "Texas" },
  { state: "UT", rate: 0.061, name: "Utah" },
  { state: "VT", rate: 0.06, name: "Vermont" },
  { state: "VA", rate: 0.053, name: "Virginia" },
  { state: "WA", rate: 0.065, name: "Washington" },
  { state: "WV", rate: 0.06, name: "West Virginia" },
  { state: "WI", rate: 0.05, name: "Wisconsin" },
  { state: "WY", rate: 0.04, name: "Wyoming" }
];

// Tax-exempt states (no sales tax)
const TAX_EXEMPT_STATES = ["AK", "DE", "MT", "NH", "OR"];

export function getTaxRate(state: string): TaxRate {
  const taxRate = stateTaxRates.find(rate => rate.state === state);
  return taxRate || { state, rate: 0, name: "Unknown" };
}

export function calculateTax(
  subtotal: number, // in cents
  state: string,
  shippingAmount: number = 0 // in cents, default to 0 for backward compatibility
): TaxCalculation {
  // No tax for exempt states
  if (TAX_EXEMPT_STATES.includes(state)) {
    return {
      taxableAmount: subtotal + shippingAmount,
      taxAmount: 0,
      rate: 0,
      state
    };
  }

  const taxRate = getTaxRate(state);
  // Calculate tax on both subtotal and shipping (shipping is taxable in most states)
  const taxableAmount = subtotal + shippingAmount;
  const taxAmount = Math.round(taxableAmount * taxRate.rate);

  return {
    taxableAmount,
    taxAmount,
    rate: taxRate.rate,
    state
  };
}

export function isTaxExempt(state: string): boolean {
  return TAX_EXEMPT_STATES.includes(state);
}

export function getStateTaxRates(): TaxRate[] {
  return stateTaxRates;
} 