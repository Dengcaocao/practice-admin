import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { ProFormText, LoginForm } from '@ant-design/pro-form';
import { useIntl, history, useModel } from 'umi';
import Footer from '@/components/Footer';
import { login } from '@/services/user'
import styles from './index.less';

const Login = () => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const intl = useIntl()

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values) => {
    try {
      // 登录
      const msg = await login(values)
      if (msg) {
        const defaultLoginSuccessMessage = '登录成功！'
        message.success(defaultLoginSuccessMessage)
        // 保存用户token
        localStorage.setItem('access_token', msg.access_token)
        // 获取用户信息
        await fetchUserInfo()
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return
        const { query } = history.location
        const { redirect } = query
        history.push(redirect || '/')
        return
      }
      // setUserLoginState(msg)
    } catch (error) {
      // message.error(error.message)
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.png" />}
          title="小草后台"
          subTitle="电商练习后台-react-antdPro"
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          <Tabs activeKey="account">
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '账户密码登录',
              })}
            />
          </Tabs>
          {(
            <>
              <ProFormText
                name="email"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder="邮箱: super@a.com"
                rules={[
                  {
                    required: true,
                    message: '请输入邮箱!',
                  },
                  {
                    type: 'email',
                    message: '邮箱格式不正确!',
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder="密码: 123123"
                rules={[
                  {
                    required: true,
                    message: '请输入密码！',
                  },
                ]}
              />
            </>
          )}
          <div style={{ marginBottom: 24 }}></div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
