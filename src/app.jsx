import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrentUser } from './services/user';
import { message } from 'antd';
// import { BookOutlined, LinkOutlined } from '@ant-design/icons';
const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/login';
/** 获取用户信息比较慢的时候会展示一个 loading */

export const initialStateConfig = {
  loading: <PageLoading />,
};
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */

// 请求拦截
const requestInterceptors = (url, options) => {
  // 设置请求头
  const { headers } = options;
  const token = localStorage.getItem('access_token') || '';
  // tips headers中不能设置中文会报错，引起接口走不下去
  headers.Authorization = `Bearer ${token}`;
  return {
    url,
    options: { ...options },
  };
};

// 响应拦截
const responseInterceptors = async (res) => {
  // fetch请求必须通过以下方式获取服务器请求
  /**
   * try……catch解决返回为undefined或为空字符串引起的错误
   */
  try {
    const result = await res.clone().json()
  } catch (error) {
    
  }
  let errorText = '';
  // 登录相关错误
  if (res.status === 422) {
    for (let i in result.errors) {
      errorText += result.errors[i].toString();
    }
    throw new Error(errorText);
  }

  if (res.status === 401) throw new Error('账户或密码错误！');
  // if (res.status >= 400) throw new Error(result.message)
  return res;
};

export const request = {
  // 前缀
  prefix: '/api',
  errorHandler: (err) => {
    message.error(err.message);
  },
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors],
};

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const userInfo = await queryCurrentUser();
      return userInfo;
    } catch (error) {
      history.push(loginPath);
    }

    return undefined;
  }; // 如果是登录页面，不执行

  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: {},
  };

  // if (history.location.pathname !== loginPath) {
  //   const currentUser = await fetchUserInfo()
  //   return {
  //     fetchUserInfo,
  //     currentUser,
  //     settings: {}
  //   }
  // }

  // return {
  //   fetchUserInfo,
  //   settings: {}
  // };
} // ProLayout 支持的api https://procomponents.ant.design/components/layout

export const layout = ({ initialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.name,
    },
    footerRender: () => <Footer />,
    onPageChange: () => {
      const { location } = history; // 如果没有登录，重定向到 login

      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }

      if (initialState?.currentUser && location.pathname === loginPath) {
        history.replace('/');
      }
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
