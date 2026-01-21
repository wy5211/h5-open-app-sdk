export declare enum OpenType {
    OpenTag = "openTag",
    Scheme = "scheme",
    Url = "url"
}
export interface OpenTagConfig {
    js_sdk_url: string;
    js_sdk_config: {
        app_id: string;
        timestamp: string;
        nonce_str: string;
        signature: string;
    };
    app_id: string;
}
export interface AppBaseConfig {
    types: OpenType[];
    app_version: string;
    open_tag?: OpenTagConfig;
    ext_info?: string;
}
/**
 * 获取应用配置信息
 * @param id 应用ID
 * @returns Promise<AppConfig> 应用配置信息，包含三种打开方式
 */
export declare function getAppBaseConfig(data: {
    app_id: string;
    url: string;
    ext_info?: string;
}): Promise<AppBaseConfig>;
export declare function getDownloadConfig(data: {
    app_id: string;
    ext_info?: string;
    [key: string]: any;
}): Promise<{
    scheme: string;
    url: string;
}>;
//# sourceMappingURL=config.d.ts.map