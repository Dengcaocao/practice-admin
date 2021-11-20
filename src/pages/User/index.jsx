import{ PageContainer } from '@ant-design/pro-layout'
import ProTable from '@ant-design/pro-table'
import { Button, Tag, Space, Menu, Dropdown } from 'antd'
import { PlusOutlined, EllipsisOutlined } from '@ant-design/icons'
import request from 'umi-request'

export default () => {
  const columns = [
    {
      title: '头像',
      dataIndex: 'avatar',
      copyable: true,
      ellipsis: true,
      search: false
    },
    {
      title: '姓名',
      dataIndex: 'name',
      copyable: true,
      ellipsis: true
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      copyable: true,
      ellipsis: true
    },
    {
      title: '是否禁用',
      dataIndex: 'isOpen',
      copyable: true,
      ellipsis: true,
      search: false
    },
    {
      title: '创建时间',
      dataIndex: 'date',
      copyable: true,
      ellipsis: true
    },
    {
      title: '操作',
      dataIndex: 'action',
      copyable: true,
      ellipsis: true,
      search: false
    }
  ]

  return (
    <PageContainer>
      <ProTable
        columns={columns}
      // actionRef={actionRef}
        request={async (params = {}, sort, filter) => {
          return request('url', {
            params,
          })
        }}
        onSubmit={(params) => console.log(params)}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        headerTitle="用户列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>
        ]}
      />
    </PageContainer>
  )
}