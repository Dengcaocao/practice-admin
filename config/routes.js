export default [
  {
    path: '/login',
    name: 'login',
    component: './Login',
    layout: false,
    hideInMenu: true,
  },
  {
    path: '/',
    name: 'index',
    icon: 'PieChartOutlined',
    // component: '@/pages/Home'
    routes: [
      {
        path: '/',
        component: '@/pages/Home',
      },
      {
        path: 'userlist',
        component: '@/pages/User',
      },
      {
        path: 'goods',
        component: '@/pages/Goods',
      },
    ],
  },
  {
    path: '/userlist',
    name: 'userlist',
    icon: 'UserOutlined',
  },
  {
    path: '/goods',
    name: 'goods',
    icon: 'ShopOutlined',
  },
  {
    component: './404',
  },
];
