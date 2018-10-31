import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Map, List, fromJS } from 'immutable'
import {
    Input,
    Col,
    Row,
    Upload, 
    message, 
    Button, 
    Icon,
    Select ,
    Form,
    Spin,
} from 'antd'
import TableUI from '../../components/Table/index';
import '../../css/policyPackage/socialSecurityInformation.less'
import query from '../../util/query';
import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
import getRegExp from '../../util/regExp';
import { singleInfoDispatch, singleInfoEditorDispatch } from '../../action/singleInfomation/singleInfoAction'
import { resolve } from 'url';
import { reject } from '../../action/financialManagement/chargeOffByFilialeAction';
const urlSrc = window.location
const uploadApi = `${DOMAIN_OXT}/api/fileupload?type=19`;
const { Option, OptGroup } = Select;
const  FormItem = Form.Item
const selectUrl = `${DOMAIN_OXT}/apiv2_/crm/openapi/businessType/getAll`;
const TextArea = Input.TextArea;

const inFoMap = {
    'businessLicense':'营业执照',// 		营业执照
    'businessLicenseCode':'统一社会信用代码',// 	统一社会信用代码
    'businessType':'行业类型',// 		行业类型
    'shortCall':'单位简称',// 		单位简称
    'telephone': '单位电话',// 	单位电话
    'postcode':'邮政编码',// 		邮政编码
    'address':'单位办公地址',// 		单位办公地址
    'businessContacts':'业务联系人',// 	业务联系人
    'businessPhone':'业务联系人手机号码',// 		业务联系人手机号码
    'businessMail':'业务联系人邮箱',// 		业务联系人邮箱
    'remark':'备注',// 			备注 
    "openBank": null,
    "bankAccount": null
}


class SocialSecurityIn extends React.Component<any,any>{
    constructor(props) {
        super(props)
        this.state={
            isClick:true,
            selectItem:[],
            businessLicense:'',
            loading:true,
            fileList: []
          
        }
    }
    componentWillMount(){
        let {
            dispatch
        } = this.props
        const UrlSearchParams = this.getUrlSearch(urlSrc.search)
        const urlParams = UrlSearchParams[0]
        dispatch(singleInfoDispatch(urlParams))
        
        fetchFn(selectUrl, {}).then(
            (data) => {
                let businessLicense = []
                if (this.props.data.companyInfoOfFront) {
                    if (JSON.parse(this.props.data.companyInfoOfFront).businessLicense) {
                        businessLicense = JSON.parse(this.props.data.companyInfoOfFront).businessLicense.split(',')
                    }
                }
                let filsList: any = []
                if (businessLicense.length > 0) {
                    for (let i = 0; i < businessLicense.length; i++) {
                        filsList.push({
                            uid: new Date(),
                            name: `营业执照`,
                            status: "done",
                            url: businessLicense[i],
                        })
                    }
                } else {
                    filsList = []
                }
                this.setState({
                    selectItem: data.data,
                    fileList: filsList
                })   
            }
        )
    }
    componentDidMount(){
        const urlParams: any = query('customerName')
        document.querySelectorAll('.ant-breadcrumb-link')[0].innerHTML = '单立户_社保户信息：'+urlParams;
    }
    getUrlSearch(url){
        let data = url.split('?')
        let singletonSocialInfoId
        data = data[1].split('&')
        let dataId = data[0].split('=')
        let dataName = data[1].split('=')
        let a = dataId[0];
        let b = dataId[1];
        let d = dataName[1];
        let str = [{[a]:b},d]
        return str   
    }
    onChangeEditor = ()=>{
        this.setState({
            isClick:false
        })
    }
    onChangeSave = (e) =>{
        e.preventDefault();
        const { dispatch } = this.props
        let ajaxData 
        let businessLicense:any= [] 
        if (this.state.fileList.length > 0){
            for (let i = 0; i < this.state.fileList.length;i++){
                businessLicense.push(this.state.fileList[i].url)
            }
        }
        businessLicense = businessLicense.join(',')
        this.props.form.validateFields(async(err, values) => {
            if (!err) {
                 ajaxData = {
                    id: query('singletonSocialInfoId'),//   
                    ...values,
                     businessLicenses: businessLicense,
                     callback:()=>{
                         const UrlSearchParams = this.getUrlSearch(urlSrc.search)
                         const urlParams = UrlSearchParams[0]
                         dispatch(singleInfoDispatch(urlParams))
                     }	
                }
                for (let k in ajaxData){
                    k = k.replace(/(^\s*)|(\s*$)/g, "")
                }
                   dispatch(singleInfoEditorDispatch(ajaxData))
                  
                //   setTimeout(() => {
                     
                //   }, 500);
                setTimeout(() => {
                    this.setState({
                        isClick: true
                    })
                }, 500);
                
            }
        });  
    }
    onChangeCancel = () =>{
        this.setState({
            isClick: true
        })
    }
   
