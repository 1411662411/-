import React, { Component } from 'react';
import { DOMAIN_OXT } from '../../global/global';
interface ueditorProps {
  defaultValue?: any;
  id: string;
  config:any
}
interface ueditorState {
  id: string;
  config:any
}
declare global {
  interface Window { UE: any; }
}
export default class Ueditor extends Component<ueditorProps, ueditorState> {
  ueditor: any;
  constructor(props: ueditorProps) {
    super(props);
    this.state = {
      id: props.id,
      config:props.config
    }
  }
  componentDidMount() {
    let UE = window.UE;
    let { id } = this.state;
    if (id) {
      try {
        /*加载之前先执行删除操作，否则如果存在页面切换，
        再切回带编辑器页面重新加载时不刷新无法渲染出编辑器*/
        UE.delEditor(id);
        this.ueditor.destroy()
      } catch (e) { }
      if (this.ueditor) {
        this.ueditor.destroy()
      }
      this.ueditor = UE.getEditor(id, {
        serverUrl: `${DOMAIN_OXT}/api/ueditor/controller`,
        toolbars: [
          this.state.config
        ],
        initialFrameHeight: 300,
        initialFrameWidth: '100%'
      });
      if (!UE.Editor.prototype.isloader) {
        UE.Editor.prototype._bkGetActionUrl = UE.Editor.prototype.getActionUrl;

        UE.Editor.prototype.getActionUrl = function (action) {
          if (action == 'uploadimage' || action == 'uploadscrawl' || action == 'uploadimage' || action == 'uploadfile' || action == 'uploadvideo') {
            return `${DOMAIN_OXT}/api/fileuploadForUeditor`; //在这里返回我们实际的上传图片地址
          } else {
            return this._bkGetActionUrl.call(this, action);
          }
        }
      }

      UE.Editor.prototype.isloader = true;

      let me = this
      this.ueditor.ready(() => {
        let value = me.props.defaultValue;
        if(value){
          this.ueditor.setContent(value);
        }
      })
    }
  }
  componentWillUnmount() {
    // let me = this
    // this.ueditor.ready(() => {
    //   let value = me.props.defaultValue;
    //   this.ueditor.setContent(value);
    // })
    if (this.ueditor) {
      this.ueditor.destroy();
    }
  }
  render() {
    let { id } = this.state;
    return (
      <div>
        <textarea id={id}/>
      </div>
    );
  }
}
