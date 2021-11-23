import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import ProTable from '@ant-design/pro-table';
import { Button, Avatar, Switch, message, Modal, Dropdown } from 'antd';
import { PlusOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import request from 'umi-request';
import { userList, setUserStatus } from '@/services/userList';

export default () => {

  const [isModalVisible, setModalVisible] = useState(false)

  const getUserList = async (params) => {
    try {
      const { data, meta:{ pagination: { total }}} = await userList({params})
      return {
        data,
        success: true,
        total
      }
    } catch (err) {
      message.error(err.message)
    }
  }

  // 设置用户状态
  const handleUserStatus = async (uid) => {
    try {
      const res = await setUserStatus(uid)
      if (!res) message.success('操作成功')
    } catch (err) {
      message.error(err.message)
    }
  }

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => <Avatar src={record.avatar_url} icon={<UserOutlined />} />,
    },
    {
      title: '姓名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true,
    },
    {
      title: '是否禁用',
      dataIndex: 'is_locked',
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          defaultChecked={record.is_locked ? true : false}
          onChange={ () => handleUserStatus(record.id) }
        />
      )
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      ellipsis: true,
      hideInSearch: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => [<a key="link">编辑</a>],
    },
  ]

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        // dataSource={dataList}
        // actionRef={actionRef}
        request={async (params = {}) => getUserList(params)}
        onSubmit={(params) => console.log(params)}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary" onClick={() => setModalVisible(true)}>
            新建
          </Button>,
        ]}
      />
      <Modal title="新增" visible={isModalVisible} onCancel={() => setModalVisible(false)} footer={null}>
        <ProForm
          onFinish={async (values) => {
            console.log(values);
            message.success('提交成功');
          }}
          initialValues={{
            name: '蚂蚁设计有限公司',
            email: 'chapter',
          }}
        >
          <ProFormText
            name="name"
            label="昵称"
            rules={[
              { required: true, message: '昵称为必填'}
            ]} />
          <ProFormText
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '邮箱为必填'},
              { required: true, type: 'email', message: '邮箱格式错误'}
            ]} />
          <ProFormText.Password
            name="password"
            label="密码"
            rules={[
              { required: true, message: '密码为必填'}
            ]} />
        </ProForm>
      </Modal>
    </PageContainer>
  );
};
