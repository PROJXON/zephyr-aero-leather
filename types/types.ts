// Next.js Page Props Types
export interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

export interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Cart Types
export interface CartItem {
  id: number;
  quantity: number;
  name?: string;
  price?: number;
  image?: string;
  slug?: string;
  productId?: number;
  variationId?: number;
  lineItemId?: number;
  variation?: {
    attribute: string;
    value: string;
  };
}

export interface Cart {
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Order Types
export interface Order {
  id: string;
  status: string;
  total: number;
  items: CartItem[];
  shipping: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
  };
  createdAt: string;
}

// Review Types
export interface Review {
  id: number;
  productId: number;
  rating: number;
  comment: string;
  userName: string;
  createdAt: string;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number;
  images: Array<{
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }>;
  category: string;
  categories?: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  collection?: string;
  variations?: {
    id: number;
    attributes: {
      [key: string]: string;
    };
    price: number;
    salePrice?: number;
    stock: number;
  }[];
  stock: number;
  rating?: number;
  reviewCount?: number;
}

// Category Types
export interface Category {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  image: string;
  products?: Product[];
  slugs: string[];
}

export type CategoryMap = Record<string, readonly string[]>;

export interface CategoryTitle {
  title: string;
  subtitle: string;
  images?: string[];
}

export type CategoryTitlesMap = Record<string, CategoryTitle>;

// Collection Types
export interface Collection {
  id?: number;
  name: string;
  slug?: string;
  description: string;
  image: string;
  carouselImages: string[];
  productIds: number[];
  products?: Product[];
}

export type CollectionMap = Record<string, Collection>;

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  termsAccepted: boolean;
  first_name?: string;
  last_name?: string;
}

// Auth Types
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

// Utility Types
export type SortOption = 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
export type FilterOption = 'all' | 'sale' | 'new' | 'bestselling';

// Commitment Types
export interface CommitmentItem {
  title: string;
  text: string;
  icon?: string;
}

// Payment Types
export interface StripePaymentRequestBody {
  amount: number;
  currency: string;
  items: CartItem[];
  woo_order_id?: number;
  payment_intent_id?: string;
  user_local_time?: string;
  shipping?: AddressDetailsState;
  billing?: AddressDetailsState;
}

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

export type CategoryKey = keyof CategoryMap;

export interface FetchProductsOptions {
  category?: CategoryKey;
  per_page?: number;
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
  autoPlay?: boolean;
  interval?: number;
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

export interface AddressFormName {
  first: string;
  last: string;
}

export interface AddressFormAddress {
  line1: string;
  line2?: string;
}

export interface AddressDetailsState {
  name: AddressFormName;
  address: AddressFormAddress;
  city: string;
  zipCode: string;
  state: string;
}

export type AddressDetailsAction =
  | { type: "FIRSTNAME"; value: string; }
  | { type: "LASTNAME"; value: string; }
  | { type: "ADDRESS1"; value: string; }
  | { type: "ADDRESS2"; value: string; }
  | { type: "CITY"; value: string; }
  | { type: "ZIPCODE"; value: string; }
  | { type: "STATE"; value: string; }
  | { type: "ALL"; value: AddressDetailsState }
  | { type: "RESET"; };

export interface AddressErrors {
  [key: string]: string | undefined;
  firstName?: string;
  lastName?: string;
  address?: string;
  city?: string;
  zipCode?: string;
  state?: string;
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

export interface NavLinkProps {
  href: string;
  classes?: string;
  label: string;
  onClick?: () => void;
}

export interface TopNavLinkDropdownItem {
  name: string;
  slug: string;
}

export interface TopNavLinkProps {
  href: string;
  label: string;
  dropdownItems?: TopNavLinkDropdownItem[];
}

export interface NavLoggedOutBtnProps {
  href: string;
  text: string;
}

export interface OrderSummaryProps {
  cartItems: CartItem[];
  products: Product[];
  total: number;
  quantityControls?: Partial<QuantityControls>;
  showReviewLinks?: boolean;
  reviewedProductIds?: number[];
}

export interface QuantityControls {
  updateQuantity: (id: number, qty: number) => void;
  editID: number | null;
  setEditID: (id: number | null) => void;
  newQty: string;
  setNewQty: (qty: string) => void;
  changeQuantity: ChangeQuantitySpan[];
}

export interface PaymentDetailsData {
  items: CartItem[];
  [key: string]: any;
}

export interface ProductCarouselProps {
  products: Product[];
  viewAllLink: string;
}

export interface ProductListProps {
  products: Product[];
}

export interface ProductReview {
  id: number;
  reviewer: string;
  rating: number;
  review: string;
}

export interface ProductReviewsProps {
  productId: number;
}

export interface ResetPasswordFormState {
  password: string;
  confirmPassword: string;
  error: string;
  message: string;
  loading: boolean;
}

export interface AddressDetailsProps {
  details: AddressDetailsState;
  errors: { [key: string]: string };
  states: string[];
}

export interface ShippingFormInputProps {
  name: string;
  placeholder: string;
  value: string;
  span: number;
  error?: string;
  type?: string;
  options?: string[];
}

export type ValidateAddressFunc = (errors: AddressErrors) => void;

export interface StripeFormProps {
  clientSecret: string;
  formError: string | null;
  setFormError: (msg: string | null) => void;
  validateShipping: () => AddressErrors;
  setShippingErrors: ValidateAddressFunc;
  validateBilling: () => AddressErrors;
  setBillingErrors: ValidateAddressFunc;
}

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
}

export interface FetchProductsParams {
  category?: string;
  per_page?: number;
}

export type ViewAllProduct = {
  id: "view-all";
};

export type CarouselProduct = Product | ViewAllProduct;

export type State = "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA" | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD" | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ" | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC" | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY";