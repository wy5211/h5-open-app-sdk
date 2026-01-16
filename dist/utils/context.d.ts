import { AppBaseConfig } from '@/services/config';
declare class Context {
    private static instance;
    private appBaseConfig;
    private appId;
    setAppId(appId: string): void;
    getAppId(): string | null;
    private constructor();
    static getInstance(): Context;
    isSupportOpenTag(): boolean;
    set(appBaseConfig: AppBaseConfig): void;
    get(key: keyof AppBaseConfig): any;
}
declare const context: Context;
export default context;
//# sourceMappingURL=context.d.ts.map