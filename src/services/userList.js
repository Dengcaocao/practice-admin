// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

/** 获取用户列表 GET /admin/users */

export async function userList(options) {
  return request('/admin/users', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取用户列表 GET /admin/users/{user}/lock */

export async function setUserStatus(uid) {
  return request(`/admin/users/${uid}/lock`, {
    method: 'PATCH'
  })
}
