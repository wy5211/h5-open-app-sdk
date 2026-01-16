/**
 * 加载外部JavaScript资源
 * @param js_sdk_url - JS SDK的URL
 * @returns Promise<void>
 */
export function loadJSSDK(js_sdk_url: string): Promise<void> {
  // 确保在浏览器环境中运行
  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.reject(new Error('仅在浏览器环境中支持加载JS SDK'));
  }

  return new Promise<void>((resolve, reject) => {
    // 创建script标签
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = js_sdk_url;

    // 脚本加载成功
    script.onload = () => {
      resolve();
    };

    // 脚本加载失败
    script.onerror = () => {
      reject(new Error(`加载脚本失败: ${js_sdk_url}`));
    };

    // 将脚本添加到页面
    document.head.appendChild(script);
  });
}