    beforeUpload=(file) =>{
      let  accept: string[] = ['.jpg', '.jpeg', '.bmp','.png', '.gif', '.pdf']
        let fileType = file.name.split('.')
        fileType = '.' + fileType.pop()
        let isJPG = false
        for(let i=0;i<accept.length;i++){
            if (fileType == accept[i]){
                isJPG = true;
                break
            }
            
        }
        if (!isJPG) {
            if (file.name=='营业执照'){
                isJPG = true;
            }else{
                message.error(`营业执照仅支持 ${accept.join(',')} 格式`)
                return false
            }
           
        }
      
        const isLt16M: any = file.size ? file.size/ 1024 / 1024 < 16:true;
        if (!isLt16M) {
                message.error('营业执照大小请控制在16M以内！');
            }

        
        return isJPG && isLt16M;
    }
    
    handleChange = (info ) => {
        if(!this.beforeUpload(info.file)){
            return false
        }
        let fileList = info.fileList;

        // 1. Limit the number of uploaded files
        //    Only to show two recent uploaded files, and old ones will be replaced by the new
       
        // 2. read from response and show file link
        
        fileList = fileList.map((file) => {
            if (file.response) {
                // Component will show file.url as link
                file.url = file.response.data;
            }
            return file;
        });

        // 3. filter successfully uploaded files according to response from server
       
    
        
        this.setState({
            fileList: fileList
        });
    }
    
