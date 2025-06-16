declare module '@woocommerce/woocommerce-rest-api' {
  interface WooRestApiOptions {
    url: string;
    consumerKey: string;
    consumerSecret: string;
    version?: string;
    timeout?: number;
    wpAPI?: boolean;
    queryStringAuth?: boolean;
    axiosConfig?: Record<string, any>;
  }

  interface WooRestResponse<T = any> {
    data: T;
    status: number;
    headers: Record<string, any>;
  }

  export default class WooCommerceRestApi {
    constructor(options: WooRestApiOptions);
    get<T = any>(endpoint: string): Promise<WooRestResponse<T>>;
    post<T = any>(endpoint: string, data: any): Promise<WooRestResponse<T>>;
    put<T = any>(endpoint: string, data: any): Promise<WooRestResponse<T>>;
    delete<T = any>(endpoint: string): Promise<WooRestResponse<T>>;
  }
} 