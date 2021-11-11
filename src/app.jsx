import { PageLoading } from '@ant-design/pro-layout';
import { history, Link } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';
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
  console.log(url, options, '运行时配置 请求拦截器')
  // 设置请求头
  const { headers } = options
  const token = 'lonin set'
  // tips headers中不能设置中文会报错，引起接口走不下去
  headers.Authorization = `Bearer ${token}`
  // // 设置代理前缀/api
  // const newUrl = `/api${url}`;
  // const obj: any = options;
  // const { params } = obj;
  // // 分页字段修改
  // if (params && params.current) {
  //   params.pageNo = params.current;
  //   delete params.current;
  // }
  return {
    url,
    options: {...options}
  }
}

// 响应拦截
const responseInterceptors = async res => {
  // fetch请求必须通过以下方式获取服务器请求
  const result = await res.clone().json()
  console.log(res, 'response')
  let errorText = ''
  if (res.status === 422) {
    console.log(result)
    for (let i in result.errors) {
      errorText += result.errors[i].toString()
    }
  }
  throw new Error(errorText)
  
  // console.log(res);

  // const { code, result, success } = res;
  // // 如果是分页的 字段调整为records
  // if (
  //   code === 0 &&
  //   Object.prototype.toString.call(result) === '[object Object]' &&
  //   result.records
  // ) {
  //   result.data = result.records;
  //   delete result.records;
  // }
  // return { ...result, code, success };
  return response
}

 export const request = {
  errorHandler: err => {
    message.error(err.message)
  },
  requestInterceptors: [requestInterceptors],
  responseInterceptors: [responseInterceptors]
}

export async function getInitialState() {
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      return msg.data
    } catch (error) {
      history.push(loginPath)
    }

    return undefined
  }; // 如果是登录页面，不执行

  if (history.location.pathname !== loginPath) {
    const currentUser = await fetchUserInfo();
    return {
      fetchUserInfo,
      currentUser,
      settings: {},
    };
  }

  return {
    fetchUserInfo,
    settings: {},
  };
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
    },
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    ...initialState?.settings,
  };
};
