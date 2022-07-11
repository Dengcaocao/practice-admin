import React from 'react';
// 引入编辑器组件
import BraftEditor from 'braft-editor';
// 引入编辑器样式
import 'braft-editor/dist/index.css';
import { ContentUtils } from 'braft-utils';
import Upload from '@/components/upload';

export default class EditorDemo extends React.Component {
  state = {
    // 创建一个空的editorState作为初始值
    editorState: BraftEditor.createEditorState(this.props.content || null),
  };

  handleInsertMedias = (url) => {
    this.setState({
      editorState: ContentUtils.insertMedias(this.state.editorState, [
        {
          type: 'IMAGE',
          url,
        },
      ]),
    });
  };

  /**
   *  编辑器扩展组件
   */
  extendControls = [
    {
      key: 'antd-uploader',
      type: 'component',
      component: (
        <Upload accept="image/*" handleInsertMedias={this.handleInsertMedias}>
          {/* 这里的按钮最好加上type="button"，以避免在表单容器中触发表单提交，用Antd的Button组件则无需如此 */}
          <button type="button" className="control-item button upload-button" data-title="插入图片">
            插入图片
          </button>
        </Upload>
      ),
    },
  ];

  async componentDidMount() {
    // 假设此处从服务端获取html格式的编辑器内容
    // const htmlContent = await fetchEditorContent()
    // 使用BraftEditor.createEditorState将html字符串转换为编辑器需要的editorStat
    // this.setState({
    //     editorState: BraftEditor.createEditorState(null)
    // })
  }

  handleEditorChange = (editorState) => {
    this.setState({ editorState });
    const content = this.state.editorState.toHTML();
    if (!editorState.isEmpty()) {
      this.props.setValueEditor(content);
    } else {
      this.props.setValueEditor('');
    }
  };

  render() {
    console.log(this.props);
    return (
      <div className="editor-wrapper">
        <BraftEditor
          value={editorState}
          onChange={this.handleEditorChange}
          extendControls={this.extendControls}
        />
      </div>
    );
  }
}
