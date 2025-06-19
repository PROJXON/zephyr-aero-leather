import { WooCommerceAddress } from "./woocommerce";

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
    weight?: number; // Weight in pounds
  }[];
  stock: number;
  weight: number; // Weight in pounds
  rating?: number;
  reviewCount?: number;
  date_modified?: string;
  date_created?: string;
  modified?: string;
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
export interface ApiResponse<T = void> {
  data?: T;
  error?: string;
  message?: string;
  success?: boolean;
}

export interface AuthApiResponse extends ApiResponse<User> {
  user?: User;
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
  selectedShippingRateId?: string;
  shippingAmount?: number; // Shipping amount in cents
  taxAmount?: number; // Tax amount in cents
}

export type UpdateQuantityFn = (id: number, quantity: number) => void;

// --- Stripe Types ---

export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  client_secret?: string;
  metadata?: Record<string, string>;
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      state: string;
      country: string;
    };
  };
  payment_method_types: string[];
}

export interface StripeError {
  message: string;
  type?: string;
  code?: string;
  raw?: unknown;
}

export interface StripePaymentResponse {
  clientSecret: string;
  payment_intent_id: string;
  error?: string;
  type?: string;
  code?: string;
  details?: Record<string, unknown> | string;
}

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
  isLoading: boolean;
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
  localStorage: Record<string, unknown> | null;
  cookies: string | null;
  apiResponse: Record<string, unknown> | string | null;
  timestamp: string | null;
}

export interface ChangeQuantitySpan {
  onClick: (item: CartItem) => void;
  icon: React.ElementType;
}

export interface ChangeQuantitySpansProps {
  cqs: ChangeQuantitySpan[];
  item: CartItem;
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
  badgeCount?: number;
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
  shippingDetails?: WooCommerceAddress;
  subtotal?: number;
  shipping?: number;
  tax?: number;
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
  productId: number;
  userId: number;
  reviewer: string;
  rating: number;
  review: string;
  date_created: string;
  error?: string;
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

export type State =
  | "AL" | "AK" | "AZ" | "AR" | "CA" | "CO" | "CT" | "DE" | "FL" | "GA"
  | "HI" | "ID" | "IL" | "IN" | "IA" | "KS" | "KY" | "LA" | "ME" | "MD"
  | "MA" | "MI" | "MN" | "MS" | "MO" | "MT" | "NE" | "NV" | "NH" | "NJ"
  | "NM" | "NY" | "NC" | "ND" | "OH" | "OK" | "OR" | "PA" | "RI" | "SC"
  | "SD" | "TN" | "TX" | "UT" | "VT" | "VA" | "WA" | "WV" | "WI" | "WY";

export interface AddressFormInputProps {
  name: string;
  placeholder: string;
  value: string;
  span: number;
  error: string;
  type: "select" |
  "button" |
  "checkbox" |
  "color" |
  "date" |
  "datetime-local" |
  "email" |
  "file" |
  "hidden" |
  "image" |
  "month" |
  "number" |
  "password" |
  "radio" |
  "range" |
  "reset" |
  "search" |
  "submit" |
  "tel" |
  "text" |
  "time" |
  "url" |
  "week"
}

export type AddressFormChange = React.ChangeEvent<HTMLInputElement | HTMLSelectElement>

// Authentication Types
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
  };
  error?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  error?: string;
}

export interface JWTResponse {
  token: string;
  user: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

import type { WooCustomer } from "./woocommerce";

export interface ResetPasswordResponse {
  success: boolean;
  message?: string;
  error?: string;
  user?: WooCustomer;
}

export interface PaymentIntentResponse {
  amount: number;
  status: string;
  items: CartItem[];
  wooOrderId?: string;
}

// Stripe Types
export interface StripePaymentIntentParams {
  amount: number;
  currency: string;
  metadata: Record<string, string>;
  payment_method_types?: string[];
  shipping?: {
    name: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      postal_code: string;
      state: string;
      country: string;
    };
  };
}

export interface StripeEvent {
  type: string;
  data: {
    object: {
      id: string;
      status: string;
      metadata?: Record<string, string>;
    };
  };
}

export interface ResendError {
  message: string;
  name?: string;
  statusCode?: number;
}

export interface WebhookResponse {
  received?: boolean;
  success?: boolean;
  error?: boolean;
}

export interface WordPressUser {
  id: number;
  name: string;
  email: string;
  roles: string[];
  [key: string]: unknown;
}

export interface ForgotPasswordFormState {
  email: string;
  message: string;
  error: string;
  loading: boolean;
}

export interface ProductImageCardProps {
  src: string;
  alt: string;
  className?: string;
}

export interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface AddressValidationResponse {
  valid: boolean;
  validatedAddress?: AddressDetailsState;
  error?: string;
  suggestions: AddressDetailsState[];
  dpvConfirmation?: string;
  carrierRoute?: string;
  deliveryPoint?: string;
}

export interface USPSAddress {
  Address1: string;
  Address2?: string;
  City: string;
  State: string;
  Zip5: string;
  Zip4?: string;
  DeliveryPoint?: string;
  CarrierRoute?: string;
  Footnotes?: string;
  DPVConfirmation?: string;
  DPVCMRA?: string;
  DPVVacant?: string;
  Business?: string;
  CentralDeliveryPoint?: string;
  Vacant?: string;
}

export interface USPSAddressValidationRequest {
  AddressValidateRequest: {
    Address: USPSAddress;
  };
}

export interface ShippingRate {
  id: string;
  name: string;
  price: number; // in cents
  deliveryDays: number;
  description?: string;
}

export interface TaxRate {
  state: string;
  rate: number;
  name: string;
}

export interface TaxCalculation {
  taxableAmount: number;
  taxAmount: number;
  rate: number;
  state: string;
}

export interface ShippingCalculation {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingRate?: any;
  taxRate?: number;
}