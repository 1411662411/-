import React from 'react';
import {notification} from 'antd';
import Cropper from 'react-cropper';
import './style.less'
import { FILEUPLOAD } from '../../../api/crm/common';

import 'cropperjs/dist/cropper.css';

const fetchFile = async (url,file)=>{
    let headers = new Headers();
    let data = new FormData()
    data.append('file', file)
    let request = new Request(url, { credentials: 'include', method: 'POST', body: data, });
    let json;
    try {
        let response = await fetch(request)
        json = await response.json()
        console.log('Async parallel+fetch >>>', json);
    } catch (error) {
        json = 'error'
    }
    console.log('下面return json')
    return await json
}

import img from '../../../images/avater-05.png';
const img2 = '//joyocrm.oss-cn-hangzhou.aliyuncs.com/test/joyowo/companycontract/2018/4/3/3d126c7923e74d8c8a1c9d6161239790/timg.gif?Expires=1522731025&OSSAccessKeyId=iEfjoIQrmkGXUDZi&Signature=uNCez5VQF%2FWDU%2FaqQ07ADRenySw%3D&x-oss-process=image%2Fresize%2Cm_lfit%2Cw_800%2Climit_1'

function base64ToBlob(urlData) {
    var arr = urlData.split(',');
    var mime = arr[0].match(/:(.*?);/)[1] || 'image/png';
    // 去掉url的头，并转化为byte
    var bytes = window.atob(arr[1]);
    // 处理异常,将ascii码小于0的转换为大于0
    var ab = new ArrayBuffer(bytes.length);
    // 生成视图（直接针对内存）：8位无符号整数，长度1个字节
    var ia = new Uint8Array(ab);
    
    for (var i = 0; i < bytes.length; i++) {
        ia[i] = bytes.charCodeAt(i);
    }

    return new Blob([ab], {
        type: mime
    });
}

interface imgCropper{
    width: number;
    height: number;
}

class ImgCropper extends React.Component<any,any>{
    constructor(props){
        super(props)
        this.state = {
            url:'',
            file: null as any,
        }
    }
    _crop(value){
        // console.log(value, value.getCroppedCanvas().toDataURL())
      // image in dataUrl
    //   console.log(this.refs.cropper, this.refs.cropper.getCroppedCanvas().toDataURL());
    let url = this.cropper.getCroppedCanvas().toDataURL();
    console.log(this.cropper, base64ToBlob(url));
    this.setState({url, file:base64ToBlob(url)})
    }
    upload = () => {
        // fetchFile(FILEUPLOAD,this.state.file)
        notification.open({
            message:' ',
            description: <a className='crm-notification-message' style={{color:'#999'}} target='_blank' 
            // dangerouslySetInnerHTML={{ __html:  }}
            >阿斯顿发射点恐怕撒娇的佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都Ii吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都Ii吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都Ii吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件佛i吉萨都IP附件
            </a>,
        })
    }
    cropper:any;
    render() {
      return (<div>
        <Cropper
            // ref='cropper'
            ref={(reactNode)=>{ this.cropper = reactNode}}
            dragMode='move'
            src={img2}
            style={{height: 150, width: 150}}
            checkCrossOrigin={false}
            // Cropper.js options
            aspectRatio={1 / 1}
            guides={false}
            crop={this._crop.bind(this)} 
            // getImageData={(value) => {console.log(value)}}
        />
        <p> <button onClick={this.upload}>click me!</button></p>
        <div style={{width: 120, height: 120}}><img style={{width: '100%'}} src={this.state.url} alt=""/></div>
      </div>)
    }
  }

  export default ImgCropper