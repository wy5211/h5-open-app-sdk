import { OpenAppStrategy, RenderWxOpenAppOptions } from '../types';
/**
 * 通用策略
 */
declare class CommonStrategy implements OpenAppStrategy {
    private static instance;
    private constructor();
    static getInstance(): CommonStrategy;
    private getIntranetIp;
    private getExtranetIp;
    private getBrandName;
    private getMobileModel;
    private getWebGLInfo;
    private getDownloadExtraInfo;
    execute(): Promise<void>;
    renderOpenAppDom(container: HTMLElement, options: RenderWxOpenAppOptions): Promise<void>;
}
declare const instance: CommonStrategy;
export default instance;
//# sourceMappingURL=commonStrategy.d.ts.map