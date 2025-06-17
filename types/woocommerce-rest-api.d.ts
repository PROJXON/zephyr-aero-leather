import { WooRestApiOptions, WooRestResponse } from './woocommerce';

declare module '@woocommerce/woocommerce-rest-api' {
  export default class WooCommerceRestApi {
    constructor(options: {
      url: string;
      consumerKey: string;
      consumerSecret: string;
      version?: string;
      timeout?: number;
      wpAPI?: boolean;
      queryStringAuth?: boolean;
      axiosConfig?: Record<string, string | number | boolean>;
    });
    get<T = unknown>(endpoint: string): Promise<{
      data: T;
      status: number;
      headers: Record<string, string | number | boolean>;
    }>;
    post<T = unknown>(endpoint: string, data: unknown): Promise<{
      data: T;
      status: number;
      headers: Record<string, string | number | boolean>;
    }>;
    put<T = unknown>(endpoint: string, data: unknown): Promise<{
      data: T;
      status: number;
      headers: Record<string, string | number | boolean>;
    }>;
    delete<T = unknown>(endpoint: string): Promise<{
      data: T;
      status: number;
      headers: Record<string, string | number | boolean>;
    }>;
  }
} 