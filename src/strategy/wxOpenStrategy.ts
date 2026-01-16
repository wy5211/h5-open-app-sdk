import { OpenTagConfig } from '@/services/config';
import { OpenAppStrategy, RenderWxOpenAppOptions } from '@/types';
import context from '@/utils/context';
import { loadJSSDK } from '@/utils/loadJs';

/**
 * 微信开放标签策略
 */
class WxOpenStrategy implements OpenAppStrategy {
  private static instance: WxOpenStrategy;

  private constructor() {}

  public static getInstance(): WxOpenStrategy {
    if (!WxOpenStrategy.instance) {
      WxOpenStrategy.instance = new WxOpenStrategy();
    }
    return WxOpenStrategy.instance;
  }

  async prepare() {
    // 重新从Context获取最新的配置，确保获取到远程配置后的数据
    const latestConfig = context.get('open_tag') as OpenTagConfig;
    if (!latestConfig) {
      console.warn('未找到微信开放标签配置');
      throw new Error('未找到微信开放标签配置');
    }

    const { js_sdk_url, js_sdk_config, ext_info } = latestConfig;

    if (!js_sdk_url || !js_sdk_config) {
      console.warn('缺少必要的微信JS-SDK配置信息', latestConfig);
      throw new Error('缺少必要的微信JS-SDK配置信息');
    }

    try {
      await loadJSSDK(js_sdk_url);
      // 返回一个 Promise，等待微信 SDK 配置结果
      return new Promise<void>((resolve, reject) => {
        if ((window as any).wx) {
          const { app_id, ...rest } = js_sdk_config;

          // 重新配置微信 SDK
          (window as any).wx.config({
            ...rest,
            appId: app_id,
            openTagList: ['wx-open-launch-app'],
            jsApiList: [],
          });

          // 设置配置成功的回调
          (window as any).wx.ready(() => {
            console.log('微信JS-SDK配置成功');
            resolve(); // 这才会真正解决execute方法返回的Promise
          });

          // 设置配置失败的回调
          (window as any).wx.error((error: any) => {
            console.error('微信JS-SDK配置失败:', error);
            reject(error); // 这才会拒绝execute方法返回的Promise
          });
        } else {
          reject(new Error('微信JS-SDK加载失败'));
        }
      });
    } catch (error) {
      console.error('微信JS-SDK加载失败:', error);
      throw error;
    }
  }

  async execute() {
    console.log(
      '微信开放标签策略，只需要通过 renderOpenTag 将微信开放标签成功渲染皆可'
    );
  }

  public renderOpenTag(
    container: HTMLElement,
    options: RenderWxOpenAppOptions
  ) {
    // 清空容器
    container.innerHTML = '';

    // 重新从Context获取最新的配置
    const latestConfig = context.get('open_tag') as OpenTagConfig;
    if (!latestConfig) {
      console.warn('未找到微信开放标签配置，无法渲染');
      return;
    }

    const { js_sdk_config, ext_info } = latestConfig;
    const { app_id } = js_sdk_config;

    // 创建微信开放标签元素
    const el = document.createElement('wx-open-launch-app');
    el.setAttribute('appid', app_id);
    el.setAttribute('extinfo', JSON.stringify(ext_info));

    // 设置模板内容
    el.innerHTML = `
          <script type="text/wxtag-template">
            ${options.template || '<div>打开 App</div>'}
          </script>
        `;

    // 添加到容器
    container.appendChild(el);
  }

  public canUse(): boolean {
    return (
      typeof (window as any).wx !== 'undefined' &&
      (window as any).wx.isReady !== false
    );
  }
}

const instance = WxOpenStrategy.getInstance();

export default instance;
