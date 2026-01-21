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
  public async init(options: SdkInitOptions): Promise<void> {
    // await loadJSSDK('http://res.wx.qq.com/open/js/jweixin-1.6.0.js');

    // return;
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
      // 尝试执行微信准备工作
      await this.executeWxStrategyPrepare();
      this.initialized = true;
    } catch (error) {
      console.error('XMInstallSDK 初始化失败:', error);
      throw error;
    }
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

  public canUseWxOpen(): boolean {
    return WxOpenStrategy.canUse();
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
   * 渲染微信开放标签
   * 注意：只负责渲染标签，不处理点击事件和兜底逻辑
   */
  public renderWxOpenTag(
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ): void {
    this.checkInitialized();
    WxOpenStrategy.renderOpenTag(container, options);
  }
}

// 创建单例实例
const sdkInstance = new XMInstallSDK();

// 导出默认实例
export default sdkInstance;
