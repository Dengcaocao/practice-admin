import { Modal, Form, message, Cascader, Button } from 'antd';
import { LoadingOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormMoney, ProFormTextArea } from '@ant-design/pro-form';
import { useState, forwardRef, useImperativeHandle } from 'react';
import Upload from '@/components/upload';
import { getCategory } from '@/services/goods';

export default forwardRef((props, ref) => {
  const { actionTable } = props;
  const [goodsForm] = Form.useForm();
  const [modalType, setModalType] = useState('');
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [uploadState, setUploadState] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [options, setOptions] = useState([]);

  const uploadButton = (
    <div>
      {uploadState ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  useImperativeHandle(ref, () => ({
    setIsInfoModal: (goodsId) => {
      handleCategory();
      setModalType(goodsId ? 'edit' : 'add');
      setIsInfoModal(true);
    },
  }));

  const onChange = (value) => {
    console.log(value);
  };

  /**
   * 获取商品分类
   */
  const handleCategory = async () => {
    const result = await getCategory();
    setOptions(result);
  };

  /**
   * 处理添加商品
   * @param {*} values
   */
  const handleAdd = async () => {
    console.log('添加商品');
  };

  /**
   * 获取商品详情
   */
  const handleDetail = async () => {
    // 获取表单字段
    console.log(goodsForm.getFieldsValue(true));
  };

  /**
   * 处理更新商品
   * @param {*} values
   */
  const handleUpdate = async () => {
    console.log('更新商品');
  };

  /**
   * 封面图处理
   * @param {*} values
   */
  function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };

  const handleChange = (info) => {
    if (info.file.status === 'uploading') {
      return setUploadState(true);
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, (imageUrl) => {
        setUploadState(false);
        setImageUrl(imageUrl);
      });
    }
    if (info.file.status === 'error') {
      setUploadState(false);
    }
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
        form={goodsForm}
        className="goods-form"
        preserve={false}
        onFinish={async (values) => {
          handleSubmit(values);
        }}
      >
        <ProForm.Item
          name="category"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'id' }}
            options={options}
            onChange={onChange}
            placeholder="Please select"
          />
        </ProForm.Item>
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
        <ProForm.Item
          name="cover"
          label="封面图"
          rules={[{ required: true, message: '请选择封面图' }]}
        >
          <Upload accept="image/*">
            <Button icon={<UploadOutlined />}>Click to Upload</Button>
          </Upload>
        </ProForm.Item>
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
