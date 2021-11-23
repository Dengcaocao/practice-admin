// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function userList(options) {
  return request('/admin/users', {
    method: 'GET',
    ...(options || {}),
  });
}
