import { WechatAPI } from '../types';

/**
 * 能力检测模块
 * 检测当前环境是否具备特定能力
 */

let wxInstance: WechatAPI | null = null;
let wxAppId: string | undefined;

/**
 * 注入微信实例
 * @param wx - 微信API实例
 */
export function injectWxInstance(wx: WechatAPI): void {
  wxInstance = wx;
}

/**
 * 设置微信AppId
 * @param appId - 微信AppId
 */
export function setWxAppId(appId: string): void {
  wxAppId = appId;
}

/**
 * 检测是否存在微信AppId
 */
export function hasWxAppId(): boolean {
  return !!wxAppId;
}

/**
 * 检测微信JS-SDK是否已准备就绪
 */
export function isWxReady(): boolean {
  return !!(wxInstance && wxInstance.isReady);
}

/**
 * 检测是否可以使用微信开放标签
 * 条件：
 * 1. 是微信环境
 * 2. 存在微信AppId
 * 3. 微信JS-SDK已就绪
 */
export async function canUseWxOpen(): Promise<boolean> {
  // 这里引入环境检测模块，但为了避免循环依赖，我们直接使用navigator检测
  const isWeChat = /micromessenger/i.test(navigator.userAgent);

  return Promise.resolve(isWeChat && hasWxAppId() && isWxReady());
}

/**
 * 获取当前能力状态
 */
export function getCapability(): {
  hasWxAppId: boolean;
  isWxReady: boolean;
  canUseWxOpen: boolean;
} {
  return {
    hasWxAppId: hasWxAppId(),
    isWxReady: isWxReady(),
    canUseWxOpen: false, // 由于canUseWxOpen是异步的，这里返回false作为占位符
  };
}

export default {
  injectWxInstance,
  setWxAppId,
  hasWxAppId,
  isWxReady,
  canUseWxOpen,
  getCapability,
};
