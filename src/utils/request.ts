/**
 * 通用请求封装
 */

interface RequestOptions {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  data?: any;
  headers?: Record<string, string>;
  timeout?: number; // 请求超时时间，默认 10 秒
}

interface ApiResponse<T = any> {
  data: T;
  code: number;
  msg: string;
}

class RequestError extends Error {
  public response?: Response;
  public data?: any;

  constructor(message: string, response?: Response, data?: any) {
    super(message);
    this.name = 'RequestError';
    this.response = response;
    this.data = data;
  }
}

/**
 * 通用请求函数
 * @param options 请求配置
 * @returns Promise<ApiResponse>
 */
export async function request<T = any>(
  options: RequestOptions
): Promise<ApiResponse<T>> {
  const {
    url,
    method,
    data,
    headers = {},
    timeout = 10000, // 默认 10 秒超时
  } = options;

  // 构建请求配置
  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  // 如果是 POST、PUT、PATCH 方法，将数据转换为 JSON 字符串
  if (['POST', 'PUT', 'PATCH'].includes(method) && data) {
    config.body = JSON.stringify(data);
  }

  // 创建 AbortController 用于超时控制
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...config,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // 解析响应数据
    let responseData: any;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      throw new RequestError(
        `HTTP Error: ${response.status} ${response.statusText}`,
        response,
        responseData
      );
    }

    return responseData;
  } catch (error) {
    clearTimeout(timeoutId);

    // 处理请求被中止的情况
    if (error instanceof Error && error.name === 'AbortError') {
      throw new RequestError(`Request timeout after ${timeout}ms`);
    }

    // 重新抛出其他错误
    if (error instanceof RequestError) {
      throw error;
    }

    // 检查是否为普通 Error 对象
    if (error instanceof Error) {
      throw new RequestError(`Network error: ${error.message}`);
    }

    // 其他类型的错误
    throw new RequestError(
      `Network error: ${(error as Error).message || 'Unknown error'}`
    );
  }
}

/**
 * GET 请求快捷方法
 */
export async function get<T = any>(
  url: string,
  options?: Partial<Omit<RequestOptions, 'url' | 'method'>>
) {
  return request<T>({ url, method: 'GET', ...options });
}

/**
 * POST 请求快捷方法
 */
export async function post<T = any>(
  url: string,
  data?: any,
  options?: Partial<Omit<RequestOptions, 'url' | 'method' | 'data'>>
) {
  return request<T>({ url, method: 'POST', data, ...options });
}

/**
 * PUT 请求快捷方法
 */
export async function put<T = any>(
  url: string,
  data?: any,
  options?: Partial<Omit<RequestOptions, 'url' | 'method' | 'data'>>
) {
  return request<T>({ url, method: 'PUT', data, ...options });
}

/**
 * DELETE 请求快捷方法
 */
export async function del<T = any>(
  url: string,
  options?: Partial<Omit<RequestOptions, 'url' | 'method'>>
) {
  return request<T>({ url, method: 'DELETE', ...options });
}

/**
 * PATCH 请求快捷方法
 */
export async function patch<T = any>(
  url: string,
  data?: any,
  options?: Partial<Omit<RequestOptions, 'url' | 'method' | 'data'>>
) {
  return request<T>({ url, method: 'PATCH', data, ...options });
}
