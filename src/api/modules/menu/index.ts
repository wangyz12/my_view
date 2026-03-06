// api/modules/menu.ts
import { get } from '../../index';

/**
 * 获取用户菜单列表（含路由信息）
 * @returns Promise<MenuItem[]>
 */
export const getMenuListApi = () => {
  // 替换为真实后台接口地址
  return get<any>('/menu/findMenu');
};