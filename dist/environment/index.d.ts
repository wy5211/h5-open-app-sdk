/**
 * 环境检测模块
 * 提供各种环境相关的判断方法
 */
/**
 * 检测是否为微信浏览器
 */
export declare function isWeChat(): boolean;
/**
 * 检测是否为微信内置浏览器（非小程序）
 */
export declare function isWeChatWebview(): boolean;
/**
 * 检测是否为微信环境（小程序或公众号）
 */
export declare function isWeChatEnv(): boolean;
/**
 * 检测是否为iOS系统
 */
export declare function isIOS(): boolean;
/**
 * 检测是否为Android系统
 */
export declare function isAndroid(): boolean;
/**
 * 检测是否为移动设备
 */
export declare function isMobile(): boolean;
declare const _default: {
    isWeChat: typeof isWeChat;
    isWeChatWebview: typeof isWeChatWebview;
    isWeChatEnv: typeof isWeChatEnv;
    isIOS: typeof isIOS;
    isAndroid: typeof isAndroid;
    isMobile: typeof isMobile;
};
export default _default;
//# sourceMappingURL=index.d.ts.map