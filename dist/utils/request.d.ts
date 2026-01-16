/**
 * 通用请求封装
 */
interface RequestOptions {
    url: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    data?: any;
    headers?: Record<string, string>;
    timeout?: number;
}
interface ApiResponse<T = any> {
    data: T;
    code: number;
    msg: string;
}
export declare function setBaseUrl(isDebug?: boolean): void;
/**
 * 通用请求函数
 * @param options 请求配置
 * @returns Promise<ApiResponse>
 */
export declare function request<T = any>(options: RequestOptions): Promise<ApiResponse<T>>;
/**
 * GET 请求快捷方法
 */
export declare function get<T = any>(url: string, options?: Partial<Omit<RequestOptions, 'url' | 'method'>>): Promise<ApiResponse<T>>;
/**
 * POST 请求快捷方法
 */
export declare function post<T = any>(url: string, data?: any, options?: Partial<Omit<RequestOptions, 'url' | 'method' | 'data'>>): Promise<ApiResponse<T>>;
export {};
//# sourceMappingURL=request.d.ts.map