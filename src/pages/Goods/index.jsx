import { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import { Button, Image, Switch, message } from 'antd';
import { PlusOutlined, UserOutlined } from '@ant-design/icons';
import { goodsList, isOn, isRecommend } from '@/services/goods';

export default () => {
  const getList = async (params) => {
    params.is_on && (params.is_on = parseInt(params.is_on));
    params.is_recommend && (params.is_recommend = parseInt(params.is_recommend));
    const result = await goodsList({ params });
    const {
      data,
      meta: {
        pagination: { total },
      },
    } = result;
    return {
      data,
      success: true,
      total,
    };
  };

  const handleIsOn = async (goodId) => {
    const result = await isOn(goodId);
    if (!result) message.success('切换成功');
  };

  const handleIsRecommend = async (goodId) => {
    const result = await isRecommend(goodId);
    if (!result) message.success('切换成功');
  };

  const columns = [
    {
      title: '商品图',
      dataIndex: 'cover_url',
      hideInSearch: true,
      render: (text, record) => <Image width={64} src={record.cover_url} />,
    },
    {
      title: '标题',
      dataIndex: 'title',
      copyable: true,
    },
    {
      title: '价格',
      dataIndex: 'price',
      hideInSearch: true,
    },
    {
      title: '库存',
      dataIndex: 'stock',
      hideInSearch: true,
    },
    {
      title: '销量',
      dataIndex: 'sales',
      hideInSearch: true,
    },
    {
      title: '是否上架',
      dataIndex: 'is_on',
      valueType: 'radioButton',
      valueEnum: {
        0: { text: '未上架' },
        1: { text: '已上架' },
      },
      render: (text, record) => (
        <Switch
          checkedChildren="已上架"
          unCheckedChildren="未上架"
          defaultChecked={record.is_on ? true : false}
          onChange={() => handleIsOn(record.id)}
        />
      ),
    },
    {
      title: '是否推荐',
      dataIndex: 'is_recommend',
      valueType: 'radioButton',
      valueEnum: {
        0: { text: '未推荐' },
        1: { text: '已推荐' },
      },
      render: (text, record) => (
        <Switch
          checkedChildren="已推荐"
          unCheckedChildren="未推荐"
          defaultChecked={record.is_recommend ? true : false}
          onChange={() => handleIsRecommend(record.id)}
        />
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'action',
      hideInSearch: true,
      render: (text, record) => [<a key="link">编辑</a>],
    },
  ];

  return (
    <PageContainer>
      <ProTable
        columns={columns}
        request={async (params = {}) => getList(params)}
        onSubmit={(params) => console.log(params)}
        search={{
          labelWidth: 'auto',
        }}
        pagination={{
          pageSize: 10,
        }}
        rowKey="id"
        headerTitle="商品列表"
        toolBarRender={() => [
          <Button key="button" icon={<PlusOutlined />} type="primary">
            新建
          </Button>,
        ]}
      />
    </PageContainer>
  );
};
