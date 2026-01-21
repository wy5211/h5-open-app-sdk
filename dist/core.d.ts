import { SdkInitOptions, RenderWxOpenAppOptions } from './types';
/**
 * H5打开App的SDK核心类
 */
declare class XMInstallSDK {
    private initialized;
    private options;
    /**
     * 初始化SDK
     */
    init(options: SdkInitOptions): Promise<void>;
    /**
     * 检查是否已初始化
     */
    private checkInitialized;
    openApp(): void;
    /**
     * 从远程获取应用配置
     */
    private fetchRemoteConfig;
    canUseWxOpen(): boolean;
    private executeWxStrategyPrepare;
    /**
     * 渲染微信开放标签
     * 注意：只负责渲染标签，不处理点击事件和兜底逻辑
     */
    renderWxOpenTag(container: HTMLElement, options: RenderWxOpenAppOptions): void;
}
declare const sdkInstance: XMInstallSDK;
export default sdkInstance;
//# sourceMappingURL=core.d.ts.map