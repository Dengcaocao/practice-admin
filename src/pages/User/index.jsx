import { useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Avatar, Switch, message, Modal, Skeleton, Form } from 'antd';
import './index.less'
import request from 'umi-request';
import { userList, setUserStatus, addUser, userDetail } from '@/services/userList';
import { PlusOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';

export default () => {

  const [userForm] = Form.useForm()

  const [isModalVisible, setModalVisible] = useState(false)
  const [initialValues, setInitialValues] = useState(null)

  const getUserList = () => {
    userList().then((res) => {
      console.log(res);
      // setDataList(res.data)
      return {
        data: res.data,
        success: true,
        total: res.meta.pagination.total,
      };
    });
  };

  // 添加用户
  const handleAddUser = async (values) => {
    try {
      const result = await addUser({data: values})
      if (result !== undefined) {
        setModalVisible(false)
        message.success('添加成功')
      }
    } catch (error) {
      
    }
  }

  // 用户详情
  const getUserDetail = async (uid) => {
    setModalVisible(true)
    const { name, email} =  await userDetail(uid)
    setInitialValues({
      name,
      email
    })
  }

  // 重置表单
  const handleReset = () => {
    userForm.setFields([
      {name: 'name', value: ''},
      {name: 'email', value: ''}
    ])
    // userForm.resetFields()
  }

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
      render: (text, record) => [<a key="link" onClick={() => getUserDetail(record.id)}>编辑</a>]
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        // dataSource={dataList}
        // actionRef={actionRef}
        request={async (params = {}) => userList()}
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
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
      <Modal title="新增" destroyOnClose={true} visible={isModalVisible} onCancel={ () => setModalVisible(false) } footer={null}>
        {
          !initialValues ?
          <div>
            <Skeleton loading={true} active title={{width: '10%'}} paragraph={{rows: 0}}></Skeleton>
            <Skeleton.Input className="skeleton-input" active size="default" />
            <Skeleton loading={true} active title={{width: '10%'}} paragraph={{rows: 0}}></Skeleton>
            <Skeleton.Input className="skeleton-input" active size="default" />
          </div> : 
          <ProForm
            form={userForm}
            preserve={false}
            onFinish={ values => { handleAddUser(values) }}
            onReset={handleReset}
            initialValues={initialValues}
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
        }
      </Modal>
    </PageContainer>
  );
};
