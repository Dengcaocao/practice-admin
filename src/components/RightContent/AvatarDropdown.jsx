import React, { useCallback } from 'react';
import { LogoutOutlined, SettingOutlined, UserOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin } from 'antd';
import { history, useModel } from 'umi';
import { stringify } from 'querystring';
import HeaderDropdown from '../HeaderDropdown';
import { message } from 'antd'
import styles from './index.less';
import { logout } from '@/services/user';

/**
 * 退出登录，并且将当前的 url 保存
 */
const handleLogout = async () => {
  await logout()
  console.log('退出登录')
  const { query = {}, pathname } = history.location
  const { redirect } = query // Note: There may be security issues, please note

  if (window.location.pathname !== '/login' && !redirect) {
    history.replace({
      pathname: '/login',
      search: stringify({
        redirect: pathname
      })
    })
    message.success('退出成功！')
  }
}

const AvatarDropdown = ({ menu }) => {
  const { initialState, setInitialState } = useModel('@@initialState')
  const onMenuClick = useCallback(
    async (event) => {
      const { key } = event

      if (key === 'logout') {
        /**
         * 退出登录需要token验证，需在清理token之前调用
         */
        await handleLogout()
        setInitialState(s => {
          console.log('清理token')
          localStorage.removeItem('access_token')
          return { ...s, currentUser: undefined }
        })
        return
      }

      history.push(`/account/${key}`);
    },
    [setInitialState],
  );
  const loading = (
    <span className={`${styles.action} ${styles.account}`}>
      <Spin
        size="small"
        style={{
          marginLeft: 8,
          marginRight: 8,
        }}
      />
    </span>
  );

  if (!initialState) {
    return loading;
  }

  const { currentUser } = initialState;

  if (!currentUser || !currentUser.name) {
    return loading;
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
      {menu && (
        <Menu.Item key="center">
          <UserOutlined />
          个人中心
        </Menu.Item>
      )}
      {menu && (
        <Menu.Item key="settings">
          <SettingOutlined />
          个人设置
        </Menu.Item>
      )}
      {menu && <Menu.Divider />}

      <Menu.Item key="logout">
        <LogoutOutlined />
        退出登录
      </Menu.Item>
    </Menu>
  );
  return (
    <HeaderDropdown overlay={menuHeaderDropdown} placement="bottomRight" arrow>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar size="small" className={styles.avatar} src={currentUser.avatar_url} alt="avatar" />
        <span className={`${styles.name} anticon`}>{currentUser.name}</span>
      </span>
    </HeaderDropdown>
  );
};

export default AvatarDropdown;
