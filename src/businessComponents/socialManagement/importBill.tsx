/**
 * Created by yangws on 2018/4/02.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import * as actions from '../../action/socialManagement/importBillSpAction';
import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT,STATIC_DOMAIN } from '../../global/global';
import { SocialBill } from '../../components/common/socialBill';
import query from '../../util/query';
import {
    Form,
    Select,
    Input,
    Alert,
    Spin,
    Divider,
    message,
    Button,
    Modal,
    Upload,
    Row,
    Col,
    DatePicker,
    notification,
    Card,
    Menu,
    Dropdown,
    Icon,
    Cascader
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const actionCreators = {
    importBillSpSaga: actions.importBillSpSaga,
    importBillSpSubmitSaga: actions.importBillSpSubmitSaga
}
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';

import '../../css/socialManagement/importBillSp.less';

interface TOwnProps  {
    type: 1|2|3|4|5|6; // 账单类型 1会员订单 2 社保订单 3商保订单 4社保补差 5SP社保订单 6多多订单
}
interface TStateProps {
    dataSource: any;
    userInfo: any;
    
}


type TDispatchProps = typeof actionCreators;

interface importBillSpProps extends TOwnProps, TDispatchProps, TStateProps, FormComponentProps {
    
}
class ImportBillSpForm extends Component<importBillSpProps,any> {
    constructor(props: importBillSpProps) {
        super(props);
        this.state = {
            billData:{
                list:[],
                total:{}
            },
            excelDataKey:'',
            cId:query('id'),
            companyName:query('cname'),
            uploadTask: false,
            submitLoading: false,
            allowSubmit: false,
            errorInfo:''
        }
    }
    componentWillMount() {
        this.getSocialBill();
    }
    componentWillUnmount() {
        // this.handleLeave();
    }
    getImportName = () => {
        const {
            type 
        } = this.props;
        // 账单类型 1会员订单 2 社保订单 3商保订单 4社保补差 5SP社保订单 6多多订单
        switch (type) {
            case 1:
                return '会员账单'
            case 2:
                return '社保账单'
            case 3:
                return '商保账单'
            case 4:
                return '社保补差账单'
            case 5:
                return 'sp社保账单'
            case 6:
                return '多多账单'
            default:
                return ''
        }
    }
    getSocialBill = () => {
        const {
            cId,
            companyName
        } = this.state;
        if(cId && companyName){
            this.props.importBillSpSaga({
                cId
            });
        }else{
            message.error('未获取到正确的参数')
            this.setState({submitLoading:true})
        }
    }
    normFile = (e) => {
        console.log('Upload event:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }
    validateTaxPhone = (rule, value, callback) => {
        // value = String.prototype.trim.call(value === undefined ? '' : value);
        if(!value){
            return callback('请填写手机号');
        }
        if (!/^13[0-9]{9}$|14[0-9]{9}|15[0-9]{9}$|17[0-9]{9}$|18[0-9]{9}$/.test(value)) {
            return callback('请输入正确的手机号');
        }
        callback();
    }
    validateSocialBill = (rule, value, callback) => {
        const {
            billData
        } = this.state;
        if(billData.list && billData.list.lenght>1){
            return callback('请导入'+this.getImportName());
        }
        
        callback();
    }
    /**
     * 点击提交
     */
    handleSubmit = (e) => {
        this.setState({ submitLoading: true })
        const {
            type,
            form,
        } = this.props;
        // 验证form
        form.validateFieldsAndScroll((err, values) => {
            if (err) {
                this.setState({submitLoading: false})
                return
            }
            const {
                cId,
                billData,
                excelDataKey,
                companyName,
                allowSubmit,
                errorInfo,
                
            } = this.state;
            if(!billData.list || billData.list.length===0){
                message.error('请选导入的账单')
                this.setState({submitLoading: false})
                return
            }
            if(!allowSubmit || errorInfo) {
                message.error(errorInfo || '导入的账单内容格式有误')
                this.setState({submitLoading: false})
                return
            }
            this.props.importBillSpSubmitSaga({
                ...values,
                cId,
                type,
                excelDataKey,
                companyName,
                setSubmitLoading:()=> {
                    this.setState({submitLoading: false})
                }
                
            });
        });
    }
    handleLeave = () => {
        Modal.confirm({
            title: '提示',
            content: (
                <div>
                    你将离开“{this.getImportName()}”页，未提交的账单信息将会被清空（导入的数据除外），是否继续？
                </div>
            ),
            
            okText: '确定',
            cancelText: '取消',
            onCancel: ()=> {
                return false
            }
           
        });
    }
    dropdownMenu = (taskloading) => {
        const {
            billData
        } = this.state;
        const {
            type 
        } = this.props;
        // 存在记录且不在上传中的时候可以点击清空
        const disabled = (billData.list && billData.list.length>0 && !taskloading)?false:true
        return (
            <Menu>
                
                <Menu.Item key="0" disabled={disabled}>
                    <span onClick={e => { if (taskloading || disabled) { return; }; this.dropdownClearData() }}>清除数据</span>
                </Menu.Item>
               
                <Menu.Item key="2">
                    {type ===5 && <a href={`${STATIC_DOMAIN}/dist/assets/template/SP社保导入模板.xlsx`}  >下载导入模板</a>}
                    {type ===6 && <a href={`${STATIC_DOMAIN}/dist/assets/template/多多账单模板.xlsx`}  >下载导入模板</a>}
                    
                </Menu.Item>
            </Menu>
        )
    }
    dropdownClearData = () => {
        Modal.confirm({
            title: '提示',
            content: (
                <div>
                    是否确认清除该数据？
                </div>
            ),
            onOk: () => {
                const billData ={
                    list:[],
                    total:{}
                }
                this.setState({billData})
            },
            okText: '确定',
            cancelText: '取消',
        });
    }

    render() {
        const {
            type,
            dataSource,
            form
        }= this.props
        
        const {
            id,
            name,
            mobile,
            mail,
            approvalUser,
        } = dataSource.toJS();
        const {
            uploadTask,
            submitLoading,
            billData,
            companyName
        } = this.state;
        const { getFieldDecorator,setFieldsValue } = form;
        const formItemLayout ={

        }
        const pollUrl = `${DOMAIN_OXT}/api/sp/import`;//进度
        

        /**
         * 后台sp和多多账单导入方式不一样 
         * 多多一个接口  多多三个
         */
        const uploadProps = ()=>{
            if(type === 5 ){
                return {
                    name: 'file',
                    action: pollUrl,
                    data:{companyName},
                    headers: {
                        authorization: 'authorization-text',
                        
                    },
                    className: "del-list",
                    beforeUpload: (file) => {
                        file.status = 'uploading';
                        this.setState({ uploadTask: true });
                        if(billData.list && billData.list.length>0){
                            notification.error({
                                type: 'error',
                                message: '提醒',
                                description: '请先清空已导入的数据',
        
                            });
                            this.setState({ uploadTask: false })
                            return false
                        }
                        if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                            return true;
                        } else {
                            this.setState({ uploadTask: false })
                            notification.error({
                                type: 'error',
                                message: '提醒',
                                description: '导入格式错误,请上传.xls或.xlsx文件',
        
                            });
                            return false
                        }
        
                    },
                    onChange:({file,fileList}) =>{
                        if (file.status !== 'uploading') {
                            const data = file.response;
                            if(data && data.status === 0){
                                
                                setFieldsValue({socialBill:file.name})
                                const excelDataKey = data.data.excelDataKey || '';
                                
                                const billData ={
                                    list:data.data.jsOrderSocialDetailSp||[],
                                    total:data.data.total|| {},
                                    isError:data.data.isError
                                }
                                if(!excelDataKey || data.data.isError){
                                    this.setState({allowSubmit:false})
                                }else{
                                    this.setState({allowSubmit:true})
                                }
                                this.setState({ billData,excelDataKey});
                            }else{
                                notification.error({
                                    type: 'error',
                                    message: '提醒',
                                    description:  '模板格式或者模板内容错误！',
                                    duration: null
                                    
                                });
                            }
                            console.log(file, fileList);
                            this.setState({ uploadTask: false});
                        }
                    }
                    
                }
            }
            if(type === 6 ){
                return {
                    name: 'file',
                    action: `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`,
                    data:{companyName},
                    headers: {
                        authorization: 'authorization-text',
                        
                    },
                    className: "del-list",
                    beforeUpload: (file) => {
                        file.status = 'uploading';
                        this.setState({ uploadTask: true });
                        if(billData.list && billData.list.length>0){
                            notification.error({
                                type: 'error',
                                message: '提醒',
                                description: '请先清空已导入的数据',
        
                            });
                            this.setState({ uploadTask: false })
                            return false
                        }
                        if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                            return true;
                        } else {
                            this.setState({ uploadTask: false })
                            notification.error({
                                type: 'error',
                                message: '提醒',
                                description: '导入格式错误,请上传.xls或.xlsx文件',
        
                            });
                            return false
                        }
        
                    },
                    onChange:(info) =>{
                        if (info.file.status !== 'uploading') {
        
                            const parmas = {
                                ossKey: info.file.response.data.ossKey,
                                cname: companyName,
                            }
                            return new Promise((resolve, reject) => {
                                fetchFn(`${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/import/excel`, parmas, undefined).then(data => data).then((data: any) => {
                                    if (data.status == 0 && data.errcode == 0 && data.data) {
                                        const taskId = data.data;
                                        fetchFn(`${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/import/cache`, {taskId}, undefined).then(data => data).then((data: any) => {
                                            if (data.status == 0 && data.errcode == 0) {
                                                this.setState({allowSubmit:false})
                                                setFieldsValue({socialBill:info.file.name})
                                                const excelDataKey = data.data.taskId || '';
                                        
                                                const billData ={
                                                    list:data.data.list||[],
                                                    total:data.data.jdWagesBillDto|| {},
                                                    isError:!data.data.pass
                                                }
                                                if(!excelDataKey || billData.isError){
                                                    this.setState({allowSubmit:false,errorInfo:billData.total.errorInfo})
                                                }else{
                                                    this.setState({allowSubmit:true})
                                                }
                                                this.setState({ billData,excelDataKey});
                                            }
                                            this.setState({ uploadTask: false});
                                        })
        
        
        
                                        
                                    } else {
                                        this.setState({allowSubmit:true,uploadTask: false})
                                    }
        
                                });
                            })
        
        
                        }
                    }
                    
                };
            }
        }
        
        // https://devbg.joyomm.com/adminweb/newadmin/company/adviser/importbillduoduo?id=1102398&cname=%E6%88%91%E6%98%AF%E8%87%B3%E5%B0%8A%E5%91%80
        
        function disabledDate(current) {
            // Can not select days before today and today
            return current && current < moment().subtract(1, 'days').endOf('day');
          }
        const approvalList = () => {
            const children: Array<JSX.Element> = [];
            
            if(approvalUser && approvalUser.length > 0)
            approvalUser.map(function (user) {
                
                children.push(<Option value={user.id}>{user.name}</Option>)
                
            })
           
            return children;
        }
        return (<div key="importBillSp">
            <div className="ant-advanced-search-form">
            <Form onSubmit={this.handleSubmit}>
                <Row gutter={24}>
                    {getFieldDecorator('cId', {initialValue:id})}
                    {getFieldDecorator('id', {initialValue:id})}
                    <Col span={24}>
                        <FormItem
                        
                        label="公司名称"
                        >
                        {companyName}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                        
                        label="姓名"
                        >
                        {getFieldDecorator('name', {
                            initialValue:name,
                            rules: [{
                            max: 20, message: '最多允许20个字',
                            }, {
                            required: true, message: '请填写姓名',
                            }],
                        })(
                            <Input placeholder="公司联系人姓名" disabled={name?true:false}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                    
                        label="手机号"
                        >
                        {getFieldDecorator('mobile', {
                            initialValue:mobile,
                            rules: [ {
                            required: true,
                            validator: this.validateTaxPhone
                            }],
                        })(
                            <Input placeholder="公司联系人手机号" disabled={mobile?true:false}/>
                        )}
                        </FormItem>
                    </Col>
                    <Col span={6}>
                        <FormItem
                    
                            label="邮箱"
                            >
                            {getFieldDecorator('mail', {
                                initialValue:mail,
                                rules: [{
                                
                                type: 'email', message: '邮箱格式错误',
                                },{
                                    max: 50, message: '邮箱格式错误',
                                }, {
                                required: true, message: '请填写邮箱',
                                }],
                            })(
                                <Input placeholder="公司联系人邮箱" disabled={mail?true:false}/>
                            )}
                        </FormItem>
                    </Col>
                </Row>
                
                
                <Row>
                    <Col span={24} >
                        {
                            type === 5 && <FormItem label="付款截止时间">
                            {getFieldDecorator('paymentDeadLine', {
                                rules: [{
                                required: true, message: '请选择付款截止时间',
                                }],
                            })(
                                <div>
                                    <DatePicker disabledDate={disabledDate} format="YYYY-MM-DD" onChange={(date, dateString)=>{
                                        setFieldsValue({paymentDeadLine:dateString})
                                    }}/>
                                    <Alert message="请谨慎填写，系统将根据该时间对客户发送打款提醒，提醒规则和天吴订单提醒规则一致。" className="endtime-tip" type="warning" />
                                </div>
                                
                                
                            )}
                            
                        </FormItem>
                        }
                        {
                            type ===6 && <FormItem label="工资发放月">
                            {getFieldDecorator('distributionMonth', {
                                rules: [{
                                required: true, message: '请选择工资发放月',
                                }],
                            })(
                                <div>
                                    <MonthPicker format="YYYY-MM" onChange={(date, dateString)=>{
                                        setFieldsValue({distributionMonth:dateString})
                                    }}/>
                                   
                                </div>
                                
                                
                            )}
                            
                        </FormItem>
                        }
                        
                    </Col>
                    {
                        type ===6 && <Col span={24} >
                            <FormItem label="提交给审批人">
                            {getFieldDecorator('approvalPerson', {
                                rules: [{
                                required: true, message: '请选择审批人',
                                }],
                            })(
                                <div>
                                    <Select
                                        style={{width:250}}
                                        placeholder="请选择审批人"
                                        onChange={(value)=>{setFieldsValue({approvalPerson:value})}}
                                        >
                                    {approvalList()}
                                    </Select>
                                   
                                   
                                   
                                </div>
                                
                                
                            )}
                            </FormItem>
                        </Col>
                    }
                </Row>
                <Row>
                    <Col span={24} >
                        <FormItem>
                        {getFieldDecorator('socialBill', {
                            valuePropName: 'fileList',
                            getValueFromEvent: this.normFile,
                            rules: [
                                {
                                required: true,message: "请导入"+this.getImportName(),
                                validator: this.validateSocialBill
                                }],
                            })(
                                <span>
                                    <Upload  {...uploadProps() } disabled={uploadTask}>
                                        <Button type="primary" icon="cloud-upload" loading={uploadTask}>
                                            {uploadTask ? '导入中...'+this.getImportName() : '导入'+this.getImportName()}
                                        </Button>
                                    </Upload>
                                    <Dropdown overlay={this.dropdownMenu(uploadTask)} trigger={['click']} >
                                        <a className="ant-dropdown-link dropdown-menu" href="#" style={{ marginLeft: 8}}>
                                            更多操作 <Icon type="down" />
                                        </a>
                                    </Dropdown>
                                </span>
                                
                            )
                            
                        }
                        </FormItem>
                    </Col>
                </Row>
                
                
                
                
                
            </Form>
            {
                billData && billData.list.length>0 && <Card title={this.getImportName()}>
                        <SocialBill type={type} dataSource={billData}></SocialBill>
                    </Card>
                }
            </div>

            
            
            {
                (billData.list && billData.list.length>0) && <div className="bill-footer">
                <Button type="primary" disabled={submitLoading} loading={submitLoading} onClick={this.handleSubmit}>确定提交</Button>
                <Button disabled={submitLoading} onClick={()=>{this.dropdownClearData();}} >取消</Button>
               
            </div>
            }
            

            
        </div>)
    }
}
const mapStateToProps = (state:any, ownProps: TOwnProps): TStateProps => {

    const data = state.get('importBillSpReducer');
    return {
        // location:
        dataSource: data.get('dataSource'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}
const ImportBillSp = Form.create()(ImportBillSpForm);
export default connect(mapStateToProps, mapDispatchToProps)(ImportBillSp);