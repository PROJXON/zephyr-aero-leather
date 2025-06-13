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

export interface Category {
  name: string;
  description: string;
  image: string;
  slugs: string[];
}

export type CategoryMap = Record<string, readonly string[]>;

export interface CategoryTitle {
  title: string;
  subtitle: string;
  images: string[];
}
export type CategoryTitlesMap = Record<string, CategoryTitle>;

export interface Collection {
  name: string;
  description: string;
  image: string;
  productIds: number[];
  carouselImages: string[];
}

export type CollectionMap = Record<string, Collection>;

export interface User {
  id: number | string;
  name: string;
  email: string;
  // Add any other fields your user object has
  [key: string]: any;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  fetchUserFromServer: () => Promise<void>;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export interface CartContextType {
  cartItems: CartItem[];
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;
  addToCart: (productId: number, quantity?: number) => Promise<void> | void;
  removeFromCart: (productId: number) => Promise<void> | void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  orderId: number | null;
  clearCart: () => Promise<void> | void;
  fetchUserCart: () => Promise<void> | void;
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
  refreshCart: () => Promise<void> | void;
}