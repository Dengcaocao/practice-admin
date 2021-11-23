import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Avatar, Switch, Space, Menu, Dropdown } from 'antd';
import { PlusOutlined, UserOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import request from 'umi-request';
import { userList } from '@/services/userList';

export default () => {
  const [dataList, setDataList] = useState([]);

  useEffect(() => {
    getUserList();
  }, []);

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
      search: false,
      render: (text, record) => [<a key="link">链路</a>, <a key="warn">报警</a>],
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
    </PageContainer>
  );
};
