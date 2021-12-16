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

/** 商品分类 GET /admin/category */

export async function getCategory(options) {
  return request('/admin/category', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取阿里云OSS Token，用于前端直传文件使用
 *  GET /auth/oss/token
 */

export async function getOSS(options) {
  return request('/auth/oss/token', {
    method: 'GET',
    ...(options || {}),
  });
}

/**
 * 添加商品
 */
export async function addGoods(options) {
  return request('/admin/goods', {
    method: 'POST',
    ...(options || {}),
  });
}
