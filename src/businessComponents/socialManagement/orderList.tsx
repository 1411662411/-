/**
 * Created by yangws on 2018/6/4.
 */
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as moment from 'moment';
import * as actions from '../../action/businessComponents/orderListAction';
import { statePaginationConfig } from '../../util/pagination';
import { fetchFn } from '../../util/fetch';
import { ROUTER_PATH, WSS, DOMAIN_OXT, PHP_DOMAIN,PAGINATION_PARAMS} from '../../global/global';
import query from '../../util/query';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Form,
    message,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Badge,
    Collapse,
    Icon,
    Tooltip,
    Timeline
} from 'antd';
const Option = Select.Option;
const FormItem = Form.Item;
const Panel = Collapse.Panel;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
const confirm = Modal.confirm;
const actionCreators = {
    orderListSaga: actions.orderListSaga,
    orderRepealSaga: actions.orderRepealSaga,
    orderDismissreasonSaga: actions.orderDismissreasonSaga,
    
    
}
import {formatMoney} from '../../util/util';
import {
    WrappedFormUtils,
    FormComponentProps,
} from 'antd/lib/form/Form';
import { is } from 'immutable';
interface TOwnProps  {
    role: 1|2; //角色 1社保顾问 2薪酬管理
}
interface TStateProps {
    dataSource: any[];
    searchParams: any;
    total: number;
    userInfo:  any;
    dismissReason: any;
    fetching: boolean;
}


type TDispatchProps = typeof actionCreators;

