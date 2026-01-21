import { SdkInitOptions, RenderWxOpenAppOptions } from './types';
import { isWeChatEnv } from './environment';
import WxOpenStrategy from './strategy/wxOpenStrategy';
import commonStrategy from './strategy/commonStrategy';
import { getAppBaseConfig } from './services/config';
import context from './utils/context';
import { setBaseUrl } from './utils/request';

/**
 * H5打开App的SDK核心类
 */
class XMInstallSDK {
  private initialized: boolean = false;
  private options: SdkInitOptions | null = null;

  /**
   * 初始化SDK
   */
  public async init(options: SdkInitOptions): Promise<XMInstallSDK> {
    if (!options?.id) {
      throw new Error('XMInstallSDK 未配置应用ID');
    }
    this.options = options;
    console.log('XMInstallSDK initialized with options:', this.options);

    // 设置请求的基础URL
    setBaseUrl(options.isDebug);
    context.setInitData(options);
    try {
      await this.fetchRemoteConfig();
      if (options.loadWxSdk) {
        // 尝试执行微信准备工作
        await this.executeWxStrategyPrepare();
      }
      this.initialized = true;
    } catch (error) {
      console.error('XMInstallSDK 初始化失败:', error);
      throw error;
    }
    return this;
  }

  /**
   * 检查是否已初始化
   */
  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('XMInstallSDK未初始化，请先调用init方法');
    }
  }

  public openApp() {
    this.checkInitialized();
    try {
      commonStrategy.execute();
    } catch (error) {
      console.error('XMInstallSDK 打开App失败:', error);
      throw error;
    }
  }

  /**
   * 从远程获取应用配置
   */
  private async fetchRemoteConfig(): Promise<void> {
    if (!this.options?.id) {
      throw new Error('未配置应用ID，无法获取远程配置');
    }

    try {
      const config = await getAppBaseConfig({
        app_id: this.options.id,
        url: window.location.href,
      });
      // 更新当前选项
      context.set(config);
      console.log('成功获取远程配置:', config);
    } catch (error) {
      console.error('获取远程配置失败:', error);
      throw error;
    }
  }

  // 执行微信策略
  private async executeWxStrategyPrepare(): Promise<void> {
    if (isWeChatEnv() && context.isSupportOpenTag()) {
      try {
        await WxOpenStrategy.prepare();
      } catch (error) {
        console.error('微信策略执行失败:', error);
        (window as any).wx = null;
        // 尝试其他策略
      }
    }
  }

  /**
   * 渲染打开App的触发器
   * @param container - DOM容器元素
   * @param options - 渲染选项
   */
  public renderOpenAppTrigger(
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ): void {
    this.checkInitialized();

    // 容器有效性检查
    if (!container) {
      throw new Error('容器元素不能为空');
    }

    if (!(container instanceof HTMLElement)) {
      throw new Error('容器必须是有效的 HTMLElement');
    }

    // SSR环境检查
    if (typeof document === 'undefined') {
      console.warn('renderOpenAppTrigger 只能在浏览器环境中使用');
      return;
    }

    // 检查容器是否已挂载到DOM树
    // if (!document.body.contains(container)) {
    //   console.warn('容器元素尚未挂载到DOM树，可能导致渲染失败');
    // }

    try {
      if (WxOpenStrategy.canUse()) {
        WxOpenStrategy.renderOpenTag(container, options);
      } else {
        commonStrategy.renderOpenAppDom(container, options);
      }
    } catch (error) {
      console.error('渲染打开App触发器失败:', error);
      throw error;
    }
  }
}

// 创建单例实例
const sdkInstance = new XMInstallSDK();

// 导出默认实例
export default sdkInstance;
