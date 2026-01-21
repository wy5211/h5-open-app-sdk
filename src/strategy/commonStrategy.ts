import { isAndroid, isIOS } from '@/environment';
import { OpenAppStrategy } from '../types';
import { getDownloadConfig } from '@/services/config';
import context from '@/utils/context';

/**
 * 延迟执行函数
 * @param fn - 要执行的函数
 * @param delay - 延迟时间(毫秒)
 */
function delayExecute(fn: () => void, delay: number = 500): void {
  setTimeout(fn, delay);
}

/**
 * 通用策略
 */
class CommonStrategy implements OpenAppStrategy {
  private static instance: CommonStrategy;

  private constructor() {}

  public static getInstance(): CommonStrategy {
    if (!CommonStrategy.instance) {
      CommonStrategy.instance = new CommonStrategy();
    }
    return CommonStrategy.instance;
  }

  private async getIntranetIp(): Promise<string> {
    return new Promise((resolve) => {
      try {
        const pc = new RTCPeerConnection({
          iceServers: [],
        });
        pc.onicecandidate = function (ice) {
          if (!ice || !ice.candidate || !ice.candidate.candidate) {
            return;
          }
          const parts = ice.candidate.candidate.split(' ');
          resolve(parts[4]);
        };
        pc.createDataChannel('');
        pc.createOffer()
          .then((offer) => {
            return pc.setLocalDescription(offer);
          })
          .catch((err) => {
            console.error(err);
            resolve('127.0.0.1');
          });
      } catch (e) {
        console.error('获取内网IP失败', e);
        resolve('127.0.0.1');
      }
    });
  }

  private async getExtranetIp(defaultIp: string): Promise<string> {
    try {
      const response = await fetch('https://2025.ip138.com/');
      const html = await response.text();
      const regex = /target="_blank">([\d\.]+)<\/a>/;
      const match = html.match(regex);
      return match ? match[1] : defaultIp;
    } catch (error) {
      console.error('获取外网IP失败:', error);
      return defaultIp;
    }
  }

  private getBrandName(): string {
    const userAgent = navigator.userAgent;

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
      return 'Apple';
    }

    const androidBrands = [
      { pattern: /SM-[A-Z0-9]+/i, brand: 'Samsung' },
      { pattern: /Pixel/i, brand: 'Google' },
      { pattern: /MI [0-9]+/i, brand: 'Xiaomi' },
      { pattern: /Redmi/i, brand: 'Redmi' },
      { pattern: /OPPO/i, brand: 'OPPO' },
      { pattern: /VIVO/i, brand: 'Vivo' },
      { pattern: /HUAWEI/i, brand: 'Huawei' },
      { pattern: /Honor/i, brand: 'Honor' },
      { pattern: /ONEPLUS/i, brand: 'OnePlus' },
    ];

    for (const { pattern, brand } of androidBrands) {
      if (pattern.test(userAgent)) {
        return brand;
      }
    }

    return 'Unknown';
  }

  private getMobileModel(): string {
    const userAgent = navigator.userAgent;

    if (/iPhone/i.test(userAgent)) {
      const iPhoneModels = [
        { pattern: /iPhone OS 17/, model: 'iPhone 15 series' },
        { pattern: /iPhone OS 16/, model: 'iPhone 14 series' },
        { pattern: /iPhone OS 15/, model: 'iPhone 13 series' },
        { pattern: /iPhone OS 14/, model: 'iPhone 12 series' },
        { pattern: /iPhone OS 13/, model: 'iPhone 11 series' },
      ];

      for (const { pattern, model } of iPhoneModels) {
        if (pattern.test(userAgent)) {
          return model;
        }
      }
      return 'iPhone';
    }

    const androidModelMatch = userAgent.match(/Android.*?; ([^;]+) Build/);
    if (androidModelMatch) {
      return androidModelMatch[1].trim();
    }

    return 'Unknown';
  }

  private getWebGLInfo(): { version: string; gpu: string } {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      if (!gl || !(gl instanceof WebGLRenderingContext)) {
        return { version: 'WebGL not supported', gpu: 'Unknown' };
      }

      const version = gl.getParameter(gl.VERSION);
      let gpu = 'Unknown';

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'Unknown';
      }

      return { version, gpu };
    } catch (error) {
      console.warn('获取WebGL信息失败:', error);
      return { version: 'WebGL error', gpu: 'Unknown' };
    }
  }

  private async getDownloadExtraInfo() {
    const webGLInfo = this.getWebGLInfo();

    const intranetIp = await this.getIntranetIp();

    return {
      download_type: isIOS() ? 'ios' : isAndroid() ? 'android' : 'pc',
      link_param: window.location.search.split('?')?.[1] || '',
      screen_width: window.innerWidth,
      screen_height: window.innerHeight,
      device_pixel_ration: window.devicePixelRatio,
      web_gl_version: webGLInfo.version,
      gpu_type: webGLInfo.gpu,
      intranet_ip: intranetIp,
      extranet_ip: await this.getExtranetIp(intranetIp),
      brand_name: this.getBrandName(),
      mobile_model: this.getMobileModel(),
      app_version: context.get('app_version'),
    };
  }

  async execute() {
    const appId = context.getInitData()?.id;
    if (!appId) {
      throw new Error('App ID is not set');
    }

    const extraInfo = await this.getDownloadExtraInfo();

    const downloadConfig = await getDownloadConfig({
      app_id: appId,
      ext_info: {
        project_unique_id: appId,
        ...extraInfo,
      },
    });

    const { scheme, url } = downloadConfig;

    // 检测是否为微信环境
    const isWeChatEnvironment = /MicroMessenger/i.test(navigator.userAgent);

    // 微信环境不支持 scheme 跳转
    if (isWeChatEnvironment && url) {
      window.location.href = url!;
      return;
    }

    if (scheme) {
      // 非微信环境使用 iframe 方式
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = scheme;
      document.body.appendChild(iframe);

      // 设置超时，如果app没有打开则跳转到fallback url
      if (url) {
        delayExecute(() => {
          document.body.removeChild(iframe);
          window.location.href = url!;
        }, 2000);
      } else {
        delayExecute(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 2000);
      }
      return;
    }
    if (url) {
      window.location.href = url;
    }
  }
}

const instance = CommonStrategy.getInstance();

export default instance;
