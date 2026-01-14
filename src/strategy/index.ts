/**
 * 策略层实现
 * 包含不同的打开App策略
 */

import { OpenAppStrategy } from '../types';

/**
 * 延迟执行函数
 * @param fn - 要执行的函数
 * @param delay - 延迟时间(毫秒)
 */
function delayExecute(fn: () => void, delay: number = 500): void {
  setTimeout(fn, delay);
}

/**
 * 微信开放标签策略
 */
export class WxOpenStrategy implements OpenAppStrategy {
  private appId: string;
  private extInfo?: Record<string, any>;
  private template?: string;

  constructor(appId: string, extInfo?: Record<string, any>, template?: string) {
    this.appId = appId;
    this.extInfo = extInfo;
    this.template = template;
  }

  execute(): void {
    // 这个策略只是准备渲染，实际渲染由renderWxOpenApp完成
    console.log(`准备使用微信开放标签策略，AppId: ${this.appId}`);
  }
}

/**
 * Scheme策略
 */
export class SchemeStrategy implements OpenAppStrategy {
  private scheme: string;
  private fallbackUrl?: string;

  constructor(scheme: string, fallbackUrl?: string) {
    this.scheme = scheme;
    this.fallbackUrl = fallbackUrl;
  }

  execute(): void {
    // 创建一个隐藏的iframe来尝试打开app
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    iframe.src = this.scheme;
    document.body.appendChild(iframe);

    // 设置超时，如果app没有打开则跳转到fallback url
    if (this.fallbackUrl) {
      delayExecute(() => {
        document.body.removeChild(iframe);
        window.location.href = this.fallbackUrl!;
      }, 2000); // 2秒后认为打开失败，跳转到fallback页面
    } else {
      // 如果没有fallback url，则在一段时间后移除iframe
      delayExecute(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 2000);
    }
  }
}

/**
 * Universal Link策略
 */
export class UniversalLinkStrategy implements OpenAppStrategy {
  private universalLink: string;
  private fallbackUrl?: string;

  constructor(universalLink: string, fallbackUrl?: string) {
    this.universalLink = universalLink;
    this.fallbackUrl = fallbackUrl;
  }

  execute(): void {
    // 对于Universal Link，直接跳转即可
    const opened = window.open(this.universalLink, '_self');

    // 如果弹出窗口被阻止或者无法打开，则在当前窗口打开
    if (!opened && this.fallbackUrl) {
      window.location.href = this.fallbackUrl;
    }
  }
}

/**
 * 下载页面策略
 */
export class DownloadStrategy implements OpenAppStrategy {
  private downloadUrl: string;

  constructor(downloadUrl: string) {
    this.downloadUrl = downloadUrl;
  }

  execute(): void {
    window.location.href = this.downloadUrl;
  }
}

/**
 * XInstall策略
 */
export class XInstallStrategy implements OpenAppStrategy {
  private appKey: string;
  private scene: string;
  private businessData?: Record<string, any>;

  constructor(
    appKey: string,
    scene: string,
    businessData?: Record<string, any>
  ) {
    this.appKey = appKey;
    this.scene = scene;
    this.businessData = businessData;
  }

  execute(): void {
    // 检查是否已加载XInstall SDK
    if ((window as any).xinstall) {
      // 使用XInstall进行拉起
      (window as any).xinstall.openApp(
        {
          appKey: this.appKey,
          scene: this.scene,
          businessData: this.businessData || {},
        },
        (result: any) => {
          console.log('XInstall openApp result:', result);
          // 如果拉起失败，可以考虑跳转到下载页面
          if (!result.isSchemeSuccess && result.downloadUrl) {
            window.location.href = result.downloadUrl;
          }
        }
      );
    } else {
      console.warn('XInstall SDK未加载，请先引入XInstall SDK');
      // 如果XInstall SDK未加载，可以尝试其他策略
    }
  }
}

/**
 * 组合策略 - 按顺序尝试多种策略
 */
export class CompositeStrategy implements OpenAppStrategy {
  private strategies: OpenAppStrategy[];

  constructor(strategies: OpenAppStrategy[]) {
    this.strategies = strategies;
  }

  execute(): void {
    // 依次执行策略，直到某个策略成功
    for (const strategy of this.strategies) {
      try {
        strategy.execute();
      } catch (error) {
        console.error('策略执行失败:', error);
        // 继续执行下一个策略
        continue;
      }
    }
  }
}

export default {
  WxOpenStrategy,
  SchemeStrategy,
  UniversalLinkStrategy,
  DownloadStrategy,
  XInstallStrategy,
  CompositeStrategy,
};
