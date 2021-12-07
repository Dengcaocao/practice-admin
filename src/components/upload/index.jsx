import React from 'react';
import { Upload, message } from 'antd';
import { getOSS } from '@/services/goods';

export default class AliyunOSSUpload extends React.Component {
  state = {
    OSSData: {},
  };

  async componentDidMount() {
    await this.init();
  }

  /**
   * 初始化oss token
   */
  init = async () => {
    try {
      const OSSData = await getOSS();
      this.setState({
        OSSData,
      });
    } catch (error) {
      message.error(error);
    }
  };

  onChange = ({ file }) => {
    if (file.status === 'done') {
      this.props.setFiledsValue(file.key);
      message.success('上传成功');
    }
  };

  /**
   * 图片上传参数
   * @param {*} file
   * @returns
   */
  getExtraData = (file) => {
    const { OSSData } = this.state;

    return {
      key: file.key,
      OSSAccessKeyId: OSSData.accessid,
      policy: OSSData.policy,
      Signature: OSSData.signature,
    };
  };

  /**
   * 上传之前处理
   * @param {*} file
   * @returns
   */
  beforeUpload = async (file) => {
    const { OSSData } = this.state;
    const expire = OSSData.expire * 1000;

    if (expire < Date.now()) {
      await this.init();
    }

    const dir = 'react/';
    const suffix = file.name.slice(file.name.lastIndexOf('.'));
    const filename = Date.now() + suffix;
    file.key = OSSData.dir + dir + filename;
    file.url = OSSData.host + OSSData.dir + dir + filename;

    return file;
  };

  render() {
    const { value, accept } = this.props;
    const props = {
      accept: accept || '',
      name: 'file',
      listType: 'picture',
      maxCount: 1,
      fileList: value,
      action: this.state.OSSData.host,
      onChange: this.onChange,
      data: this.getExtraData,
      beforeUpload: this.beforeUpload,
    };
    return <Upload {...props}>{this.props.children}</Upload>;
  }
}
