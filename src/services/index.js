// @ts-ignore

/* eslint-disable */
import { request } from 'umi'
/** 获取当前的用户 GET /api/currentUser */

export async function getStatistics(options) {
  return request('/admin/index', {
    method: 'GET',
    ...(options || {})
  })
}
