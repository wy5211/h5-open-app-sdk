import { AppBaseConfig } from '@/services/config';
import { SdkInitOptions } from '@/types';
declare class Context {
    private static instance;
    private appBaseConfig;
    private initData;
    setInitData(initData: SdkInitOptions): void;
    getInitData(): SdkInitOptions | undefined;
    private constructor();
    static getInstance(): Context;
    isSupportOpenTag(): boolean;
    set(appBaseConfig: AppBaseConfig): void;
    get(key?: keyof AppBaseConfig): AppBaseConfig | any;
}
declare const context: Context;
export default context;
//# sourceMappingURL=context.d.ts.map