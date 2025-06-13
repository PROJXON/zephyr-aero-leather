export type CartItem = {
  id: number;
  quantity: number;
  lineItemId?: number; // Optional — appears in some cart states
};

export type Product = {
  id: number;
  name: string;
  price: string | number; // Woo can send stringified prices
  images?: {
    src: string;
    alt?: string;
  }[];
  [key: string]: any; // Flexible for WooCommerce's API fields
};

export type ShippingDetails = {
  name: {
    first: string;
    last: string;
  };
  address: {
    line1: string;
    line2?: string;
  };
  city: string;
  zipCode: string;
  state: string;
};

export type StripePaymentRequestBody = {
  amount: number;
  items: CartItem[];
  woo_order_id?: number;
  payment_intent_id?: string;
  user_local_time?: string;
  shipping?: ShippingDetails;
};

export type WooRequestBody = Record<string, any>;

export type UpdateQuantityFn = (id: number, quantity: number) => void;
