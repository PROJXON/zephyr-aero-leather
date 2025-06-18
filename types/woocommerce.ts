import { State } from "./types"

// WooCommerce API Types
export interface WooRestApiOptions {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version?: string;
  timeout?: number;
  wpAPI?: boolean;
  queryStringAuth?: boolean;
  axiosConfig?: Record<string, string | number | boolean>;
}

export interface WooRestResponse<T = unknown> {
  data: T;
  status: number;
  headers: Record<string, string | number | boolean>;
}

export interface WooCommerceAddress {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  city: string;
  postcode: string;
  state: State;
  country: "US";
}

// WooCommerce Order Types
export interface WooOrderLineItem {
  id: number;
  name: string;
  product_id: number;
  quantity: number;
  price: string;
  [key: string]: unknown;
}

export interface WooOrderMetaData {
  key: string;
  value: unknown;
}

export interface WooOrder {
  id: number;
  status: string;
  total: string;
  currency: string;
  line_items: WooOrderLineItem[];
  items: CartItemResponse[];
  shipping: WooCommerceAddress;
  billing?: WooCommerceAddress;
  meta_data?: WooOrderMetaData[];
  [key: string]: unknown;
}

export type WooOrderUpdate = Partial<Pick<WooOrder, 'shipping' | 'meta_data' | 'status' | 'line_items' | 'billing' | 'customer_note' | 'payment_method' | 'payment_method_title' | 'set_paid'>>;

// WooCommerce Product Types
export interface WooProduct {
  id: number;
  name: string;
  price: string | number;
  images?: {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
  }[];
  categories?: WooCommerceCategory[];
  [key: string]: unknown;
}

// WooCommerce Category Types
export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

// WooCommerce Customer Types
export interface WooCustomerMeta {
  id?: number;
  key: string;
  value: unknown;
}

export interface WooCustomer {
  id: number;
  email: string;
  meta_data?: WooCustomerMeta[];
  [key: string]: unknown;
}

// WooCommerce Cart Types
export interface CartItemResponse {
  id: number;
  product_id: number;
  quantity: number;
  name?: string;
  price?: string;
  [key: string]: unknown;
}

// WooCommerce Review Types
export interface WooCommerceReview {
  id: number;
  product_id: number;
  reviewer_id: number;
  reviewer: string;
  reviewer_email: string;
  rating: number;
  review: string;
  date_created: string;
  date_created_gmt: string;
  [key: string]: unknown;
}

// WooCommerce API Request Types
export type WooRequestBody = Record<string, unknown>;