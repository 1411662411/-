import React from 'react'
import {
    Row,
    Button,
    Col,
    Modal,
    message,
    Input, 
    Icon
} from 'antd'
const { TextArea } = Input;
import { DOMAIN_OXT } from '../../global/global';
import EditorImg from '../../components/common/react-copper';
import { fetchFileL } from '../../util/fetch';
class Guest extends React.Component<any,any>{
    constructor(props){
        super(props)
       this.state={
                id:this.props.id,
               name:'',
               profilePhoto:'',
               introduction:'',
               contentShowModel:false,
               file:'',
               buttonLoabgding:false
       }
    }
    componentWillMount(){
        if(this.props.type===3){
            const gusts = this.props.number
            this.setState({
                name: gusts.name,
                profilePhoto: gusts.profilePhoto,
                introduction: gusts.introduction
            })
        }
       
    }
    textCheck(str) {
        return str.replace(/(^\s*)|(\s*$)/g, "")
    }
    handleChnage(e){
        let value = this.textCheck(e.target.value)
        if (value.length > 10) {
            message.error('		主讲嘉宾姓名请控制在10个字之内')
        }
        this.setState({
            name: e.target.value
        })
        if (this.props.type === 3 || this.props.type === 1){
            this.props.handleEmail({
                name: e.target.value,
                id: this.state.id,
                profilePhoto: this.props.number.profilePhoto,
                introduction: this.props.number.introduction
            })
        }
       
    }
    txtChange(e){
        let value = this.textCheck(e.target.value)
        if (value.length > 150) {
            message.error('主讲嘉宾简介请控制在150个字之内')
        }
        this.setState({
            introduction: e.target.value
        })
        if (this.props.type === 3 || this.props.type === 1) {
            this.props.handleEmail({
                introduction: e.target.value,
                id: this.state.id,
                name: this.props.number.name,
                profilePhoto: this.props.number.profilePhoto,
            })
        }
        
    }
    info(){
        return this.state
    }
    beforeUpload(file) {
        let accept: string[] = ['.jpg', '.jpeg', '.bmp', '.png']
        let fileType = file.name.split('.')
        fileType = '.' + fileType.pop()
        let isJPG = false
        
        for (let i = 0; i < accept.length; i++) {
            if (fileType == accept[i]) {
                isJPG = true;
                break
            }

        }
        if (!isJPG) {
                message.error(`主讲嘉宾头像格式错误`)
                return false
        }

        const isLt16M: any = file.size ? file.size  < 150*150*4 : true;
        if (!isLt16M) {
            message.error('尺寸小于150*150px');
        }


        return isJPG && isLt16M;
    }
    imgClose() {
       
        this.setState({
            profilePhoto: ''
        })
        this.props.handleEmail({
            introduction: this.props.number.introduction,
            id: this.state.id,
            name: this.props.number.name,
            profilePhoto: '',
        })
    }
    editer:any
    dataURLtoFile (dataurl, filename = 'file') {
        let arr = dataurl.split(',')
        let mime = arr[0].match(/:(.*?);/)[1]
        let suffix = mime.split('/')[1]
        let bstr = atob(arr[1])
        let n = bstr.length
        let u8arr = new Uint8Array(n)
        while (n--) {
          u8arr[n] = bstr.charCodeAt(n)
        }
        return new File([u8arr], `${filename}.${suffix}`, {type: mime})
      }
    contenthandleOk= ()=>{
        const __this = this
        this.setState({
            contentShowModel:false,
            buttonLoabgding:true
        });
        let aa = this.editer.cropImage()//子元素裁剪后的base64
        let Formdata = this.dataURLtoFile(aa)//转换成file格式
        let res :any=  fetchFileL(`${DOMAIN_OXT}/api/fileUpload/common`, Formdata);
        res.then(((res)=>{
            if(res.status == 0){
                const src = res.data;
                this.setState({
                    profilePhoto:src,
                    buttonLoabgding:false
                });
                if (__this.props.type === 3 || __this.props.type === 1) {
                    __this.props.handleEmail({
                        profilePhoto: src,
                        id: __this.props.number.id,
                        name: __this.props.number.name,
                        introduction: __this.props.number.introduction
                    })
                }
            }else{
                message.error('设置失败')
            }
        }))
        
    }
    contenthandleCancel(){
        this.setState({
            contentShowModel:false
      });
    }
    copperProps(e){
        this.setState({
            buttonLoabgding:true
        })
        let files = e.target.files[0]
        let reader = new FileReader()
        let dataU = reader.readAsDataURL(files)
        let accept: string[] = ['.jpg', '.jpeg', '.bmp', '.png']
        let fileType = files.name.split('.')
        fileType = '.' + fileType.pop()
        let isJPG = false
        for (let i = 0; i < accept.length; i++) {
            if (fileType == accept[i]) {
                isJPG = true;
                break
            }
        }
        if (!isJPG) {
            message.error(`活动封面格式错误`)
            return false
        }
        reader.onload=(e:any)=>{
           this.setState({
                contentShowModel:true,
                file:e.target.result,
                buttonLoabgding:false
            })
        }
    }
    render(){
        return (
            <div>
            
                <Row type="flex" justify="space-between" align="middle" style={{ background: '#fff' }}>
                    <Col span={12}>
                        <div style={{ width: '100%', display: 'inline-block', border: '1px solid #d9d9d9', padding: '3px' }}>
                            <Row type="flex" justify="space-between" align="middle">
                                <Col span={16} style={{ position: 'relative'}}>
                                    {this.props.type == 3 ? <div className='img-left' style={{ position: 'relative' }}>
                                     {this.state.profilePhoto=='' || this.props.number.profilePhoto == ''?"":<Icon type="close" style={{position:'absolute',top:0,right:0}} onClick={()=>this.imgClose()}/>}
                                        {this.state.profilePhoto || this.props.number.profilePhoto != '' ? <span style={{ display: 'inline-block', height: '190px', width: '100%' }}><img style={{ display: 'inline-block', maxHeight: '190px', maxWidth: '100%' }} src={this.props.number.profilePhoto} alt="" /></span>
                                            : <Icon type="picture" style={{ fontSize: 60, color: '#d9d9d9', position: 'absolute', left: '40%', top: '30%' }} />
                                        }

                                    </div>:
                                        <div className='img-left' style={{ position: 'relative' }}>
                                           {this.state.profilePhoto ==''?'': <Icon type="close" style={{ position: 'absolute', top: 0, right: 0 }} onClick={() => this.imgClose()} />}
                                            {this.state.profilePhoto ? <span style={{ display: 'inline-block', height: '190px', width: '100%' }} ><img style={{ display: 'inline-block', maxHeight: '190px', maxWidth: '100%' }} src={this.state.profilePhoto} alt="" /></span>
                                                : <Icon type="picture" style={{ fontSize: 60, color: '#d9d9d9', position: 'absolute', left: '40%', top: '30%' }} />
                                            }

                                        </div>}
                                    
                                </Col>
                                <Col span={7}>
                                    <div className='upload-right'>
                                        <Row><span>图片小于16M，格式：jpg、png、bmp，建议尺寸大于150×150px</span></Row>
                                        <Row style={{ marginTop: 20 }}>
                                            <Modal
                                                className='alincenter'
                                                title="编辑头像"
                                                visible={this.state.contentShowModel}
                                                onOk={()=>this.contenthandleOk()}
                                                onCancel={()=>this.contenthandleCancel()}
                                                key={Math.random()}
                                                >
                                                    <EditorImg 
                                                        imgsrc={this.state.file}
                                                        aspectRatio={150/150}
                                                        ref={node => this.editer = node}
                                                    />
                                                </Modal>
                                                {/* <Button className='uploadButton' type='primary' ghost loading={this.state.buttonLoabgding} key={Math.random()}>
                                                    
                                                    <label className='uploadLable' htmlFor={this.state.id}><Icon type="upload" />上传文件</label>
                                                    <input 
                                                        key={Math.random()}
                                                        type="file" 
                                                        onChange={(e)=>this.copperProps(e)} 
                                                        id={this.state.id} 
                                                        style={{position:'absolute',clip:'rect(0 0 0 0)'}}
                                                    />
                                                </Button> */}
                                                <label className='uploadLable' htmlFor={this.state.id}>
                                                <Icon type="upload" />上传文件</label>
                                                <input 
                                                        key={Math.random()}
                                                        type="file" 
                                                        onChange={(e)=>this.copperProps(e)} 
                                                        id={this.state.id} 
                                                        style={{position:'absolute',clip:'rect(0 0 0 0)'}}
                                                    />
                                                    <Button className='uploadButton' type='primary' ghost loading={this.state.buttonLoabgding} key={Math.random()}>
                                                    
                                                    </Button>
                                        </Row>
                                    </div>
                                </Col>

                            </Row>
                        </div>
                    </Col>
                    <Col span={12} style={{ border: '1px solid #d9d9d9', borderLeft: 'none', }}>
                        <div style={{ height: '191px', width: '100%', display: 'inline-block', }}>

                            <div style={{ borderBottom: '1px solid #d9d9d9', height: '40px', textAlign: 'center' }}>
                                <Col span={4} style={{ height: '40px', borderRight: '1px solid #d9d9d9' }}><span>主讲嘉宾姓名</span> </Col>
                                <Col span={20} style={{ padding: '3px 3px 5px 3px' }}>
                                    {this.props.type == 3 ? <Input  onChange={(e) => this.handleChnage(e)} value={this.props.number.name} />:
                                        <Input placeholder='请填写姓名' onChange={(e) => this.handleChnage(e)}  value={this.state.name} />
                                }
                                     
                                </Col>
                            </div>


                            <div style={{ textAlign: 'center', }}>
                                <Col span={4} style={{ height: '157px', borderRight: '1px solid #d9d9d9' }}>
                                    <span style={{ lineHeight: '35px', }}>主讲嘉宾简介</span>
                                </Col>
                                <Col span={20} style={{ lineHeight: '35px', padding: '3px' }}>
                                    {this.props.type === 3 ? <TextArea onChange={(e) => this.txtChange(e)} style={{ height: '145px' }} value={this.props.number.introduction} />:
                                        <TextArea placeholder='请填写简介' onChange={(e) => this.txtChange(e)} style={{ height: '145px' }} value={this.state.introduction} />
                                }
                                    
                                </Col>
                            </div>

                        </div>
                    </Col>
                </Row>
            </div>
        )
    }

}
export default Guest

