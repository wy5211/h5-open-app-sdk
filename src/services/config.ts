import { post } from '../utils/request';

export enum OpenType {
  OpenTag = 'openTag',
  Scheme = 'scheme',
  Url = 'url',
}

export interface OpenTagConfig {
  js_sdk_url: string;
  js_sdk_config: {
    app_id: string; // 必填，服务号的唯一标识
    timestamp: string; // 必填，生成签名的时间戳
    nonce_str: string; // 必填，生成签名的随机串
    signature: string; // 必填，签名
  };
  app_id: string;
}

export interface AppBaseConfig {
  types: OpenType[]; // 支持打开方式类型  [ 'openTag','scheme','url' ]
  app_version: string;
  open_tag?: OpenTagConfig;
  ext_info?: string; // 第三方额外的附加参数 stirng
}

const basePath = '/api/sdk/v1';

/**
 * 获取应用配置信息
 * @param id 应用ID
 * @returns Promise<AppConfig> 应用配置信息，包含三种打开方式
 */
export async function getAppBaseConfig(data: {
  app_id: string;
  url: string;
  ext_info?: string;
}): Promise<AppBaseConfig> {
  try {
    const response = await post<AppBaseConfig>(`${basePath}/baseConfig`, data);
    return response.data;
  } catch (error) {
    console.error('获取应用配置失败:', error);
    throw error;
  }
}

export async function getDownloadConfig(data: {
  app_id: string;
  ext_info: Record<string, any>;
}): Promise<{
  scheme: string;
  url: string;
}> {
  try {
    const response = await post(`${basePath}/download`, data);
    return response.data;
  } catch (error) {
    console.error('下载应用失败:', error);
    throw error;
  }
}
