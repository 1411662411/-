//api教程https://blog.csdn.net/weixin_38023551/article/details/78792400 
import React from 'react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import { Button, Input,Icon} from 'antd';
interface imgProps{
    imgsrc:any,
    aspectRatio?:any//图片比例
}
interface imgState{
    clickNum:number,
    rotateto:number,
    imggg:any,
    aspectRatio:any
} 
class EditorImg extends React.PureComponent<imgProps,imgState>{
    constructor(props) {
        super(props);
        this.cropImage = this.cropImage.bind(this);
        this.state={
            rotateto:0,//旋转角度
            clickNum:0,//左旋转按钮点击次数
            imggg:this.props.imgsrc,
            aspectRatio:this.props.aspectRatio?this.props.aspectRatio:750/426//图片比例
        }
    }
    cropper:any
    cropImage() {
      if (this.cropper.getCroppedCanvas() === 'null') {
          return false
      }else{
          return this.cropper.getCroppedCanvas().toDataURL()
      }
    //   console.log(this.cropper.getCroppedCanvas().toDataURL())
    //   console.log(this.base64ToBlob(this.cropper.getCroppedCanvas().toDataURL()))
    }
    base64ToBlob(urlData) {
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
    // selectInput(e){
    //    let files = e.target.files[0]
    //    let reader = new FileReader()
    //    let dataU = reader.readAsDataURL(files)
    //    reader.onload=(e:any)=>{
    //        this.setState({
    //         imggg:e.target.result
    //        })
    //      console.log(this.base64ToBlob(e.target.result))
    //    }
    // }
    rotateLeft(){
        // this.cropper.props.rotateTo = 90
        let clickNum = this.state.clickNum;
        clickNum++
        let rotateto = this.state.rotateto
        rotateto = 90*clickNum
        console.log(clickNum,this.cropper)
        this.setState({
            clickNum:clickNum,
            rotateto
        })
    }
    rotateRight(){
        let clickNum = this.state.clickNum;
        clickNum--
        let rotateto = this.state.rotateto
        rotateto = 90*clickNum
        console.log(clickNum,this.cropper)
        this.setState({
            clickNum:clickNum,
            rotateto
        })
    }
      render() {
        return (
          <div>
              <div>
                  <Cropper
                      src={this.state.imggg}
                      ref={cropper => {
                          this.cropper = cropper;
                      }}
                      style={{height: 400, width: '100%'}}
                      aspectRatio={this.state.aspectRatio}
                      guides={false}
                      cropBoxResizable={false}
                      dragMode='move'
                      rotateTo={this.state.rotateto}
                      viewMode={1}
                  />
              </div>
              {/* <input type="file" onChange={(e)=>this.selectInput(e)}/> */}
              <p style={{textAlign:'center'}}>
                <span onClick={()=>{this.rotateRight()}}><i style={{fontSize:'26px'}} className="crmiconfont crmicon-nishizhenxuanzhuan" ></i></span>
                <span onClick={()=>{this.rotateLeft()}}><i style={{fontSize:'26px'}} className="crmiconfont crmicon-shunshizhenxuanzhuan" ></i></span>
              </p>
              
          </div>
      );
    }
}
export default EditorImg