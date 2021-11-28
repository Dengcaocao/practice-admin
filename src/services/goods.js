/* eslint-disable */
import { request } from 'umi';
/** 获取商品列表 GET /admin/goods */

export async function goodsList(options) {
  return request('/admin/goods', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 商品上下架 GET /admin/goods */

export async function isOn(goodId) {
  return request(`/admin/goods/${goodId}/on`, {
    method: 'PATCH',
  });
}

/** 商品上下架 GET /admin/goods */

export async function isRecommend(goodId) {
  return request(`/admin/goods/${goodId}/recommend`, {
    method: 'PATCH',
  });
}
