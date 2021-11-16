// @ts-ignore

/* eslint-disable */
import { request } from 'umi';
/** 获取当前的用户 GET /api/currentUser */

export async function currentUser(options) {
  return request('/admin/user', {
    method: 'GET',
    ...(options || {})
  })
}

/** 登录接口 POST /api/login/account */

export async function login(body, options) {
  return request('/auth/login', {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}