import { AppBaseConfig, OpenType } from '@/services/config';
import { SdkInitOptions } from '@/types';

class Context {
  private static instance: Context;
  private appBaseConfig: AppBaseConfig | null = null;
  private initData: SdkInitOptions | undefined = undefined;

  public setInitData(initData: SdkInitOptions): void {
    this.initData = initData;
  }

  public getInitData(): SdkInitOptions | undefined {
    return this.initData;
  }

  private constructor() {}

  public static getInstance(): Context {
    if (!Context.instance) {
      Context.instance = new Context();
    }
    return Context.instance;
  }

  // 支持微信开放标签
  public isSupportOpenTag(): boolean {
    if (!this.appBaseConfig) {
      return false;
    }
    return this.appBaseConfig.types.includes(OpenType.OpenTag);
  }

  public set(appBaseConfig: AppBaseConfig): void {
    this.appBaseConfig = appBaseConfig;
  }

  public get(key?: keyof AppBaseConfig): AppBaseConfig | any {
    if (!this.appBaseConfig) {
      return null;
    }
    if (!key) {
      return this.appBaseConfig;
    }
    return this.appBaseConfig[key];
  }
}

const context = Context.getInstance();
export default context;
