import { OpenAppStrategy, RenderWxOpenAppOptions } from '@/types';
/**
 * 微信开放标签策略
 */
declare class WxOpenStrategy implements OpenAppStrategy {
    private static instance;
    private constructor();
    static getInstance(): WxOpenStrategy;
    prepare(): Promise<void>;
    execute(): Promise<void>;
    renderOpenTag(container: HTMLElement, options: RenderWxOpenAppOptions): void;
    canUse(): boolean;
}
declare const instance: WxOpenStrategy;
export default instance;
//# sourceMappingURL=wxOpenStrategy.d.ts.map