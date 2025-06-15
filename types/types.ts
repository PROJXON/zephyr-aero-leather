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

// --- UI & Page Props ---
export interface SectionProps {
  title: string;
  products: Product[]; // Now strictly typed
  link: string;
}

export interface HeroProps {
  title: string;
  subtitle?: string | React.ReactNode; // Broader compatibility
  description?: string;
  images: string[];
}

export interface HeroCarouselProps {
  images: string[];
  altBase?: string;
}

export interface CartProviderProps {
  children: React.ReactNode;
}

export interface AuthProviderProps {
  children: React.ReactNode;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

export interface ProductPageProps {
  params: { id: string };
}

export interface CategoryPageProps {
  params: { slug: string };
}

export interface CommitmentItem {
  title: string;
  text: string;
}

export interface WhyShopItem {
  title: string;
  text: string;
  image: string;
}

export interface AddToCartButtonProps {
  productId: number;
  className?: string;
}

export interface DebugInfo {
  localStorage: unknown;
  cookies: string | null;
  apiResponse: unknown;
  timestamp: string | null;
}

export interface ChangeQuantitySpan {
  onClick: (item: any) => void;
  icon: React.ElementType;
}

export interface ChangeQuantitySpansProps {
  cqs: ChangeQuantitySpan[];
  item: any;
}

export interface CheckoutProps {
  products: Product[];
}

export interface ShippingDetailsState {
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
}

export type ShippingDetailsAction =
  | { type: "FIRSTNAME"; value: string }
  | { type: "LASTNAME"; value: string }
  | { type: "ADDRESS1"; value: string }
  | { type: "ADDRESS2"; value: string }
  | { type: "CITY"; value: string }
  | { type: "ZIPCODE"; value: string }
  | { type: "STATE"; value: string }
  | { type: string; value: string };

export interface ShippingErrors {
  [key: string]: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface EmailTemplateProps {
  name: string;
  email: string;
  message: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface NavbarProps {
  allProducts: Product[];
}

export interface NavButtonProps {
  onClick: () => void;
  className?: string;
  srOnly?: string;
  d?: string;
  text?: string;
  fill?: string;
}