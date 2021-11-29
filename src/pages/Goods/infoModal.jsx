import { Modal, Form, message, InputNumber } from 'antd';
import ProForm, { ProFormText, ProFormMoney, ProFormTextArea } from '@ant-design/pro-form';
import { useState, forwardRef, useImperativeHandle } from 'react';

export default forwardRef((props, ref) => {
  const [isInfoModal, setIsInfoModal] = useState(false);
  useImperativeHandle(ref, () => ({
    setIsInfoModal: () => setIsInfoModal(true),
  }));
  return (
    <Modal
      title="Basic Modal"
      visible={isInfoModal}
      footer={null}
      onCancel={() => setIsInfoModal(false)}
    >
      <ProForm
        onFinish={async (values) => {
          console.log(values);
          message.success('提交成功');
        }}
        initialValues={{
          name: '蚂蚁设计有限公司',
        }}
      >
        <ProFormText name="title" label="标题" />
        <ProFormMoney label="价格" name="price" min={0} />
        <ProFormMoney label="库存" name="stock" min={0} />
        <ProFormTextArea label="描述" name="description" />
        <ProFormTextArea label="详情" name="details" />
      </ProForm>
    </Modal>
  );
});
