/**
 * SDK初始化参数类型
 */
export interface SdkInitOptions {
  /** 业务应用ID */
  id: string;
  isDebug?: boolean; // 调试模式
  ext_info?: string; // 业务参数
}

/**
 * 渲染微信开放标签选项
 */
export interface RenderWxOpenAppOptions {
  /** 自定义模板 */
  template?: string;
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
   */
  init: (options: SdkInitOptions) => Promise<void>;

  /**
   * 打开App
   */
  openApp: () => void;

  /**
   * 检查微信策略是否就绪
   */
  isWxReady: () => boolean;

  /**
   * 渲染微信开放标签
   */
  renderWxOpenTag: (
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ) => void;
}
