import { Modal, Form, message, Cascader, Button, Image } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ProForm, { ProFormText, ProFormMoney, ProFormTextArea } from '@ant-design/pro-form';
import { useState, forwardRef, useImperativeHandle } from 'react';
import Upload from '@/components/upload';
import Editor from '@/components/Editor';
import { getCategory, addGoods, goodsDetail } from '@/services/goods';

export default forwardRef((props, ref) => {
  const { actionTable } = props;
  const [goodsForm] = Form.useForm();
  const [modalType, setModalType] = useState('');
  const [isInfoModal, setIsInfoModal] = useState(false);
  const [options, setOptions] = useState([]);
  const [details, setDetails] = useState('');

  useImperativeHandle(ref, () => ({
    setIsInfoModal: (goodsId) => {
      handleCategory();
      setModalType(goodsId ? 'edit' : 'add');
      setIsInfoModal(true);
      handleDetail(goodsId);
    },
  }));

  /**
   * 获取商品分类
   */
  const handleCategory = async () => {
    const result = await getCategory();
    setOptions(result);
  };

  /**
   * 设置图片字段的值
   */
  const setFiledsValue = (fileKey) => goodsForm.setFieldsValue({ cover: fileKey });

  /**
   * 设置富文本的值
   */
  const setValueEditor = (content) => goodsForm.setFieldsValue({ details: content });

  /**
   * 处理添加商品
   * @param {*} values
   */
  const handleAdd = async (values) => {
    const result = await addGoods({ params: { ...values, category_id: values.category_id[1] } });
    if (!result) {
      setIsInfoModal(false);
      message.success('添加成功');
    }
  };

  /**
   * 获取商品详情
   */
  const handleDetail = async (goodsId) => {
    const result = await goodsDetail(goodsId);
    const { pid, id } = result.category;
    goodsForm.setFieldsValue({ ...result, category_id: [pid, id] });
    setDetails(goodsForm.getFieldValue('details'));
  };

  /**
   * 处理更新商品
   * @param {*} values
   */
  const handleUpdate = async () => {
    console.log('更新商品');
  };

  const handleSubmit = async (values) => {
    if (modalType === 'add') await handleAdd(values);
    if (modalType === 'edit') await handleUpdate();
    actionTable.current.reload();
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
          name="category_id"
          label="分类"
          rules={[{ required: true, message: '请选择分类' }]}
        >
          <Cascader
            fieldNames={{ label: 'name', value: 'id' }}
            options={options}
            placeholder="选择分类"
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
          <div>
            <Upload accept="image/*" showUploadList={true} setFiledsValue={setFiledsValue}>
              <Button icon={<UploadOutlined />}>Click to Upload</Button>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                <a
                  href={
                    'https://laravel-book-shop.oss-cn-beijing.aliyuncs.com/' +
                    goodsForm.getFieldValue('cover')
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Image
                    width={120}
                    src={
                      'https://laravel-book-shop.oss-cn-beijing.aliyuncs.com/' +
                      goodsForm.getFieldValue('cover')
                    }
                  />
                </a>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ant-upload-list-item-name"
                  title={goodsForm.getFieldValue('cover')}
                  href={
                    'https://laravel-book-shop.oss-cn-beijing.aliyuncs.com/' +
                    goodsForm.getFieldValue('cover')
                  }
                >
                  {goodsForm.getFieldValue('cover')}
                </a>
              </span>
            </Upload>
          </div>
        </ProForm.Item>
        <ProFormTextArea
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        />
        <ProForm.Item
          name="details"
          label="详情"
          rules={[{ required: true, message: '请输入详情' }]}
        >
          <Editor setValueEditor={setValueEditor} content={details} />
        </ProForm.Item>
      </ProForm>
    </Modal>
  );
});
