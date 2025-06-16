// WooCommerce API Types
export interface WooRestApiOptions {
  url: string;
  consumerKey: string;
  consumerSecret: string;
  version?: string;
  timeout?: number;
  wpAPI?: boolean;
  queryStringAuth?: boolean;
  axiosConfig?: Record<string, any>;
}

export interface WooRestResponse<T = any> {
  data: T;
  status: number;
  headers: Record<string, any>;
}

// WooCommerce Order Types
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
}

export type WooOrderUpdate = Partial<Pick<WooOrder, 'shipping' | 'meta_data' | 'status' | 'line_items'>> & Record<string, any>;

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
  [key: string]: any;
}

// WooCommerce Category Types
export interface WooCommerceCategory {
  id: number;
  name: string;
  slug: string;
}

// WooCommerce API Request Types
export type WooRequestBody = Record<string, any>; 

export interface WooError {
  code: string;
  message: string;
  data?: { status?: number; [key: string]: unknown };
  [key: string]: unknown;
}

// WooCommerce-specific query params for fetching products
export interface FetchProductsParams {
  per_page: number;
  status: string;
  category?: string; // comma-separated IDs
  page?: number;
  [key: string]: string | number | undefined;
}