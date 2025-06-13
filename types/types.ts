export type CartItem = {
  id: number;
  quantity: number;
  lineItemId?: number;
};

export type Product = {
  id: number;
  name: string;
  price: string | number;
  images?: {
    src: string;
    alt?: string;
  }[];
  [key: string]: any;
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

// --- WooCommerce Order Types ---

export interface WooOrder {
  id: number;
  status: string;
  total: string;
  currency: string;
  line_items: Array<{
    id: number;
    name: string;
    product_id: number;
    quantity: number;
    price: string;
    [key: string]: any;
  }>;
  shipping: {
    first_name: string;
    last_name: string;
    address_1: string;
    address_2?: string;
    city: string;
    postcode: string;
    state: string;
    country: string;
  };
  meta_data?: Array<{ key: string; value: any }>;
  [key: string]: any;
};

export type WooOrderUpdate = Partial<Pick<WooOrder, 'shipping' | 'meta_data' | 'status' | 'line_items'>> & Record<string, any>;

// --- Stripe Types ---

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  metadata?: Record<string, string>;
  [key: string]: any;
};
