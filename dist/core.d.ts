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
    init(options: SdkInitOptions): Promise<XMInstallSDK>;
    /**
     * 检查是否已初始化
     */
    private checkInitialized;
    openApp(): void;
    /**
     * 从远程获取应用配置
     */
    private fetchRemoteConfig;
    private executeWxStrategyPrepare;
    /**
     * 渲染打开App的触发器
     * @param container - DOM容器元素
     * @param options - 渲染选项
     */
    renderOpenAppTrigger(container: HTMLElement, options: RenderWxOpenAppOptions): void;
}
declare const sdkInstance: XMInstallSDK;
export default sdkInstance;
//# sourceMappingURL=core.d.ts.map