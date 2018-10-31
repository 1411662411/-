/**
 * Created by yangws on 2018/4/03.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import * as moment from 'moment';
import { bindActionCreators } from 'redux';
import * as actions from '../../action/socialManagement/socialOrderDetailAction';
import { Map, List, fromJS } from 'immutable';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT, PHP_DOMAIN,PAGINATION_PARAMS} from '../../global/global';
import { SocialBill } from '../../components/common/socialBill';
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
    Steps,
    Timeline,
    Icon
} from 'antd';
const FormItem = Form.Item;
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const Panel = Collapse.Panel;
const Step = Steps.Step;
const actionCreators = {
    socialOrderDetailSaga: actions.socialOrderDetailSaga,
    updateOrderRemarkSaga: actions.updateOrderRemarkSaga

}
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import BraftEditor from '../../components/crm/BraftEditor';
import {formatMoney} from '../../util/util';
import '../../css/socialManagement/socialOrderDetail.less';
interface TStateProps {

}
interface TOwnProps {
    dataSource: any;
    userInfo: any;
    location: any;
    fetching: boolean;
}

type TDispatchProps = typeof actionCreators;

type socialOrderDetailProps = TOwnProps & TStateProps & TDispatchProps;

class SocialOrderDetail extends Component<socialOrderDetailProps,any> {
    constructor(props: socialOrderDetailProps) {
        super(props);
        this.state = {
           
        }
    }
    componentWillMount() {
        this.handleOrderDetail();
    }

    handleOrderDetail = () => {
        const orderId = this.props.location.query.id;
        // const orderType = this.props.location.query.type;
        if(orderId){
            this.props.socialOrderDetailSaga({
                id:orderId,
                // orderType
            });
        }else{
            this.setState({submitLoading:true})
        }
    }
    /**
     * 点击返回
     */
    handleHistoryBack = (e) => {
        if(document.referrer.indexOf('newadmin/singlepage/social/adviserOrderList')>0){
            window.location.href = `${PHP_DOMAIN}/social/company/adviser/overviewpage?tabindex=2`
        }else{
            history.back();
        }
        
    
    }
    handleChoiceIvoice = (e) => {
        this.setState({ 'choiceIvoice': e.target.value });
    }
    handleShowInvoiceDetail =(id) => {
        browserHistory.push(`${DOMAIN_OXT}/newadmin/sale/cash/invoice/detail?codeId=${id}`);
    }
    renderExpress = (data) => {
        const expressList: Array<JSX.Element> = [];
        const that = this;
        data.map(function (d,index) {
            expressList.push(<Timeline.Item className={index===0?'active':''}><span>{d.createTime}</span> {d.status==2?<div>发票申领未通过，需<a onClick={()=>{that.handleAnewInvoice(index)}}><b>重新确认并提交开票信息</b></a></div>:d.invoiceStatusInfo}</Timeline.Item>)
        })
        return expressList;
    }
    handleAnewInvoice = (index) => {
        // 最新的一条记录
        if(index === 0){
            const {
                orderData,
                invoiceData,
                expressData,
                socialData
            } = this.props.dataSource.toJS()
            browserHistory.push(`${DOMAIN_OXT}/newadmin/sale/cash/invoice/edit?cId=${orderData.c_id}&codeId=${orderData.invoice_id}`);
        }else{
            return false;
        }
        
    }
    handleRemarkChange = (remark) =>{
        this.setState({remark})
    }
    handleSubmitRemark = (orderId) => {
        const {
            remark
        } = this.state;
        // const orderId = this.props.location.query.id;
        
        this.props.updateOrderRemarkSaga({
            richTextRemark:remark,
            orderId
        });
    }
    detailTabsChange = (key) => {
        // tabs 子类数据是一起返回的 所以没有单独请求
    }
    render() {
        
    
        const {
            orderData,
            invoiceData,
            expressData,
            socialData
        } = this.props.dataSource.toJS()
        const formItemLayout = {
            labelCol: {
              xs: { span: 24 },
              sm: { span: 4 },
            },
            wrapperCol: {
              xs: { span: 24 },
              sm: { span: 20 },
            },
        };
        // 1会员订单 2 社保订单 3商保订单 4社保补差 5SP社保订单 6多多订单
        const stepsCurrent = orderData.order_staus===30?1:(orderData.order_staus===80?2:(orderData.order_staus<80?3:1))
        return (<div key="socialOrderDetail" className="social-order-detail-card">
            <Card
                title={<div className="order-detail-card-title">
                    <span>订单号：{orderData.order_code}</span>
                    <span>类型：{orderData.order_type_name}</span>
                    <span>金额：<b>{formatMoney(orderData.order_money, 2, '')}</b></span>
                    <span>状态：<b>{orderData.order_staus_name}</b> </span>
                    <span>付款截止时间倒计时：<b>{orderData.order_staus===30?orderData.left_days:'-/-'}</b> </span></div>} >
                
                <div className="steps-progress">
                    <Steps current={stepsCurrent}>
                        <Step title="提交订单" description={orderData.create_time} />
                        <Step title="等待付款" description="" />
                        {
                            stepsCurrent ===2?<Step title="付款完成" description={orderData.pay_time?moment(orderData.pay_time*1000).format('YYYY-MM-DD HH:mm:ss'):''} icon={<Icon type="smile-o" />}/>:
                            <Step title="付款完成" description={orderData.pay_time?moment(orderData.pay_time*1000).format('YYYY-MM-DD HH:mm:ss'):''}/>
                        }
                        
                        
                    </Steps>
                </div>
                {(orderData.order_type === 2 || orderData.order_type === 4 || orderData.order_type === 5) &&<Alert style={{marginBottom: 15}} message="亲，社保业务的独特性要求：每个订单必须在付款截止时间之前完成付款，未及时完成付款的订单，系统会对该订单自动处理成失效订单哦！！" banner />}
                {(orderData.order_type === 2 || orderData.order_type === 4 || orderData.order_type === 5) &&<Alert style={{marginBottom: 15}} message={<div>
                    <p>1. 新增人员超过当地截止时间未付款，将有部分新增人员无法按照指定方式顺利参保，<b>并需要重新填写相关数据</b>！</p>
                    <p>2. 续保人员超过当地截止时间未付款，<b>系统将对参保人员自动停保处理</b>！</p>
                    </div>} type="info" showIcon />}
                
                <Card title="订单信息" className="order-info-card">
                    <Row type="flex" justify="center" align="middle">
                        <Col span={4} className="info-title">付款方式</Col>
                        <Col span={18} className="info-warp">
                            <p>支付方式：{orderData.pay_method_name}</p>
                            <p>订单状态：{orderData.order_staus_name}</p>
                            {/* <FormItem label="支付方式" {...formItemLayout}>线下转账</FormItem>
                            <FormItem label="订单状态" {...formItemLayout}>已失效</FormItem> */}
                        </Col>
                    </Row>
                    {orderData.pay_method === 'transferspay' &&
                        <Row type="flex" justify="center" align="middle">
                            <Col span={4} className="info-title">汇款至银行</Col>
                            <Col span={18} className="info-warp">
                                <div className="bank">
                                    <div className="bank-info">
                                        <span>开户银行：浙商银行杭州城西支行</span>
                                        <span>开户账号：3310010310120100199407</span>
                                        <span>单位名称：杭州今元标矩科技有限公司</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    }
                    {orderData.pay_method === 'alitransferspay' &&
                        <Row type="flex" justify="center" align="middle">
                            <Col span={4} className="info-title">汇款至银行</Col>
                            <Col span={18} className="info-warp">
                                <div className="alipay"></div>
                            </Col>
                        </Row>
                    }
                    {
                        invoiceData && invoiceData.invoiceType ?
                        <Row type="flex" justify="center" align="middle">
                            <Col span={4} className="info-title">发票信息</Col>
                            <Col span={16} className="info-warp">
                                <FormItem label="发票寄送方式" {...formItemLayout}>{invoiceData.invoiceType === 3?'电子发票':'普通快递'}</FormItem>
                                <FormItem label="发票抬头" {...formItemLayout}>{invoiceData.invoiceTitle}</FormItem>
                                <FormItem label="收票人姓名" {...formItemLayout}>{invoiceData.postContacts}</FormItem>
                                <FormItem label="收票人手机号" {...formItemLayout}>{invoiceData.postTel}</FormItem>
                                {
                                    invoiceData.invoiceType !==3 &&
                                    <FormItem label="收票人地址" {...formItemLayout}>{invoiceData.postLocation}</FormItem>
                                }
                                {
                                    invoiceData.invoiceType === 3 &&
                                    <FormItem label="收票人E-mail" {...formItemLayout}>{invoiceData.postEmail}</FormItem>
                                }
                                
                            </Col>
                            <Col span={2}>
                                <a href="#" onClick={()=>{this.handleShowInvoiceDetail(invoiceData.id)}}>查看发票详情</a>
                                {
                                    invoiceData.invoiceType === 3 && invoiceData.invoiceUrl && <div><br/><a href={invoiceData.invoiceUrl} target="_blank">下载电子发票</a></div>
                                }
                            </Col>
                        </Row>:<Row type="flex" justify="center" align="middle">
                            <Col span={4} className="info-title">发票信息</Col>
                            <Col span={18} className="info-warp">
                                不需要发票
                            </Col>
                        </Row>

                    }
                    {
                        (expressData && expressData.length > 0) && <Row type="flex" justify="center" align="middle">
                            <Col span={4} className="info-title">发票开具与快递</Col>
                            <Col span={18} className="info-warp">
                                <Timeline>
                                    {this.renderExpress(expressData)}
                                </Timeline>
                            </Col>
                        </Row>
                    }
                    
                    
                </Card>
                <Tabs className="order-content-tabs" onChange={(activeKey)=>{this.detailTabsChange(activeKey)}}>
                    <TabPane tab="购买内容" key="1">
                        {
                            orderData.order_type === 5 && <Alert className="product-classify-alert" message={<div><p>产品名称：社保服务</p><p>产品内容：当月社保缴纳明细</p></div>} type="error" />
                        }
                        {
                            orderData.order_type === 6 && <Alert className="product-classify-alert" message={<div><p>产品名称：代发工资服务</p><p>产品内容：当月代发工资明细</p></div>} type="error" />
                        }
                        { orderData.order_type && <SocialBill type={orderData.order_type} dataSource={socialData}></SocialBill>}
                        
                    </TabPane>
                    <TabPane tab="备注" key="2">
                        <BraftEditor 
                            htmlContent={orderData.remark}
                            handleChange={(content) => {this.handleRemarkChange(content)}}
                            config={
                                {
                                    placeholder:'',
                                    height:200
                                
                                }
                            }
                        ></BraftEditor>
                        <Button loading={this.props.fetching} onClick={()=>{this.handleSubmitRemark(orderData.id)}} style={{marginTop:20}}>提交备注</Button>
                    </TabPane>
                    {/* <TabPane tab="新增人员办理进度" key="2">
                        
                    </TabPane> 
                    <TabPane tab="实缴账单与差额" key="3">

                    </TabPane>
                    <TabPane tab="调基预收结算" key="4">
                            
                    </TabPane>  */}
                </Tabs>

               
            
            </Card>
            
            <div className="social-order-footer">
                <Button type="primary" onClick={this.handleHistoryBack}>返回</Button>
               
            </div>

            
        </div>)
    }
}

const mapStateToProps = (state: any, ownProps: TOwnProps): TStateProps => {
    const data = state.get('socialOrderDetailReducer');
    return {
        dataSource: data.get('dataSource'),
        fetching: data.get('fetching'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(SocialOrderDetail);