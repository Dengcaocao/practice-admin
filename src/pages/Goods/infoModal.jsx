import { Modal, Form, message, InputNumber } from 'antd';
import ProForm, { ProFormText, ProFormMoney, ProFormTextArea } from '@ant-design/pro-form';
import { useState, forwardRef, useImperativeHandle } from 'react';

export default forwardRef((props, ref) => {
  const { actionTable } = props;
  const [modalType, setModalType] = useState('');
  const [isInfoModal, setIsInfoModal] = useState(false);

  useImperativeHandle(ref, () => ({
    setIsInfoModal: (goodsId) => {
      setModalType(goodsId ? 'edit' : 'add');
      setIsInfoModal(true);
    },
  }));

  /**
   * 处理添加商品
   * @param {*} values
   */
  const handleAdd = async () => {
    console.log('添加商品');
  };

  /**
   * 处理更新商品
   * @param {*} values
   */
  const handleUpdate = async () => {
    console.log('更新商品');
  };

  const handleSubmit = async (values) => {
    if (modalType === 'add') await handleAdd();
    if (modalType === 'edit') await handleUpdate();
    actionTable.current.reload();
    console.log(values);
    message.success('提交成功');
  };

  return (
    <Modal
      title={modalType === 'add' ? '新增' : '修改'}
      visible={isInfoModal}
      destroyOnClose={true}
      footer={null}
      onCancel={() => setIsInfoModal(false)}
    >
      <ProForm
        className="goods-form"
        preserve={false}
        onFinish={async (values) => {
          handleSubmit(values);
        }}
        initialValues={{
          name: '蚂蚁设计有限公司',
        }}
      >
        <ProFormText
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        />
        <ProFormMoney
          label="价格"
          name="price"
          rules={[{ required: true, message: '请输入价格' }]}
          min={0}
        />
        <ProFormMoney
          label="库存"
          name="stock"
          customSymbol=" "
          rules={[{ required: true, message: '请输入库存' }]}
          min={0}
        />
        <ProFormTextArea
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        />
        <ProFormTextArea
          label="详情"
          name="details"
          rules={[{ required: true, message: '请输入详情' }]}
        />
      </ProForm>
    </Modal>
  );
});
