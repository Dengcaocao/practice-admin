import { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import ProForm, { ProFormText } from '@ant-design/pro-form';
import { Button, Avatar, Switch, message, Modal, Skeleton, Form } from 'antd';
import { userList, setUserStatus, addUser, userDetail, updateUser } from '@/services/userList';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import './index.less';

export default () => {
  const actionTable = useRef();
  const [userForm] = Form.useForm();

  const [isModalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState('');
  const [uid, setUid] = useState(null);
  const [skeletonState, setSkeletonState] = useState(false);

  const getUserList = async (params) => {
    const result = await userList({ params });
    const {
      data,
      meta: {
        pagination: { total },
      },
    } = result;
    return {
      data,
      total,
      success: true,
    };
  };

  /**
   * 处理用户状态
   * @param {uid}
   */
  const handleUserStatus = async (uid) => {
    const result = await setUserStatus(uid);
    if (!result) message.success('设置成功');
  };

  /**
   * 处理用户信息
   * @param {uid}
   */
  const handleAction = (uid) => {
    setModalVisible(true);
    if (!uid) return setModalType('add');
    setSkeletonState(true);
    setModalType('edit');
    setUid(uid);
    getUserDetail(uid);
  };

  // 添加用户
  const handleAddUser = async (values) => {
    try {
      const result = await addUser({ data: values });
      if (result !== undefined) {
        setModalVisible(false);
        message.success('添加成功');
      }
    } catch (error) {}
  };

  // 用户详情
  const getUserDetail = async (uid) => {
    const { name, email } = await userDetail(uid);
    userForm.setFieldsValue({ name, email });
    setSkeletonState(false);
  };

  /**
   * 更新用户
   */
  const handleUpdateUser = async (uid, options) => {
    const result = await updateUser(uid, options);
    if (!result) {
      setModalVisible(false);
      message.success('更新成功');
    }
  };

  const handleSubmit = async (values) => {
    if (modalType === 'add') {
      await handleAddUser(values);
    } else {
      await handleUpdateUser(uid, { params: values });
    }
    actionTable.current.reload();
  };

  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      copyable: true,
      ellipsis: true,
      search: false,
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
      copyable: true,
      ellipsis: true,
      search: false,
      render: (text, record) => (
        <Switch
          checkedChildren="开启"
          unCheckedChildren="关闭"
          defaultChecked={record.is_locked ? true : false}
          onChange={() => handleUserStatus(record.id)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      copyable: true,
      ellipsis: true,
      search: false,
    },
    {
      title: '操作',
      dataIndex: 'action',
      ellipsis: true,
      hideInSearch: true,
      render: (text, record) => [
        <a key="link" onClick={() => handleAction(record.id)}>
          编辑
        </a>,
      ],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        actionRef={actionTable}
        columns={columns}
        request={async (params = {}) => getUserList(params)}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => handleAction()}
          >
            新建
          </Button>,
        ]}
      />
      <Modal
        title={modalType === 'add' ? '新增' : '修改'}
        destroyOnClose={true}
        visible={isModalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {skeletonState ? (
          <div>
            <Skeleton
              loading={true}
              active
              title={{ width: '10%' }}
              paragraph={{ rows: 0 }}
            ></Skeleton>
            <Skeleton.Input className="skeleton-input" active size="default" />
            <Skeleton
              loading={true}
              active
              title={{ width: '10%' }}
              paragraph={{ rows: 0 }}
            ></Skeleton>
            <Skeleton.Input className="skeleton-input" active size="default" />
          </div>
        ) : (
          <ProForm
            form={userForm}
            preserve={false}
            onFinish={(values) => {
              handleSubmit(values);
            }}
            onReset={() => userForm.resetFields()}
            initialValues={{}}
          >
            <ProFormText
              name="name"
              label="昵称"
              rules={[{ required: true, message: '昵称为必填' }]}
            />
            <ProFormText
              name="email"
              label="邮箱"
              rules={[
                { required: true, message: '邮箱为必填' },
                { required: true, type: 'email', message: '邮箱格式错误' },
              ]}
            />
            {modalType !== 'edit' ? (
              <ProFormText.Password
                name="password"
                label="密码"
                rules={[{ required: true, message: '密码为必填' }]}
              />
            ) : null}
          </ProForm>
        )}
      </Modal>
    </PageContainer>
  );
};
