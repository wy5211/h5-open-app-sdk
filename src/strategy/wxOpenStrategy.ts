import { AppBaseConfig, OpenTagConfig } from '@/services/config';
import { OpenAppStrategy, RenderWxOpenAppOptions } from '@/types';
import context from '@/utils/context';
import { loadJSSDK } from '@/utils/loadJs';
import commonStrategy from './commonStrategy';

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

    const { js_sdk_url, js_sdk_config } = latestConfig;

    if (!js_sdk_url || !js_sdk_config) {
      console.warn('缺少必要的微信JS-SDK配置信息', latestConfig);
      throw new Error('缺少必要的微信JS-SDK配置信息');
    }

    try {
      await loadJSSDK(js_sdk_url);

      // 返回一个 Promise，等待微信 SDK 配置结果
      return new Promise<void>((resolve, reject) => {
        if ((window as any).wx) {
          const { app_id, nonce_str, ...rest } = js_sdk_config;

          const wxConfig = {
            ...rest,
            nonceStr: nonce_str,
            debug: context.getInitData()?.isDebug || false,
            appId: app_id,
            openTagList: ['wx-open-launch-app'],
            jsApiList: [], // 必填，随意填一个
          };

          // 重新配置微信 SDK
          (window as any).wx.config(wxConfig);

          // 使用标志位避免竞态条件
          let isResolved = false;
          let isRejected = false;

          // 设置配置成功的回调
          (window as any).wx.ready(() => {
            if (!isRejected && !isResolved) {
              isResolved = true;
              console.log('微信JS-SDK配置成功');
              resolve();
            }
          });

          // 设置配置失败的回调
          (window as any).wx.error((error: any) => {
            if (!isResolved && !isRejected) {
              isRejected = true;
              console.error('微信JS-SDK配置失败:', error, wxConfig);
              reject(error);
            }
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
    const latestConfig = context.get() as AppBaseConfig;
    const { open_tag } = latestConfig;
    if (!latestConfig) {
      throw new Error('未找到微信开放标签配置，无法渲染');
    }

    const { app_id } = open_tag as OpenTagConfig;

    // 创建微信开放标签元素
    const el = document.createElement('wx-open-launch-app');
    el.setAttribute('appid', app_id);
    el.setAttribute(
      'style',
      'width: 100%; height: 100%;position: absolute; left: 0; top: 0'
    );
    if (context.getInitData()?.ext_info) {
      el.setAttribute('extinfo', context.getInitData()?.ext_info || '');
    }

    // 处理模板，支持字符串和DOM元素
    let templateString = '<div>打开APP</div>';
    if (options.template) {
      if (typeof options.template === 'string') {
        templateString = options.template;
      } else if (options.template instanceof HTMLElement) {
        // 将DOM元素转换为字符串
        templateString = options.template.outerHTML;
      }
    }

    // 设置模板内容
    el.innerHTML = `
          <script type="text/wxtag-template">
            ${templateString}
          </script>
        `;

    el.addEventListener('launch', function (e) {
      console.log('success', e);
    });
    el.addEventListener('error', function (e) {
      console.log('fail', e);
      // 走 download 逻辑
      commonStrategy.execute();
    });

    // 添加到容器
    container.appendChild(el);
  }

  public canUse(): boolean {
    if (!(window as any)?.wx) return false;
    return (
      typeof (window as any).wx !== 'undefined' &&
      (window as any).wx.isReady !== false
    );
  }
}

const instance = WxOpenStrategy.getInstance();

export default instance;