    selectHandleChange = (value,k)=>{
        this.setState({
            [k]: value
        })
    }
    render(){
       console.log(this.state)
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const UploadUI = 
            
            <Upload
               
                className="avatar-uploader"
                action={uploadApi}
                multiple= {true}
                onChange={this.handleChange}
                fileList={this.state.fileList}
            >
                <Button>
                    <Icon type="upload" />点击上传
            </Button>
            </Upload>
       
      
        let child:any = [];
         this.state.selectItem.map((item,index) => {
             let children: any = [];
             child.push(<OptGroup label={item.typeName} key={index}>
                        {item.sons.map((op, key) => {
                            children.push(<Option key={key} value={op.id}>{op.typeName}</Option>)
                        })} 
                            {children}
                        </OptGroup>)})
        const dataSoucr = this.props.data ? this.props.data:null
       
        let companyInfoOfFront
        let companyInfoOfCustomer
        let socialOpenData
        let fundOpenData
        if (dataSoucr){
            companyInfoOfFront = dataSoucr.companyInfoOfFront ? JSON.parse(dataSoucr.companyInfoOfFront) : null
            companyInfoOfCustomer = dataSoucr.companyInfoOfCustomer ? JSON.parse(dataSoucr.companyInfoOfCustomer) : null
            socialOpenData = dataSoucr.socialOpenData ? JSON.parse(dataSoucr.socialOpenData): null
            fundOpenData = dataSoucr.fundOpenData ? JSON.parse(dataSoucr.fundOpenData) : null
        }else{
            companyInfoOfFront =  null
            companyInfoOfCustomer = null
            socialOpenData =  null
            fundOpenData =  null
        }
        let businessTypeName
        if (companyInfoOfCustomer){
            if(companyInfoOfCustomer.businessType){
                this.state.selectItem.map((val,index)=>{
                    val.sons.map((v,k)=>{
                        if (v.id == companyInfoOfCustomer.businessType){
                            businessTypeName = v.typeName
                        }
                    })
                })
            }
        }
        let businessLicense = []
        if (companyInfoOfFront){
            if (companyInfoOfFront.businessLicense){
                businessLicense = companyInfoOfFront.businessLicense.split(',')
            }
        }
        // [a,b]
        const { getFieldDecorator, setFieldsValue } = this.props.form
        const componyInfo = [
            {
                
                label: '营业执照',
                value: businessLicense.length == 0 ? '/' : businessLicense.map((val,index)=>
                    <div><a href={val} target='_blank' key={index}>查看图片</a></div>
                ),
                required: false,
                isAll: false,
            },
            {
                label: '统一社会信用代码（组织机构代码证号）',
                value: companyInfoOfCustomer ? (companyInfoOfCustomer.businessLicenseCode ? companyInfoOfCustomer.businessLicenseCode:'/'):'/',
                required: false,
                isAll: false,
            },
            {
                label: '单位简称',
                value: companyInfoOfFront ? (companyInfoOfFront.shortCall ? companyInfoOfFront.shortCall : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '单位电话',
                value: companyInfoOfFront ? (companyInfoOfFront.telephone ? companyInfoOfFront.telephone : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '邮政编码',
                value: companyInfoOfFront ? (companyInfoOfFront.postcode ? companyInfoOfFront.postcode : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '单位办公地址',
                value: companyInfoOfFront ? (companyInfoOfFront.address ? companyInfoOfFront.address : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '行业代码',
                value: companyInfoOfCustomer ? (companyInfoOfCustomer.businessType ? businessTypeName : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '业务联系人',
                value: companyInfoOfCustomer ? (companyInfoOfCustomer.businessContacts ? companyInfoOfCustomer.businessContacts : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '业务联系人手机号码',
                value: companyInfoOfCustomer ? (companyInfoOfCustomer.businessPhone ? companyInfoOfCustomer.businessPhone : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '业务联系人邮箱',
                value: companyInfoOfCustomer ? (companyInfoOfCustomer.businessMail ? companyInfoOfCustomer.businessMail : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '开户银行',
                value: companyInfoOfFront ? (companyInfoOfFront.openBank ? companyInfoOfFront.openBank : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '银行对公账号',
                value: companyInfoOfFront ? (companyInfoOfFront.bankAccount ? companyInfoOfFront.bankAccount : '/') : '/',
                required: false,
                isAll: false,
            },
            {
                label: '备注',
                value: dataSoucr ? (dataSoucr.remark ? dataSoucr.remark:'/'):'/',
                required: false,
                isAll: false,
            },

        ]
       
      
        const componyInfoEditor = [
            {
                label: '营业执照',
                value: UploadUI,
                required: false,
                isAll: false,
            },
          {
                label: '统一社会信用代码（组织机构代码证号）',
                value:  < FormItem label = "" { ...formItemLayout } >
            {
                        getFieldDecorator('businessLicenseCode', {
                            initialValue: companyInfoOfCustomer ? (companyInfoOfCustomer.businessLicenseCode ? companyInfoOfCustomer.businessLicenseCode : '') : '',
                            rules: [
                                {
                                    max: 200,
                                    message: '纳税人统一信用代码格式不正确'
                                }
                                
                            ]
                        })(
                    <Input />
                )
                    }
                </FormItem>,
               
              required: false,
                isAll: false,
            },
            {
                label: '单位简称',
                
                value: < FormItem label="" { ...formItemLayout } >
                    {
                        getFieldDecorator('shortCall', {
                            initialValue: companyInfoOfFront ? (companyInfoOfFront.shortCall ? companyInfoOfFront.shortCall : '') : '',
                            rules: [
                                {
                                    max: 200,
                                    message: '请控制在200个字之内',
                                }
                            ],
                        })(
                            <Input/>
                            )
                    }
                </FormItem>,
                required: false,
                isAll: false,
            },
            {
             
                label: '单位电话',
                value: <FormItem label="" {...formItemLayout}>
                   
                    {getFieldDecorator('telephone', {
                        initialValue: companyInfoOfFront ? (companyInfoOfFront.telephone ? companyInfoOfFront.telephone : '') : '',
                             rules: [
                                {
                                     max: 200, message: '电话格式不正确'
                                 } 
                            ]
                        })(
                            < Input  />
                            )}
                        
                </FormItem>,
                required: false,
                isAll: false,
            },
            {
              
                label: '邮政编码',
                value: <FormItem label="" {...formItemLayout}>
                    {
                        getFieldDecorator('postcode', {
                            initialValue: companyInfoOfFront ? (companyInfoOfFront.postcode ? companyInfoOfFront.postcode : '') : '',
                            rules: [
                                {
                                    max: 200, message: '邮编格式不正确'
                                }
                            ]
                        })(
                            <Input />
                            )
                            
                    }
                </FormItem>,
                required: false,
                isAll: false,
            },
            {
             
                label: '单位办公地址',
                value: <FormItem label=""  {...formItemLayout}>
                    {
                        getFieldDecorator('address', {
                            initialValue: companyInfoOfFront ? (companyInfoOfFront.address ? companyInfoOfFront.address : '') : '',
                            rules: [
                                {
                                    max: 200,
                                    message: '请控制在200个字之内',
                                }
                            ],
                        })(
                            <Input  />
                            )
                    }
                </FormItem>,
                required: false,
                isAll: false,
            },
            {
                label: '行业代码',
                value: 
                    <FormItem label="" {...formItemLayout}>
                        {
                            getFieldDecorator('businessType', {
                                initialValue: companyInfoOfCustomer ? (companyInfoOfCustomer.businessType ? companyInfoOfCustomer.businessType : '') : '',
                            })(
                                <Select
                                    style={{ width: 200 }}
                                    onChange={value => this.selectHandleChange(value, 'businessType')}
                                    dropdownClassName='lucy'
                                >
                                    {child}
                                </Select >,
                                )
                        }
                    </FormItem>,
                required: false,
                isAll: false,
            },
            {
               
                label: '业务联系人',
                value: <FormItem label="" {...formItemLayout}>
                    {
                         getFieldDecorator('businessContacts', {
                            initialValue: companyInfoOfCustomer ? (companyInfoOfCustomer.businessContacts ? companyInfoOfCustomer.businessContacts : '') : '',
                            rules: [{
                                max: 200, message: '请控制在200个字之内'
                            }]
                        })(
                            <Input />
                            )
                           
                    }
                </FormItem>,
                required: false,
                isAll: false,
            },
            {
              
                label: '业务联系人手机号码',
                value: <FormItem label="" {...formItemLayout}>

                    {getFieldDecorator('businessPhone', {
                        initialValue: companyInfoOfCustomer ? (companyInfoOfCustomer.businessPhone ? companyInfoOfCustomer.businessPhone : '') : '',
                        rules: [
                            {
                                max: 200, message: '电话格式不正确'
                            }
                        ]
                    })(
                        <Input  />
                        )}

                </FormItem>,
                required: false,
                isAll: false,
            },
            {
                
                label: '业务联系人邮箱',
                value: <FormItem
                        {...formItemLayout}
                        label=""
                    >
                    {getFieldDecorator('businessMail', {
                        initialValue: companyInfoOfCustomer ? (companyInfoOfCustomer.businessMail ? companyInfoOfCustomer.businessMail : '') : '',
                            rules: [{
                                max: 200, message: '邮箱格式不正确!',
                            }],
                        })(
                        <Input  />
                            )}
                    </FormItem>,
                required: false,
                isAll: false,
            },
            {
                label: '开户银行',
                value: < FormItem label="" { ...formItemLayout } >
                {
                    getFieldDecorator('openBank', {
                    initialValue: companyInfoOfFront ? (companyInfoOfFront.openBank ? companyInfoOfFront.openBank : '') : '',
                    rules: [{
                        max: 200,
                        message: '请控制在200个字之内'
                            }]
                    })(
                        <Input />
                    )
                           
                }
                </FormItem >,
                
                required: false,
                isAll: false,
            },
            {
                label: '银行对公账号',
                value:  < FormItem label="" { ...formItemLayout } >
                        {
                            getFieldDecorator('bankAccount', {
                                initialValue: companyInfoOfFront ? (companyInfoOfFront.bankAccount ? companyInfoOfFront.bankAccount : '') : '',
                                rules: [{
                                    max: 200, message: '银行账号格式不正确'
                                        }]
                                })(
                                    <Input />
                                )
                                        
                        }
                            </FormItem >,
                required: false,
                isAll: false,
            },
            {
                
                label: '备注',
                value: <FormItem label="" colon={false} {...formItemLayout}>
                    {
                        getFieldDecorator('remark', {
                            initialValue: dataSoucr ? (dataSoucr.remark ? dataSoucr.remark : '') : '',
                            rules: [
                                {
                                    max: 500,
                                    message: '请控制在500个字之内',
                                }
                            ],
                        })(
                            <TextArea />
                            )
                    }
                </FormItem>,
                required: false,
                isAll: false,
            },

        ]
        console.log(this.props)
        return <div>
            <Spin spinning={this.props.Fetchloading}>
            {this.state.isClick ? <Row>
                <h2 style={{ 'display': 'inline-block' }}>公司信息：</h2><a onClick={this.onChangeEditor} style={{ 'fontSize': '16px' }}>编辑</a>
                <TableUI
                    dataSource={componyInfo}
                    colgroup={[25, 25, 25, 25]}
                />

            </Row> : <Row>
                    <Form onSubmit={(e)=>this.onChangeSave(e)}>
                        <FormItem>
                            <h2 style={{ 'display': 'inline-block' }}>公司信息：</h2><Button htmlType="submit" style={{ 'color': '#22baa0','border':'none','fontSize': '16px', 'marginRight': '10px' }} >保存</Button><a onClick={this.onChangeCancel} style={{ 'fontSize': '16px' }} >取消</a>
                        </FormItem>
                        <TableUI
                            dataSource={componyInfoEditor}
                            colgroup={[25, 25, 25, 25]}
                        />
                    </Form>
                </Row>}
            
            </Spin>
            <Row style={{ 'marginTop': '40px' }}>
                <h2 style={{ 'display': 'inline-block'}}>社保账户信息</h2>
                <TableUI
                // "collectionDateOfSocial":"2", 社保托收日期（每月）
                // "loginPasswordOfSocial":"1", 社保一证通登录密码
                // "bookingNumberOfSocial":"2",  社保业务约号密码
                // "corporateAccountOfSocial":"2",  银行对公帐号
                // "loginCommandOfSocial":"1",    社保一证通登录口令
                // "registrationNumberOfSocial":"1", 社保登记证号 
                // "collectionBankOfSocial":"2",  社保托收银行 

                    dataSource={[
                        {
                            label: '社保登记证号',
                            value: socialOpenData ? (socialOpenData.registrationNumberOfSocial ? socialOpenData.registrationNumberOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '社保一证通登录密码',
                            value: socialOpenData ? (socialOpenData.loginPasswordOfSocial ? socialOpenData.loginPasswordOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '社保一证通登录口令',
                            value: socialOpenData ? (socialOpenData.loginCommandOfSocial ? socialOpenData.loginCommandOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '社保业务约号密码',
                            value: socialOpenData ? (socialOpenData.bookingNumberOfSocial ? socialOpenData.bookingNumberOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '社保托收日期（每月）',
                            value: socialOpenData ? (socialOpenData.collectionDateOfSocial ? socialOpenData.collectionDateOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '社保托收银行',
                            value: socialOpenData ? (socialOpenData.collectionBankOfSocial ? socialOpenData.collectionBankOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '银行对公帐号',
                            value: socialOpenData ? (socialOpenData.corporateAccountOfSocial ? socialOpenData.corporateAccountOfSocial : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                    ]}
                    colgroup={[25, 25, 25, 25]}
                />

            </Row>
            <Row style={{ 'marginTop': '40px' }}>
                <h2 style={{ 'display': 'inline-block' }}>公积金账户信息</h2>
                <TableUI
                    dataSource={[
                        {
                            label: '公积金隶属管理部',
                            value: fundOpenData ? (fundOpenData.managementDepartmentOfFund ? fundOpenData.managementDepartmentOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '公积金单位编号',
                            value: fundOpenData ? (fundOpenData.employerCodeOfFund ? fundOpenData.employerCodeOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '公积金一证通数字证书登录密码',
                            value: fundOpenData ? (fundOpenData.loginPasswordOfFund ? fundOpenData.loginPasswordOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '公积金托收日期（每月）',
                            value: fundOpenData ? (fundOpenData.collectionDateOfFund ? fundOpenData.collectionDateOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '公积金托收银行',
                            value: fundOpenData ? (fundOpenData.collectionBankOfFund ? fundOpenData.collectionBankOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                        {
                            label: '银行对公帐号',
                            value: fundOpenData ? (fundOpenData.corporateAccountOfFund ? fundOpenData.corporateAccountOfFund : '/') : '/',
                            required: false,
                            isAll: false,
                        },
                    ]}
                    colgroup={[25, 25, 25, 25]}
                />

            </Row>
          
            </div>
    }
}
const mapStateToProps = (state: any, ownProps: any): any => {
    const data = state.get('singleInfoReducer');
    return {
        data: data.toJS().singleInfoData,
        saveData: data.toJS().saveData,
        Fetchloading: data.toJS().Fetchloading
    }
}
const SocialSecurityInFo = Form.create()(SocialSecurityIn)


export default connect(mapStateToProps)(SocialSecurityInFo)