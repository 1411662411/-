import {DOMAIN_OXT} from "../../../global/global";
import { fetchFn, fetchFile } from '../../../util/fetch';
import React from 'react';

import { Modal, Row, Col, Upload, Button, message, Spin } from 'antd';

import JoyoModal from '../JoyoModal';


const GETTEMPLATEURLAPI = `${DOMAIN_OXT}/apiv2_/crm/api/module/customer/getTemplateUrl`;
const GETTEMPLATEURLCLUEAPI = `${DOMAIN_OXT}/apiv2_/crm/api/module/customerClue/getTemplateUrl`;
const getTemplateUrl = (data) => {
    return fetchFn( data ? GETTEMPLATEURLAPI : GETTEMPLATEURLCLUEAPI , data & data).then(data => data);
}

import './style.less'

const templateUrls= ['company-customer', 'customer-contact', 'customer-follow-up',''];
const templateTitles = ['下载excel模板 （客户信息）', '下载excel模板 （联系人）', '下载excel模板 （跟进记录）','下载excel模板（销售线索）'];
const uploadUrls = [
    `${DOMAIN_OXT}/api/crm/customer/importExcel`, 
    `${DOMAIN_OXT}/api/crm/customerContact/importExcel`, 
    `${DOMAIN_OXT}/api/crm/customerFollowUp/importExcel`,
    `${DOMAIN_OXT}/api/crm/customerClue/importExcel`,
];

interface ImportProps{
    type: 0 | 1 | 2 | 3;  // 0 （客户信息） 1（联系人） 2（跟进记录） 3（销售线索）
    visible: boolean;
    close: Function;
}

class Import extends React.Component<ImportProps,any>{
    constructor(props){
        super(props)
        this.state={
            url:'',
            importLoading:true,
            src:'',
            fileName:'',
            fileUrl:'',
            file: null,
            importVisible: true,
            loading: false,
            tipVisible:false, //提示弹窗显示
            tipContent:'',
        }
    }

    async componentWillMount(){
        let res:any = await getTemplateUrl(this.props.type == 3 ? null :{templateFileName: templateUrls[this.props.type]})
        if(res.errcode == 0){
            this.setState({url:res.data.url, importLoading:false})
        }
    }
    beforeUpload = (file) => {
        let name = file.name.split('.');
        name = name[name.length-1];
        if (name != 'xls' && name != 'xlsx' ){
            message.error('请选择上传excel文件');
            return false;
        }
        const isLt8M = file.size / 1024 / 1024 < 8;
        if (!isLt8M) {
          message.error('文件不可大于8M!');
          return false;
        }
        this.setState({file,importLoading: false})
        return false;
    }

    handleUpload = async() => {
        const { file } = this.state;
        if(!file){
            message.error('请选择上传文件！')
            return ;
        }
        
        this.setState({
            importVisible: false,
            loading: true,
            importLoading: true,
        });
        
        let res = await fetchFile(uploadUrls[this.props.type],file)
        this.setState({loading: false});
        if(res.status !== 0) {
            if(res.errcode == 20111){
                this.setState({
                    tipVisible: true,
                    tipContent: <div><h3><strong>导入失败</strong></h3>
                    <p className="text-error">同学，导入的数据请在1000条之内哦</p>
                    <p className="text-small">请修改正确后重新导入</p></div>
                })
            }else if(res.errcode == 20113){
                this.setState({
                    tipVisible: true,
                    tipContent: <div><h3><strong>导入失败</strong></h3>
                    <p className="text-error">同学，你导入的客户数量超出了客户池上限，无法导入哦</p>
                    <p className="text-small">请修改正确后重新导入</p></div>
                })
            }else{
                message.error(res.msg || '导入失败')
                this.props.close();
            }
            return ;
        }
        if(res.data.fileUrl){
            let {
                totalData,
                failData,
                successData,
                fileUrl,
            } = res.data;
            this.setState({
                tipVisible: true,
                tipContent: <div><h3><strong>本次共导入{totalData}条数据，成功{successData}条，失败{failData}条</strong></h3>
                <a href={`${fileUrl}`}>失败数据名单下载</a>
                <p className="text-small">请修改正确后重新导入</p></div>
            })
        }else if(res.data && res.data.failData == 0 && res.data.successData == 0 && res.data.totalData == 0){
            this.setState({
                tipVisible: true,
                tipContent: <div><h3>本次共导入0条数据，成功0条，失败0条</h3>
                <p className="text-small">请修改正确后重新导入</p></div>
            })
        }else{
            message.success(res.msg || '批量上传成功')
            this.props.close();
        }
        
    }
    end = ()=>{
        this.setState({tipVisible: false},()=>{
            this.props.close();
        })
    }

    render(){
        const { url } = this.state;

        const props = {
            name: 'file',
            headers: {
              authorization: 'authorization-text',
            },
          };

        return this.props.visible && <div style={{
            position:'fixed',
            top:0,
            left:0,
            bottom:0,
            right:0,
            background:'rgba(0, 0, 0, 0.65)',
            zIndex:9,
        }}> <Loading
                visible = {this.state.loading}
            />
        {this.state.importVisible && <Modal
            title='导入'
            okText='导入'
            visible={true}
            confirmLoading={this.state.importLoading}
            onOk={this.handleUpload}
            onCancel={this.end}
        >
            <Spin
                spinning={this.state.importLoading}
            >
            <p></p>
            <Row>
                <Col style={{textAlign:'right',paddingRight:5}} span={6}>第一步：</Col>
                <Col span={18}><a href={url}>{templateTitles[this.props.type]}</a></Col>
            </Row>
            <br/>
            <Row>
                <Col style={{textAlign:'right',paddingRight:5}} span={6}>第二步：</Col>
                <Col span={18}>
                <Upload 
                    {...props}
                    beforeUpload={this.beforeUpload}
                    action= {uploadUrls[this.props.type]}
                    showUploadList={false}
                >
                    <Button>
                    上传文件
                    </Button>
                </Upload>
                <span>{this.state.file ? this.state.file.name : ''}</span>
                </Col>
            </Row>
            </Spin>
        </Modal>}
        {
            this.state.tipVisible && <JoyoModal
                visible={this.state.tipVisible}
                onCancel={this.end}
                onOk={this.end}
            >
                {this.state.tipContent}
            </JoyoModal>
        }
        </div>
    }
}

class Loading extends React.Component<any>{
    constructor(props){
        super(props)
    }

    render(){ //<div className="jy-loading-shade"></div>
        return this.props.visible && <div className="jy-loading">
            <span className="jy-loading-inside"></span>
            <span className="jy-loading-outerside"></span>
            <span className="jy-loading-text">导入中，请等待......</span>
        </div>
    }
}

export default Import