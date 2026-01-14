/**
 * 环境检测模块
 * 提供各种环境相关的判断方法
 */

/**
 * 检测是否为微信浏览器
 */
export function isWeChat(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger') && ua.includes('miniprogram');
}

/**
 * 检测是否为微信内置浏览器（非小程序）
 */
export function isWeChatWebview(): boolean {
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes('micromessenger') && !ua.includes('miniprogram');
}

/**
 * 检测是否为微信环境（小程序或公众号）
 */
export function isWeChatEnv(): boolean {
  return isWeChat() || isWeChatWebview();
}

/**
 * 检测是否为iOS系统
 */
export function isIOS(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  );
}

/**
 * 检测是否为Android系统
 */
export function isAndroid(): boolean {
  return /android/i.test(navigator.userAgent);
}

/**
 * 检测是否为移动设备
 */
export function isMobile(): boolean {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
}

/**
 * 获取环境检测结果
 */
export function getEnvironment(): {
  isWeChat: boolean;
  isWeChatWebview: boolean;
  isWeChatEnv: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
} {
  return {
    isWeChat: isWeChat(),
    isWeChatWebview: isWeChatWebview(),
    isWeChatEnv: isWeChatEnv(),
    isIOS: isIOS(),
    isAndroid: isAndroid(),
    isMobile: isMobile(),
  };
}

export default {
  isWeChat,
  isWeChatWebview,
  isWeChatEnv,
  isIOS,
  isAndroid,
  isMobile,
  getEnvironment,
};
