/**
 * H5 Open App SDK
 * 用于在浏览器/微信WebView环境下以最优策略打开App的SDK
 */

import sdk from './core';
import { SdkInterface, SdkInitOptions, RenderWxOpenAppOptions } from './types';

export default sdk;

export type { SdkInterface, SdkInitOptions, RenderWxOpenAppOptions };

export * from './environment';
export * from './core';

// 为了兼容UMD格式，将SDK挂载到全局对象
if (typeof window !== 'undefined') {
  (window as any).XMInstallSDK = sdk;
}
