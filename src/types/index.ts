/**
 * SDK初始化参数类型
 */
export interface SdkInitOptions {
  /** 业务应用ID */
  id: string;
  /** 微信AppId */
  wxAppId?: string;
  /** Universal Link */
  universalLink?: string;
  /** App Scheme */
  scheme?: string;
  /** 扩展信息 */
  extInfo?: Record<string, any>;
  /** 下载页面URL */
  downloadUrl?: string;
  /** XInstall配置 */
  xInstallConfig?: {
    appKey: string;
    scene: string;
  };
}

/**
 * 渲染微信开放标签选项
 */
export interface RenderWxOpenAppOptions {
  /** 微信AppId */
  appId: string;
  /** 扩展信息 */
  extInfo?: Record<string, any>;
  /** 自定义模板 */
  template?: string;
}

/**
 * 微信相关API类型定义
 */
export interface WechatAPI {
  config: (config: any) => void;
  ready: (callback: () => void) => void;
  error: (callback: (err: any) => void) => void;
  isReady?: boolean;
  [key: string]: any;
}

/**
 * 环境检测结果
 */
export interface EnvironmentDetection {
  isWeChat: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isMobile: boolean;
}

/**
 * 能力检测结果
 */
export interface CapabilityDetection {
  hasWxAppId: boolean;
  isWxReady: boolean;
  canUseWxOpen: boolean;
}

/**
 * 打开App策略接口
 */
export interface OpenAppStrategy {
  execute: () => void;
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
   * 判断是否可以使用微信开放标签
   */
  canUseWxOpen: () => boolean | Promise<boolean>;

  /**
   * 渲染微信开放标签
   */
  renderWxOpenApp: (
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ) => void;

  /**
   * 通过Scheme打开App
   */
  openByScheme: () => void;

  /**
   * 通过Universal Link打开App
   */
  openByUniversalLink: () => void;

  /**
   * 打开下载页面
   */
  openDownload: () => void;

  /**
   * 通过XInstall打开App
   */
  openByXInstall: () => void;

  /**
   * 获取当前环境信息
   */
  getEnvironment: () => EnvironmentDetection;

  /**
   * 获取当前能力信息
   */
  getCapability: () => CapabilityDetection;

  /**
   * 从远程获取应用配置
   */
  fetchRemoteConfig: () => Promise<void>;
}
