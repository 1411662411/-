/**
 * Created by yangws on 2018/4/03.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../action/socialManagement/socialOrderSubmitAction';
import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT,PHP_DOMAIN } from '../../global/global';
import Invoice from '../../businessComponents/common/invoice';
import { SocialBill } from '../../components/common/socialBill';
import {formatMoney} from '../../util/util';
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
    Radio,
    Tabs,
    Collapse,
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const actionCreators = {
    socialOrderBillSaga: actions.socialOrderBillSaga,
    socialOrderSubmitSaga: actions.socialOrderSubmitSaga,

}
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import '../../css/socialManagement/socialOrderSubmit.less';
interface TStateProps {

}
interface bill {
    list:any[];
    total:{any};
}
interface TOwnProps {
    socialBillData: any;
    dataSource: any;
    userInfo: any;
    location: any;
}

type TDispatchProps = typeof actionCreators;

type socialOrderSubmitProps = TOwnProps & TStateProps & TDispatchProps;

class SocialOrderSubmit extends Component<socialOrderSubmitProps,any> {
    sessionStorageData:any;
    constructor(props: socialOrderSubmitProps) {

        super(props);
        
        this.state = {
            cId: undefined,
            companyName: '',
            type: 1,
            // orderCode: 'XXX856454545454555455',totalAmount
            orderAmount: 0.00,
            submitLoading: false,
            allowIvoice: true, //是否允许开票
            choiceIvoice: 2, //是否选择开发票 0 不开 1开 2 未选择
        }
    }
    componentWillMount() {
        this.sessionStorageData = JSON.parse(sessionStorage.getItem('IMPORT_BILL_SUMIT_PARAMS')!);
        if(this.sessionStorageData){
            const {
                cId,
                companyName,
                status,
                type,
                detailIds
            } = this.sessionStorageData;
            
            if(cId && companyName && type && status == "done") {
                this.setState({
                    cId,
                    companyName,
                    type
                })
                if(type ===5 || type ===6 ){
                    // 后台接口不统一 5要id和cid 6只要taskId 因此都传
                    this.props.socialOrderBillSaga({
                        cId,
                        type,
                        taskId:detailIds,
                        ids:detailIds.toString()
                    })
                }
                
            }else{
                
                this.handleErrorPage()
            }
        }else{
            this.handleErrorPage()
        }
        
    }
    handleErrorPage = () => {
        Modal.confirm({
            title: '参数有误请重新账单',
            content: '',
            okText: '现在就去',
            cancelText: '取消',
            onOk:()=>{
                this.handleImportSpOrder();
            }
        });
    }
    
    getResult = (e) => {
        return this.Invoice.getWrappedInstance().getResult(e)
    }
    
    Invoice: any;
    // 上传图片对象转换
    convertImgData = (data)=> {
        const imgData:any[] = [];
        
        if(data && data.length>0){
            data.map(function (obj){
                obj.url && imgData.push(obj.url)
            })
        }else {
            return data;
        }
        return JSON.stringify(imgData);
    }
    handleImportSpOrder = () => {
        window.location.href = `${PHP_DOMAIN}/social/company/adviser/overviewpage?tabindex=2`
        // browserHistory.push(``);
    }
    /**
     * 点击提交
     */
    handleSubmit = (e) => {
        const {
            cId,
            allowIvoice,
            choiceIvoice,
            orderAmount,
            type
        } = this.state;
        let commitParams: any = {};
        if (allowIvoice && choiceIvoice === 2) {
            message.error('请选择是否开发票');
            return false;
        }

        // 选择开发票
        if (allowIvoice && choiceIvoice === 1) {
            var resultIvoice = this.getResult(e);
            // 发票信息校验
            if (!resultIvoice) {
                message.error('请先完善发票信息');
                return false;
            }
            
            const expressInfo = resultIvoice.expressInfo;
            
            if(expressInfo) {
                commitParams.postAddressId = expressInfo.id;
                commitParams.postCity = expressInfo.addressId[1];
                commitParams.postProvince = expressInfo.addressId[0];
                commitParams.postDistrict = expressInfo.addressId[2];
                commitParams.postCityName = expressInfo.addressName[1];
                commitParams.postProvinceName = expressInfo.addressName[0];
                commitParams.postDistrictName = expressInfo.addressName[2];
                commitParams.postLocation = expressInfo.addressName.toString();
                commitParams.postAddress = expressInfo.addressDetail;
                commitParams.postTel = expressInfo.phone;
                commitParams.postContacts = expressInfo.name;
                if(!(commitParams.postProvince*1) ||!(commitParams.postCity*1)||!(commitParams.postDistrict*1)){
                    message.error('您的发票收票人地址不完善。请编辑发票收票人信息，并填写收票人地址的省市区，谢谢！');
                    return false;
                }
                delete resultIvoice.expressInfo;
            }else {
                commitParams.postContacts = resultIvoice.ePersonName;
                commitParams.postTel = resultIvoice.ePhone;
                commitParams.postEmail = resultIvoice.eMail;
            }
            commitParams.taxRegistryNumber = resultIvoice.taxCode;
            commitParams.bankAccountNumber = resultIvoice.bankAccount;
            commitParams.openingBank = resultIvoice.openBank;
            commitParams.competentAuthority = resultIvoice.taxAddress;
            commitParams.taxInvoicePhone = resultIvoice.taxPhone;
            commitParams.invoiceType = resultIvoice.invoiceType;
            commitParams.taxRegistrationCertificateUrl = this.convertImgData(resultIvoice.taxImg);
            commitParams.generalTaxpayerQualificationUrl = this.convertImgData(resultIvoice.taxPersonImg);
            commitParams.bankLicenceUrl = this.convertImgData(resultIvoice.bankImg);
            
            // 添加特殊备注
            commitParams.specificRemark = resultIvoice.specificRemark;

            
            
            
           
        }

        
        const {
            detailIds,
            paymentDeadLine,
            companyName,
            remark,
            distributionMonth,
            approvalPerson,
        } = this.sessionStorageData;
        const {
            userInfo,
            socialBillData
        } = this.props;
        const total = socialBillData.toJS() ? socialBillData.toJS().total :{};
        
        // sp 订单专有参数
        commitParams.orderAmount = total.totalAmount ? total.totalAmount:0;
        
        commitParams.isClaimInvoice = choiceIvoice === 2 ? '' : choiceIvoice;
        
        commitParams.ifNeedInvoice = 1;
        commitParams.createUser = `${userInfo.name}(${userInfo.employeeNumber})`;
        commitParams.createId = userInfo.userId;
        commitParams.cId = cId;
        
        commitParams.orderType = type;
        commitParams.paymentId = 7;
        commitParams.payMethod = 'transferspay';
        
        

        
        commitParams.paymentDeadLine = paymentDeadLine;
       
        commitParams.cName = companyName;
        commitParams.companyName = companyName;
        
        commitParams.createUser = userInfo.userName;
        // 添加备注
        commitParams.richTextRemark = remark;
        
        // sp账单
        if(type === 5) {
            commitParams.detailIds = detailIds.toString();
        }
        // 多多账单
        if(type === 6){
            const list =  socialBillData.toJS() ? socialBillData.toJS().list :[];
            commitParams.taskId = detailIds; // 任务id
            commitParams.payServiceFee = total.serviceFee || 0; // 服务费总计
            commitParams.totalMoney = total.totalCost || 0;    // 费用总计
            commitParams.paymentCount = list.length ;  // 缴纳人次
            commitParams.sendSalaryMonth = distributionMonth;  // 工资发放月
            commitParams.duoDuoAuditorId = approvalPerson;  // 审核员
            
        }
        if (total && total.serviceFee == 0 && total.totalAmount  > 0 && commitParams.invoiceType && commitParams.invoiceType == 2) {
            Modal.info({
                title: '提示',
                content: (
                    <div>
                        亲，由于金柚网的社保服务采用差额征税的开票方式，本次订单应付总额中的服务费部分为 0 ，根据国家相关税务要求，即开票金额不能等于差额征税金额，金柚网将为本次订单开具 纸质_普通发票。
                    </div>
                ),
                okText: '我知道了',
                onOk: () => {
                    
                },
            });
            commitParams.invoiceType = 1;
        }
        

        this.setState({ submitLoading: true })
        this.props.socialOrderSubmitSaga({
            ...commitParams,
            type,
            callback:()=>{
                this.handleImportSpOrder()
            },
            setSubmitLoading:()=> {
                this.setState({submitLoading: false})
            }
        })
        

        // 验证form
    
    }
    handleChoiceIvoice = (e) => {
        this.setState({ 'choiceIvoice': e.target.value });
    }
    render() {
        
        const {
            cId,
            submitLoading,
            companyName,
            orderAmount,
            choiceIvoice,
            type
        } = this.state;
        const {
            socialBillData
        } = this.props
        
        const totalAmount = (socialBillData.toJS()&& socialBillData.toJS().total)?(type ===5 ? socialBillData.toJS().total.totalAmount: socialBillData.toJS().total.totalCost):0;
        return (<div key="socialOrderSubmit">
            <Card
                title={<div className="cashclaim-card-title"><span>客户名称： <b>{companyName}</b></span><span>总金额：<b>{formatMoney(totalAmount, 2, '')}</b> 元</span></div>} >
                
                <div className="cashclaim-title">
                    支付方式
                </div>
                <Radio.Group value={1}style={{ paddingBottom: 15 }} disabled>
                    
                    {/* <Radio.Button value={2} disabled>在线支付</Radio.Button> */}
                    <Radio.Button value={1}>线下支付</Radio.Button>
                    {/* <Radio.Button value={3} disabled>支付宝转账</Radio.Button> */}
                    
                </Radio.Group>
                <div className="cashclaim-title">
                    发票信息<span>（必填）</span>
                </div>
                <Radio.Group value={choiceIvoice} onChange={this.handleChoiceIvoice} style={{ paddingBottom: 15 }}>
                    <Radio.Button value={1}>开发票</Radio.Button>
                    <Radio.Button value={0}>不开发票</Radio.Button>
                </Radio.Group>
                {
                    choiceIvoice === 1 && <div style={{ paddingBottom: 15 }}><Invoice ref={node => this.Invoice = node} type={1} orderType={type} cId={cId}></Invoice></div>
                }
                {/* <div className="cashclaim-title">
                    购买内容
                </div>
                <SocialBill></SocialBill> */}
                
                <Collapse defaultActiveKey={['1']}>
                    <Panel header="购买内容" key="1">
                        {
                            type === 5 && <Alert className="product-classify-alert" message={<div><p>产品名称：社保服务</p><p>产品内容：当月社保缴纳明细</p></div>} type="error" />
                        }
                        {
                            type === 6 && <Alert className="product-classify-alert" message={<div><p>产品名称：代发工资服务</p><p>产品内容：当月代发工资明细</p></div>} type="error" />
                        }
                        
                        <SocialBill type={type} dataSource={socialBillData.toJS()}></SocialBill>
                    </Panel>
                    
                </Collapse>
            
            </Card>
            
            <div className="bill-footer">
                <Button type="primary" disabled={submitLoading} loading={submitLoading} onClick={this.handleSubmit}>确定提交</Button>
                <Button disabled={submitLoading} onClick={()=>{history.back();}} >返回</Button>
            </div>

            
        </div>)
    }
}

const mapStateToProps = (state: any, ownProps: TOwnProps): TStateProps => {
    const data = state.get('socialOrderSubmitReducer');
    return {
        socialBillData: data.get('socialBillData'),
        dataSource: data.get('dataSource'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SocialOrderSubmit);