interface orderListProps extends TOwnProps, TDispatchProps, TStateProps, FormComponentProps {
    
}
interface columns {
    (data?): [any];
}
class OrderListForm extends React.Component<orderListProps, any> {
    role: any;
    sessionStorageSearchParams: any;
    searchParams: any;
    constructor(props: orderListProps) {
        super(props);
        this.role = props.role
        this.sessionStorageSearchParams = null//JSON.parse(sessionStorage.getItem('INVOICES_LIST_SESSIONSTORAGE')!);
        this.state = {
            searchParams: {
                orderType: props.role === 2 ? 6 : '', // 订单类型
                createTime: '',     // 创建时间
                companyName: '', // 公司名称
                confirmStatus: '', // 认款状态
                deadlineStatus: props.role === 2 ? '':1, // 截至状态
                orderStatus: '', // 订单状态
                ...PAGINATION_PARAMS,
                ...this.sessionStorageSearchParams,

            },
            uploadTask: false,
            submitLoading: false,
            allowSubmit: false,
            checkInvoiceIng: false,
            expressData: undefined,
            cid:'',
            invoiceId:'',
            expressShow: false,
        }
    }
    componentWillMount() {
        
        this.props.orderListSaga({
            ...this.setSearchParamState({}),
            
        });
    }
    columns: columns = (role) => [
        {
            title: '序号',
            key: 'id',
            width: 50,
            fixed:'left',
            render: (text, record, index) => index + 1,
        },
        {
            title: '订单号 | 创建时间',
            dataIndex: null,
            width:200,
            key: 'orderCode',
            fixed:'left',
            render: (data, record, index) => {
                const orderType = data.orderType;
                return <div>
                    
                    {this.renderOrderdetail(data)}
                    <div>{data.createTime}</div>
                </div>
            },
        },
        {
            title: '订单类型',
            dataIndex: 'orderTypeName',
            width:150,
            key: 'orderTypeName',
        },
        {
            title: '订单金额',
            dataIndex: 'orderMoney',
            width:150,
            key: 'orderMoney',
            render: (data, record,index) => {
                return formatMoney(data, 2, '')
            }
        },
        {
            title: `${this.props.role === 2?'人次':'缴纳人数'}`,
            dataIndex: 'paymentCount',
            width:100,
            key: 'paymentCount',
        },
        {
            title: '认款截止时间倒计时',
            dataIndex: null,
            width:150,
            key: 'lastDayNum',
            render: (data, record, index) => {
                let lastDayNum = data.lastDayNum;
                if(data.orderType == 3) {
                    lastDayNum = '/'
                }
                return !!lastDayNum ? <span className="text-danger">{lastDayNum}</span> : '/';
            }
        },
        {
            title: '公司名称',
            dataIndex: 'companyName',
            width:250,
            key: 'companyName',
        },
        {
            title: '公司联系人',
            key: 'customLinkman',
            children: [{
                title: '姓名',
                dataIndex: 'customLinkmanName',
                width:150,
                key: 'customLinkmanName',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }, {
                title: '电话',
                dataIndex: 'customLinkmanPhone',
                width:150,
                key: 'customLinkmanPhone',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }, {
                title: '邮箱',
                dataIndex: 'customLinkmanEmail',
                width:150,
                key: 'customLinkmanEmail',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }],
        },
        {
            title: '对应销售',
            key: 'sale',
            children: [{
                title: '城市',
                dataIndex: 'saleSity',
                width:100,
                key: 'saleSity',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }, {
                title: '姓名',
                dataIndex: 'saleName',
                width:100,
                key: 'saleName',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }, {
                title: '电话',
                dataIndex: 'salePhone',
                width:100,
                key: 'salePhone',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }]
        },
        {
            title: '支付方式',
            dataIndex: 'payMethodName',
            width:100,
            key: 'payMethodName',
        },
        {
            title: '订单状态',
            dataIndex: null,
            width:100,
            key: 'orderStausName',
            render:(data,record)=> {
                const {
                    orderCode,
                    orderStausName,
                    orderStaus,
                    id
                } = data;
                // 显示驳回原因
                if(orderStaus == 150){
                //     return  <Popconfirm placement="topRight" title={text} onConfirm1111={confirm} okText="Yes" cancelText="No">
                //     <Button>TR</Button>
                //   </Popconfirm>
                return <Tooltip placement="topRight" title={this.handleDismissReason(orderCode)}>
                    {orderStausName}<Icon type="question-circle-o" style={{marginLeft:10}}/>
                  </Tooltip>
                }else{
                    return orderStausName
                }
            }
        },
        {
            title: '认款',
            key: 'claim',
            children: [{
                title: '社保顾问是否已认领',
                dataIndex: 'claimStatusName',
                width:160,
                key: 'claimStatusName',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }, {
                title: '财务是否通过',
                dataIndex: 'auditStatusName',
                width:150,
                key: 'auditStatusName',
                render: (data, record, ) => {
                    return data ? data : '/';
                }
            }]
        },
        {
            title: '请款状态',
            dataIndex: 'operation',
            width:150,
            key: 'operation',
            render: (data, record, index) => {
                return data ? data : '/';

            },
        },
        {
            title: '操作',
            dataIndex: null,
            width:150,
            fixed:'right',
            key: 'operation',
            render: (data, record, index) => {
                const {
                    orderCode,
                    orderType,
                    auditStatus,
                    claimStatus,
                    companyName,
                    orderMoney,
                    showInvoiceProgress, // 发票开具进度 1 显示 0 不显示
                    showUpdateInvoice, // 修正发票信息 1 显示 0 不显示
                    showLastClaim, // 到款认领 1 显示 0 不显示
                    showConfirmAmount, // 查看认款信息 1 显示 0 不显示
                    showUpdateAmount, // 修正认款信息 1 显示 0 不显示
                    showCancelOrder, // 撤销订单 1 显示 0 不显示
                    showConfirmDuoDuo, // 查看并确认 1 显示 0 不显示

                    invoiceId,
                    id,
                    cid,
                } = data;
                
                const isAllowRepeal = (claimStatus ===2)?false:true;
           

                return (<div>
                    
                    {showInvoiceProgress ===1 && <p><a onClick={() => { this.handleCheckInvoice(invoiceId,cid,invoiceId)}}>发票开具与快递</a></p>}
                    {showUpdateInvoice ===1 && <p>{this.renderBrowser(`${DOMAIN_OXT}/newadmin/sale/cash/invoice/edit?cId=${cid}&codeId=${invoiceId}`,'修正发票信息')}</p>}
                    {showLastClaim ===1 && <p>{this.renderBrowser(`${DOMAIN_OXT}/newadmin/sale/cash/claim?isEdit=0&invoiceTitle=${companyName}&cId=${cid}&orderCode=${orderCode}&orderMoney=${orderMoney}`,'到款认领')}</p>}
                    {showConfirmAmount ===1 && <p>{this.renderBrowser(`${DOMAIN_OXT}/newadmin/financial/fund/info?order_code=${orderCode}&order_id=${id}&order_type=${orderType}&c_id=${cid}`,'查看认款信息')}</p>}
                    {showConfirmDuoDuo ===1 && <p>{this.renderBrowser(`${DOMAIN_OXT}/newadmin/social/salarymanagement/orderaudit/?id=${orderCode}`,'查看并确认')}</p>}
                    {showUpdateAmount ===1 && <p>{this.renderBrowser(`${DOMAIN_OXT}/newadmin/sale/cash/claim?isEdit=1&invoiceTitle=${companyName}&cId=${cid}&orderCode=${orderCode}&orderMoney=${orderMoney}`,'修正认款信息')}</p>}
                    {showCancelOrder===1 && <p><a onClick={() => { this.handleOrderRepeal(id,isAllowRepeal,cid)}}>撤销订单</a></p>}
                </div>)

            },
        },
    ]
    renderOrderdetail = (data) => {
        const {
            orderType,
            id,
            orderCode
        } = data;
        switch (orderType*1) {
            case 3:
                return this.renderBrowser(`${DOMAIN_OXT}/shangbao/orderDetail?orderId=${id}`,orderCode);
            case 5:
                return this.renderBrowser(`${DOMAIN_OXT}/newadmin/social/customer/socialorderdetail?id=${id}`,orderCode);
            case 6:
                return this.renderBrowser(`${DOMAIN_OXT}/newadmin/social/customer/socialorderdetail?id=${id}`,orderCode);
            default:
                return this.renderBrowser(`${PHP_DOMAIN}/social/order/socialorderdetail/?id=${id}`,orderCode);
        }
    }
    renderBrowser = (url,text) => {
        const {
            role
        } = this.props;
        if(role === 1) {
            
            return <a target="_blank" href={url}>{text}</a>
        }
        if(role === 2) {
            return <a onClick={() => { browserHistory.push(`${url}`);}}>{text}</a>
        }
    }
    handleDismissReason = (orderCode) => {
        // if()
        const {
            dismissReason
        } = this.props;
        const data = dismissReason.find(function(value, index, arr) {
            return value.orderCode === orderCode;
        })
        if(data){
            const link = `${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${data.ossKey}&type=EXCEL`;
            return <div>
                {data.rejectReason}<br/>
                {data.ossKey && <a href={link} target="_blank"><Icon type="cloud-download-o" />下载调整后的账单</a>}
            </div>
        }else {
            return '无'
        }
        
    }
    handleCheckInvoice = (id,cid,invoiceId) => {
        if(id){
            this.setState({ checkInvoiceIng: true,cid,invoiceId});
            fetchFn(`${DOMAIN_OXT}/apiv2_/finance/order/invoiceExpress/list`, {invoiceId}).then(data => data).then((data: any) => {
                if (data.status == 0 && data.errcode == 0) {
                    this.setState({ expressData: data.data});
                }else {
                    this.setState({ expressData: []});
                }
                // this.renderExpress()
        
        
                this.setState({ checkInvoiceIng: false,expressShow:true});
            })
        }
    }
    renderExpress = () => {
        const expressList: Array<JSX.Element> = [];
        const that = this;
        const {
            cid,
            invoiceId,
            expressData
        } = this.state;
        expressData.map(function (d,index) {
            expressList.push(
            <Timeline.Item className={index===0?'active':''} >
                <span>{d.createTime}</span> 
                {d.status==2?<div>发票申领未通过，需<a onClick={()=>{that.handleAnewInvoice(index,cid,invoiceId)}}><b>重新确认并提交开票信息</b></a></div>:d.invoiceStatusInfo}</Timeline.Item>)
        })
        

        return expressList;
    }
    handleAnewInvoice = (index,cid,invoiceId) => {
        // 最新的一条记录
        if(index === 0){
            
            browserHistory.push(`${DOMAIN_OXT}/newadmin/sale/cash/invoice/edit?cId=${cid}&codeId=${invoiceId}`);
        }else{
            return false;
        }
        
    }
    handleOrderRepeal = (id,isAllowRepeal,cId) => {
        const {
            userInfo,
            orderRepealSaga,
            orderListSaga
        } = this.props;
        const that = this;
        if(isAllowRepeal) {
            
            confirm({
                title: '订单撤销后，该订单的对应认款，系统将解除捆绑关联，请再次确认！',
                okText: '确定撤销',
                onOk:()=> {
                    const params = {
                        orderId: id,
                        cId,
                        userName: userInfo.userName,
                        callback: function(){
                            orderListSaga({
                                ...that.setSearchParamState({}),
                                
                            });
                        }
                    }
                    orderRepealSaga(params);
                    return false;
                }
                
              });
        }else{
            Modal.info({
                title: '本订单财务人员已完成认款确认，如需撤销请紧急联系财务人员或产品运营',
                onOk() {},
            });
        }
    }
    handleGoOrderdetail = (id,orderType) => {

        switch (orderType*1) {
            case 3:
                browserHistory.push(`${DOMAIN_OXT}/shangbao/orderDetail?orderId=${id}`);
                break;
            case 5:
                browserHistory.push(`${DOMAIN_OXT}/newadmin/social/customer/socialorderdetail?id=${id}`);
                break;
            case 6:
                browserHistory.push(`${DOMAIN_OXT}/newadmin/social/customer/socialorderdetail?id=${id}`);
                break;
            default:
                browserHistory.push(`${PHP_DOMAIN}/social/customer/socialorderdetail/?id=${id}`);
                break;
        }
       
    }
    handleGoInvoicePage = () => {
        browserHistory.push(`${DOMAIN_OXT}/newadmin/sale/cash/invoice/detail?codeId=${this.state.invoiceId}`);
    }
    handleExpressHide = () => {
        this.setState({expressShow:false})
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.state.searchParams;
        const {
            total,
        } = this.props;
        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
            (newParams) => this.props.orderListSaga({ ...this.setSearchParamState({}), ...newParams, }),
            null,
            (currentPage, pageSize) => {
                this.setSearchParamState({
                    currentPage,
                    pageSize
                })
            },
        )
    }
    // 更新搜索条件state
    setSearchParamState = (param) => {
        const { searchParams } = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
            isDuoDuoList: this.props.role ===2?1:''
        }
        this.setState({
            searchParams: newSearchParams
        })
        return newSearchParams;
    }
    handleSearch = (e) => {
        e.preventDefault();
  
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                
                this.props.orderListSaga({

                    ...this.setSearchParamState({
                        ...values,
                        createTime:values['createTime'] && values['createTime'].format('YYYY-MM-DD')
                    }),
                    
                });
            }
        });
        
        
    }
    
    handleReset = () => {
        this.setState({
            searchParams: this.searchParams, 
        }, () => {
            this.props.form.resetFields();
        })
        
    }
    toggle = () => {
        const { expand } = this.state;
        this.setState({ expand: !expand });
    }
    handleCreateTime = (date, dateString) => {
        const { setFieldsValue } = this.props.form;
        setFieldsValue({createTime:dateString})
    }
    render() {
        const { dataSource,
            fetching
        } = this.props;
        const {
            expanded,
            searchParams,
            expressShow,
            invoiceId
        } = this.state;
        
       

        const {
            orderType,
            createTime,
            companyName,
            confirmStatus,
            deadlineStatus,
            orderStatus,
        } = searchParams;
        const role = this.role;
        const { getFieldDecorator } = this.props.form;
        const columns = this.columns(role);
        let scrollX = 2600;
        switch (role) {
            case 1: {
                columns.splice(3, 1); // 订单类型
                scrollX = scrollX - 150;
                break;
            }
            case 2: {
                columns.splice(2, 1); // 订单类型
                columns.splice(4, 1); // 认款截止时间倒计时	
                scrollX = scrollX - 300;
                break;
            }
        }
        return (
            <QueueAnim>
                <div key="orderList" className="wrapper-content">
                    <Form className="ant-advanced-search-form"  onSubmit={this.handleSearch} style={{border:'none',marginBottom:0}}>
                        <Row gutter={24}>
                            <Col span={4}>
                                <FormItem label="创建时间" style={{marginBottom:0}}>
                                    {getFieldDecorator('createTime', { initialValue: createTime })(
                                        <DatePicker format="YYYY-MM-DD"/>
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={6}>
                                <FormItem label="公司名称" style={{marginBottom:0}}>
                                    {getFieldDecorator('companyName', { initialValue: companyName
                                    })(
                                    <Input placeholder="" />
                                    )}
                                </FormItem>
                            </Col>
                            <Col span={4}>
                                <FormItem label="订单状态" style={{marginBottom:0}}>
                                    {getFieldDecorator('orderStatus', { initialValue: orderStatus
                                    })(
                                        <Select placeholder="">
                                            <Option value="">全部</Option>
                                            <Option value="20">待确认</Option>
                                            <Option value={30}>等待付款</Option>
                                            <Option value={80}>付款完成</Option>
                                            <Option value={90}>已取消</Option>
                                            <Option value={110}>款项确认中</Option>
                                            <Option value={120}>已失效</Option>
                                            <Option value={130}>待退费</Option>
                                            <Option value={140}>已退费</Option>
                                            <Option value={150}>被驳回</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>
                            { role ===1 && <Col span={4}>
                                <FormItem label="认款状态" style={{marginBottom:0}}>
                                    {getFieldDecorator('confirmStatus', { initialValue: confirmStatus
                                    })(
                                        <Select placeholder="">
                                            <Option value="">全部</Option>
                                            <Option value={0}>未认领</Option>
                                            <Option value={1}>已认领, 未处理</Option>
                                            <Option value={2}>已认领, 已通过</Option>
                                            <Option value={3}>已认领, 未通过</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>}
                            
                            { role ===1 && <Col span={4}>
                                <FormItem label="截至时间" style={{marginBottom:0}}>
                                    {getFieldDecorator('deadlineStatus', { initialValue: deadlineStatus })(
                                        <Select placeholder="">
                                            <Option value="">全部</Option>
                                            <Option value={1}>未过</Option>
                                            <Option value={2}>已过</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>}
                            { role ===1 && <Col span={4}>
                                <FormItem label="订单类型" style={{marginBottom:0}}>
                                    {getFieldDecorator('orderType', { initialValue: orderType })(
                                        <Select placeholder="">
                                            <Option value="">全部</Option>
                                            <Option value={1}>会员套餐订单</Option>
                                            <Option value={2}>社保订单</Option>
                                            <Option value={3}>商保订单</Option>
                                            <Option value={4}>社保补差订单</Option>
                                            <Option value={5}>SP社保订单</Option>
                                            <Option value={6}>代发工资订单</Option>
                                        </Select>
                                    )}
                                </FormItem>
                            </Col>}
                            <Col span={6}>
                                <Button type="primary" htmlType="submit">搜索</Button>
                                { role ===1 && <Button style={{ marginLeft: 8 }} onClick={this.handleReset}>重置</Button>}
                               
                            </Col>
                        </Row>
                        
                    </Form>
                    <div className="search-result-list">
                        <QueueAnim type="bottom" delay="300">
                            <Table columns={columns}
                                bordered
                                rowKey={(record: any) => record.id}
                                dataSource={dataSource}
                                loading={fetching}
                                scroll={{ y: window.innerHeight*0.6,x: scrollX }}
                                pagination={this.pagination()}
                            />
                        </QueueAnim>
                        <Modal
                            title="发票开具与快递"
                            visible={expressShow}
                            // onOk={this.handleGoInvoicePage}
                            onCancel={this.handleExpressHide}
                            // okText="发票明细"
                            // cancelText="取消"
                            footer={
                                <React.Fragment>
                                    <Button onClick={this.handleExpressHide}>取消</Button>
                                    {role ===1 && <a href={`${DOMAIN_OXT}/newadmin/sale/cash/invoice/detail?codeId=${invoiceId}`} style={{marginRight:10}} className="ant-btn ant-btn-primary" target="_blank">发票明细</a>}
                                    {role ===2 && <Button type='primary' onClick={this.handleGoInvoicePage} >发票明细</Button>}
                                    
                                </React.Fragment>
                            }>
                            >
                            {expressShow && this.renderExpress()}
                        </Modal>
                    </div>

                        

                    

                </div>

            </QueueAnim>
        )
    }

}
const mapStateToProps = (state:any, ownProps: TOwnProps): TStateProps => {

    const data = state.get('orderListReducer');
    return {
        dataSource: data.get('dataSource').toJS(),
        searchParams: data.get('searchParams').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        dismissReason: data.get('dismissReason').toJS(),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const mapDispatchToProps = (dispatch): TDispatchProps => {
    return bindActionCreators(actionCreators, dispatch);
}
const OrderList = Form.create()(OrderListForm);
export default connect(mapStateToProps, mapDispatchToProps)(OrderList);
