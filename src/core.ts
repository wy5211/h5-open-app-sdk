import { SdkInitOptions, RenderWxOpenAppOptions } from './types';
import { isWeChat, getEnvironment, isIOS, isAndroid } from './environment';
import {
  injectWxInstance,
  setWxAppId,
  hasWxAppId,
  isWxReady,
  canUseWxOpen as checkCanUseWxOpen,
  getCapability,
} from './capability';
import {
  WxOpenStrategy,
  SchemeStrategy,
  UniversalLinkStrategy,
  DownloadStrategy,
  XInstallStrategy,
} from './strategy';

/**
 * H5打开App的SDK核心类
 */
class H5OpenAppSDK {
  private initialized: boolean = false;
  private options: SdkInitOptions | null = null;

  /**
   * 初始化SDK
   */
  public init(options: SdkInitOptions): void {
    this.options = options;
    this.initialized = true;

    // 如果提供了微信AppId，保存它
    if (options.wxAppId) {
      setWxAppId(options.wxAppId);
    }

    console.log('H5OpenAppSDK initialized with options:', options);
  }

  /**
   * 检查是否已初始化
   */
  private checkInitialized(): void {
    if (!this.initialized) {
      throw new Error('H5OpenAppSDK未初始化，请先调用init方法');
    }
  }

  /**
   * 判断是否可以使用微信开放标签
   */
  public async canUseWxOpen(): Promise<boolean> {
    this.checkInitialized();
    return await checkCanUseWxOpen();
  }

  /**
   * 渲染微信开放标签
   * 注意：只负责渲染标签，不处理点击事件和兜底逻辑
   */
  public renderWxOpenApp(
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ): void {
    this.checkInitialized();

    // 清空容器
    container.innerHTML = '';

    // 创建微信开放标签元素
    const el = document.createElement('wx-open-launch-app');
    el.setAttribute('appid', options.appId);

    // 设置扩展信息
    if (options.extInfo) {
      el.setAttribute('extinfo', JSON.stringify(options.extInfo));
    }

    // 设置模板内容
    el.innerHTML = `
      <script type="text/wxtag-template">
        ${options.template || '<div>打开 App</div>'}
      </script>
    `;

    // 添加到容器
    container.appendChild(el);
  }

  /**
   * 通过Scheme打开App
   */
  public openByScheme(): void {
    this.checkInitialized();

    if (!this.options?.scheme) {
      console.warn('未配置scheme，无法通过scheme打开App');
      return;
    }

    const strategy = new SchemeStrategy(
      this.options.scheme,
      this.options.downloadUrl
    );
    strategy.execute();
  }

  /**
   * 通过Universal Link打开App
   */
  public openByUniversalLink(): void {
    this.checkInitialized();

    if (!this.options?.universalLink) {
      console.warn('未配置universalLink，无法通过Universal Link打开App');
      return;
    }

    const strategy = new UniversalLinkStrategy(
      this.options.universalLink,
      this.options.downloadUrl
    );
    strategy.execute();
  }

  /**
   * 打开下载页面
   */
  public openDownload(): void {
    this.checkInitialized();

    if (!this.options?.downloadUrl) {
      console.warn('未配置downloadUrl，无法打开下载页面');
      return;
    }

    const strategy = new DownloadStrategy(this.options.downloadUrl);
    strategy.execute();
  }

  /**
   * 通过XInstall打开App
   */
  public openByXInstall(): void {
    this.checkInitialized();

    if (!this.options?.xInstallConfig) {
      console.warn('未配置xInstallConfig，无法通过XInstall打开App');
      return;
    }

    const { appKey, scene } = this.options.xInstallConfig;
    const strategy = new XInstallStrategy(appKey, scene, this.options.extInfo);
    strategy.execute();
  }

  /**
   * 统一的打开App方法
   * 根据当前环境选择最优策略
   */
  public async openApp(): Promise<void> {
    this.checkInitialized();

    // 如果是在微信环境中
    if (isWeChat()) {
      // 检查是否可以使用微信开放标签
      if (await this.canUseWxOpen()) {
        // 这里应该渲染到一个临时容器中并触发点击，但由于安全限制，
        // 实际使用时需要业务方自行处理渲染和点击逻辑
        console.log('在微信环境中，建议使用renderWxOpenApp方法渲染按钮');
        return;
      } else {
        // 如果不能使用微信开放标签，则尝试其他方式
        if (this.options?.scheme) {
          this.openByScheme();
        } else if (this.options?.downloadUrl) {
          this.openDownload();
        }
      }
    } else {
      // 在非微信环境中，优先使用Universal Link，然后是Scheme
      if (this.options?.universalLink) {
        this.openByUniversalLink();
      } else if (this.options?.scheme) {
        this.openByScheme();
      } else if (this.options?.downloadUrl) {
        this.openDownload();
      }
    }
  }

  /**
   * 注入微信实例
   * 由业务方在微信JS-SDK准备就绪后调用
   */
  public injectWx(wxFramework: any): void {
    injectWxInstance(wxFramework);
  }

  /**
   * 获取当前环境信息
   */
  public getEnvironment(): {
    isWeChat: boolean;
    isWeChatWebview: boolean;
    isWeChatEnv: boolean;
    isIOS: boolean;
    isAndroid: boolean;
    isMobile: boolean;
  } {
    return getEnvironment();
  }

  /**
   * 获取当前能力信息
   */
  public getCapability(): {
    hasWxAppId: boolean;
    isWxReady: boolean;
    canUseWxOpen: boolean;
  } {
    return getCapability();
  }
}

// 创建单例实例
const sdkInstance = new H5OpenAppSDK();

// 导出默认实例
export default sdkInstance;

// 导出类型和工具函数
export {
  H5OpenAppSDK,
  injectWxInstance,
  setWxAppId,
  isWeChat,
  isIOS,
  isAndroid,
};
