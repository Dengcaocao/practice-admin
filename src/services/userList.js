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

/** 获取用户列表 GET /admin/users/{user}/lock */

export async function setUserStatus(uid) {
  return request(`/admin/users/${uid}/lock`, {
    method: 'PATCH'
  })
}

/** 添加用户 */

export async function addUser(options) {
  return request('/admin/users', {
    method: 'post',
    ...(options || {})
  })
}

/** 用户详情 */

export async function userDetail(uid) {
  return request(`/admin/users/${uid}`, {
    method: 'get'
  })
}
