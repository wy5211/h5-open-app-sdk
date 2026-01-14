import { request } from '../utils/request';

interface AppConfig {
  id: string;
  wechatAppId?: string; // 微信开放应用ID
  appStoreUrl?: string; // 应用宝下载链接
  schemeUrl?: string; // scheme url
}

/**
 * 获取应用配置信息
 * @param id 应用ID
 * @returns Promise<AppConfig> 应用配置信息，包含三种打开方式
 */
export async function getAppConfig(id: string): Promise<AppConfig> {
  try {
    const response = await request({
      url: `/api/app/config/${id}`,
      method: 'GET',
    });

    return response.data;
  } catch (error) {
    console.error('获取应用配置失败:', error);
    throw error;
  }
}
