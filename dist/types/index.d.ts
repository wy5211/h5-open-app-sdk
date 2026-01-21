/**
 * SDK初始化参数类型
 */
export interface SdkInitOptions {
    /** 业务应用ID */
    id: string;
    isDebug?: boolean;
    ext_info?: string;
    loadWxSdk?: boolean;
}
/**
 * 渲染微信开放标签选项
 */
export interface RenderWxOpenAppOptions {
    /** 自定义模板（HTML字符串或DOM元素） */
    template: string | HTMLElement;
}
/**
 * 打开App策略接口
 */
export interface OpenAppStrategy {
    execute: () => Promise<void> | void;
}
/**
 * SDK核心接口
 */
export interface SdkInterface {
    /**
     * 初始化SDK
     * @param options - SDK初始化参数
     * @returns Promise<void>
     */
    init: (options: SdkInitOptions) => Promise<void>;
    /**
     * 打开App
     * @throws 如果SDK未初始化会抛出错误
     */
    openApp: () => void;
    /**
     * 渲染打开App的触发器
     * @param container - 要渲染到的DOM容器
     * @param options - 渲染选项，可选
     */
    renderOpenAppTrigger: (container: HTMLElement, options?: RenderWxOpenAppOptions) => void;
}
//# sourceMappingURL=index.d.ts.map