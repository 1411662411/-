/**
 * Created by caozheng on 2017/1/4.
 */
import React, { Component } from 'react';
import QueueAnim from "rc-queue-anim/lib";
import moment from 'moment';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
    Button,
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    Switch,
    Tooltip,
    Icon,
    Form,
    Checkbox,
    Collapse,
    Pagination,
    Spin,
    message,
    Modal,
    Alert,
    Badge,
} from 'antd';
import { Link } from 'react-router';
import { paginationConfig } from '../../util/pagination';
import {
    DOMAIN_OXT,
    PAGINATION_PARAMS,
} from '../../global/global';
import '../../css/financialManagement/fundConfirm.less';
import {
    getTableData,
    changeOrderState,
    changeOrderType,
    changeDeadLine,
    setDefaultTimeRange,
    setLoading,
    setCurrentPage,
    setDefaultPageSize,
    setDefaultCompanyName,
    setDefaultOrderCode,
    updateCacheSearchParams,
    updateSearchParams,
    switchChangeGet,
} from './../../action/financialManagement/fundConfirmAction';
import { statePaginationConfig } from '../../util/pagination';
import { fetchFn } from '../../util/fetch';
import CreatePoll, { CreatePollInterface } from '../../util/createPoll';
import { resolve } from 'url';
import { accAdd } from '../../util/math';
import { link } from 'fs';
import Immutable, { Map, List } from 'immutable';


const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const Panel = Collapse.Panel;
const TextArea = Input.TextArea;
const confirm = Modal.confirm;

interface FundConfirmProps {
    dispatch?: any;
    dataSource: List<Map<string, any>>;
    orderState: string;
    orderType: string;
    confirmStatus: string;
    defaultRangePicker: any;
    defaultOrderCode: string;
    recordsTotal: number;
    pageSize: number;
    fetching: boolean;
    current: number;
    defaultCompanyName: string;
    searchParams: any;
    total: number;
    cacheSearchParams: any;
    searchStatus: boolean;
    switchStatus: number;
    badge: List<number>
}

interface FundConfirmState {
    batchComfirmFetching: boolean;
}

const codes: string[] =  JSON.parse(sessionStorage.getItem('codes') || '[]');
/**
 * 是否有撤回认款的权限
 */
const hasRepealAffirm = codes.includes('TIANWU_recall_recognition');


class FundConfirm extends React.Component<FundConfirmProps, any> {

    orderCode: any;
    customerName: any;
    // 记录当前选择的时间
    rangePicker = ['', ''];
    current: number = 1;
    CollapseTable: CollapseTable | null;
    
    constructor(props) {
        super(props);
        this.state = {
            batchComfirmFetching: false,
        }
    }
    componentWillMount() {
        const {
            dispatch,
            searchParams,
         } = this.props;
        dispatch(getTableData(searchParams));
        this.batchComfirmOk();
    }

    handleSearch = (params = {}) => {
        const {
            dispatch,
            cacheSearchParams,
            searchParams,
         } = this.props;
        dispatch(updateSearchParams({ searchStatus: true, ...cacheSearchParams, ...params, }));
        dispatch(getTableData({ ...cacheSearchParams, ...params, }));
    };
    handleUpdateCacheSearchParams = (params) => {
        this.props.dispatch(updateCacheSearchParams({ searchStatus: false, ...params }));
    }
    switchChange = (checked) => {
        this.props.dispatch(switchChangeGet({ claimStatus: checked ? 1 : 0 }));
    }
    showBatchComfirmResult = (data) => {
        Modal.info({
            title: `已处理${data.totalNum}个订单`,
            content: (
                <div>
                    <p>确认成功 <span style={{ color: '#22baa0' }}>{data.successNum}</span>个</p>
                    <p>确认失败<span style={{ color: '#f5222d', margin: '10px 0' }}>{data.failNum}</span>个</p>
                    {
                        data.errorConfirmInfo && data.errorConfirmInfo.length > 0 &&
                        <div>
                            <ol className="batch-comfirm-result">
                                {data.errorConfirmInfo.map(item => <li>{item.orderCode}<p>{item.errorMsg}</p></li>)}
                            </ol>
                        </div>
                    }

                </div>
            ),
            onOk: () => {
                this.handleSearch(PAGINATION_PARAMS);
            },
        });
    }
    batchComfirmOk = async (params?) => {
        const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/finance/finance/order/batch-success`, params).then(data => data);
        if (data.status === 0) {
            this.setState({
                batchComfirmFetching: true,
            });
            startPoll({ uuid: data.data },
                {
                    success: (data) => {
                        this.setState({
                            batchComfirmFetching: false,
                        });
                        if (data.data && data.data.totalNum > 0) {
                            this.showBatchComfirmResult(data.data);
                        }

                    },
                    error: (data) => {
                        this.setState({
                            batchComfirmFetching: false,
                        });
                    }
                }
            )
        }
    }
    batchComfirm = async () => {
        const orderCode = this.CollapseTable && this.CollapseTable.checked;
        if (orderCode && orderCode.length > 0) {
            Modal.confirm({
                title: '是否要进行批量确认到款',
                okText: '确定',
                cancelText: '取消',
                onOk: () => this.batchComfirmOk({ orderCode: orderCode.join(',') })
            });

        }
        else {
            message.error('请选择订单')
        }
    }
    render() {
        const {
            dispatch,
            dataSource,
            fetching,
            searchStatus,
            searchParams,
            cacheSearchParams,
            switchStatus,
            total,
            badge,
        } = this.props;
        const {
            batchComfirmFetching,
        } = this.state;
        const params = searchStatus ? searchParams : cacheSearchParams;
        const {
            orderState,
            orderType,
            confirmStatus,
            startTime,
            endTime,
            orderCode,
            customerName,
            pageSize,
            currentPage,
        } = params;
        const badgeArr: number[] = badge.toJS();
        return (
            <QueueAnim>
                {
                    batchComfirmFetching && <div>
                        <div className="ant-modal-mask"></div>
                        <div data-reactroot="" className="ant-message"><span><div className="ant-message-notice"><div className="ant-message-notice-content"><div className="ant-message-custom-content ant-message-loading"><i className="anticon anticon-spin anticon-loading"></i><span>处理中......</span></div></div></div></span></div>
                    </div>
                }
                <div key="AdvertisingManagement" className="wrapper-content">
                    <div className="form-site">
                        <Row type="flex" justify="start" align="middle">
                            <Col className="col-label"><label>订单类型：</label></Col>
                            <Col >
                                <Radio.Group value={orderType} onChange={(e) => { this.handleUpdateCacheSearchParams({ orderType: e.target.value }) }}>
                                    <Radio.Button value="">全部</Radio.Button>
                                    <Radio.Button value="2">天吴社保订单{badgeArr.indexOf(2) > -1 && <Badge dot={true} className="my-Badge" />}</Radio.Button>
                                    <Radio.Button value="5">sp社保订单{badgeArr.indexOf(5) > -1 && <Badge dot={true} className="my-Badge" />}</Radio.Button>
                                    <Radio.Button value="1">会员订单{badgeArr.indexOf(1) > -1 && <Badge dot={true} className="my-Badge" />}</Radio.Button>
                                    <Radio.Button value="4">社保补差订单{badgeArr.indexOf(4) > -1 && <Badge dot={true} className="my-Badge" />}</Radio.Button>
                                    <Radio.Button value="6">代发工资订单{badgeArr.indexOf(6) > -1 && <Badge dot={true} className="my-Badge" />}</Radio.Button>

                                </Radio.Group>
                            </Col>
                            <Col style={{ flex: 1, 'text-align': 'right' }}>
                                是否开启自动确认 <Tooltip placement="topRight" arrowPointAtCenter={true} title="开启后，系统将自动确认 对方银行账户名称与订单的客户名称一致，且交易金额与订单金额一致 的认款。"><Icon className="question-circle" style={{ color: '#f60' }} type="question-circle" /></Tooltip> <Switch onChange={this.switchChange} checked={switchStatus ? true : false} />
                            </Col>
                        </Row>
                        <Row className="fixed-distance" type="flex" justify="start" align="middle">
                            <Col className="col-label"><label>订单号：</label></Col>
                            <Col >
                                <Input
                                    id="orderCode"
                                    size="default"
                                    style={{ width: 234 }}
                                    placeholder="订单号"
                                    value={orderCode}
                                    onChange={(e: any) => { this.handleUpdateCacheSearchParams({ orderCode: e.target.value }) }}
                                />
                            </Col>
                            <Col className="col-label"><label>客户名称：</label></Col>
                            <Col >
                                <Input id="input-search"
                                    size="default"
                                    style={{ width: 234 }}
                                    placeholder="客户名称"
                                    value={customerName}
                                    onChange={(e: any) => { this.handleUpdateCacheSearchParams({ customerName: e.target.value }) }}
                                />
                            </Col>
                            <Col className="col-label col-label-order" ><label>订单到款确认状态：</label></Col>
                            <Col >
                                <Select
                                    style={{ width: 234 }}
                                    value={confirmStatus}
                                    onChange={value => { this.handleUpdateCacheSearchParams({ confirmStatus: value }) }}>
                                    <Option value="">全部</Option>
                                    <Option value="0">社保顾问已认领，财务未处理</Option>
                                    <Option value="1">社保顾问已认领，财务已通过</Option>
                                    <Option value="2">社保顾问已认领，财务未通过</Option>
                                </Select>
                            </Col>
                            <Col >
                                <Button className="col-distance" onClick={() => this.handleSearch(PAGINATION_PARAMS)} type="primary">搜索</Button>
                            </Col>
                        </Row>
                    </div>
                    <QueueAnim type="bottom" delay="300">
                        <CollapseTable
                            ref={node => this.CollapseTable = node}
                            total={total}
                            pageSize={pageSize}
                            currentPage={currentPage}
                            loading={fetching}
                            dataSource={dataSource}
                            onChange={(params?) => {
                                if (params) {
                                    this.handleUpdateCacheSearchParams(params); this.handleSearch(params)
                                } else {
                                    this.handleSearch(PAGINATION_PARAMS);
                                }
                            }}
                        />
                        <Button type="primary" style={{ position: 'relative', top: -30 }} onClick={() => this.batchComfirm()}>批量确认到款</Button>
                    </QueueAnim>
                </div>
            </QueueAnim>
        )
    }
}

const startPoll = (params, callback) => {
    const instancePoll = new CreatePoll({ url: `${DOMAIN_OXT}/apiv2_/finance/finance/order/batch-success/progress` });
    try {
        instancePoll.poll(params, (responeData) => { return responeData.data.schedule === undefined || responeData.data.schedule === 100 || responeData.data.schedule === -1 }, (responeData) => {

            if(responeData.status !== 0) {
                message.error(responeData.errmsg);
                callback.error();
                return;
            } 
            const data = responeData.data;
            const {
                description,
            } = data;
            const msg = data.message;
            if (data.schedule === undefined) {
                callback.success(data);
            }
            if (data.schedule === 100) {
                callback && typeof callback.success === 'function' && callback.success(data);
            }
            if (data.schedule === -1) {
                callback && typeof callback.error === 'function' && callback.error(data);
            }

        });
    }
    catch (error) {
        message.error(error);
    }
}

interface CollapseTableProps extends PAGINATION_PARAMS {
    showArrow?: boolean;
    total?: number;
    dataSource: List<Map<string, any>>;
    loading?: boolean;
    onChange?: (params?) => void;
}
type PAGINATION_PARAMS = typeof PAGINATION_PARAMS
interface CollapseTableState {
    visible: boolean;
    modalfetching: boolean;
    info: any;
    modalType: 'reject' | 'confirm' | '';
}

const customPanelStyle: any = {
    backgroundColor: 'rgb(242,242,242)',
    borderRadius: 0,
    marginBottom: 24,
    overflow: 'hidden',
};
class CollapseTable extends Component<CollapseTableProps, CollapseTableState> {
    rejectReson;
    constructor(props) {
        super(props);
        this.state = {
            modalfetching: false,
            visible: false,
            info: {},
            modalType: '',
        };
    }
    readonly checked: number[] = [];
    checkboxOnChange = (e) => {
        const {
            checked,
            value,
        } = e.target;
        const index = this.checked.indexOf(value);
        if (checked) {
            return index < 0 && this.checked.push(value);
        }
        index >= 0 && this.checked.splice(index, 1);
    }

    modalProps = (type) => {
        const {
            visible,
            modalfetching,
        } = this.state;
        return {
            title: '提示',
            visible,
            onCancel: () => {
                this.setState({
                    visible: false,
                    modalfetching: false,
                });
            },
            footer: (
                <span>
                    <Button type="ghost"
                        onClick={e => this.setState({
                            visible: false,
                            modalfetching: false,
                        })}>取消</Button>
                    <Button type="primary" loading={modalfetching} onClick={e => this.modalOk(type)}>确定</Button>
                </span>
            )
        }
    }
    modalOk = async (type) => {
        const {
            orderCode,
            contract_id,
        } = this.state.info;

        if (type === 'confirm') {
            this.setState({
                modalfetching: true,
            });
            const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/finance/finance/order/batch-success`, {
                orderCode,
            }).then(data => data);
            if (data.status === 0) {
                startPoll({ uuid: data.data },
                    {
                        success: () => {
                            this.setState({
                                modalfetching: false,
                                visible: false,
                            });
                            this.props.onChange && this.props.onChange();
                        },
                        error: () => {
                            this.setState({
                                modalfetching: false,
                            });
                        }
                    }
                )
            }
            else {
                this.setState({
                    modalfetching: false,
                });
            }

        }

        if (type === 'reject') {
            const value = this.rejectReson === null ? [] : this.rejectReson.textAreaRef.value.trim();

            if (value.length <= 0) {
                return message.error('驳回原因必填');

            }
            else if (value.length >= 255) {
                return message.error('驳回原因长度小于255个字符');

            }
            this.setState({
                modalfetching: true,
            });
            const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/finance/finance/order/rejectOrder`, {
                orderCode,
                rejectReason: value,
            }).then(data => data);
            if (data.status === 0) {
                message.success('驳回成功');
                this.setState({
                    modalfetching: false,
                    visible: false,
                });
                this.props.onChange && this.props.onChange();
            }
            else {
                this.setState({
                    modalfetching: false,
                });
            }

        }


    }
    handleRepealAffirm = (orderCode) => {
        confirm({
            title: '请确认：',
            content: (
                <div>
                  <p>1、已和前道确认该订单的认款情况。</p>
                  <p>2、已和后道确认该订单的参保人情况、派单情况。</p>
                  <p>3、已和财务确认该订单的发票情况、应收会计情况。</p>
                  <p>4、已和 COO 确认。</p>
                </div>
            ),
            okText:'已确认，继续撤回',
            cancelText:'取消',
            onOk: () => {
                return new Promise(async (reslove, reject) => {
                    
                    const data = await fetchFn(`${DOMAIN_OXT}/apiv2_/finance/finance/order/reject/finished-order`, {
                        orderCode,
                    }).then(data => data as any);
                    if (data.status === 0) {
                        reslove();
                        message.success('撤销成功');
                        this.props.onChange && this.props.onChange();
                    }
                    else {
                        reject();
                    }
                })
            },
        });
    }
    setSessionStorageParams = (data) => {
        let params = {
            order_id: data.orderId,
            order_type: data.orderType,
            c_id: data.cId,
            contract_id: data.contractId,
            order_code: data.orderCode,
        }
        sessionStorage.setItem('fundConfirmInfo', JSON.stringify(params));
        browserHistory.push(`${DOMAIN_OXT}/newadmin/financial/fund/info`)
    };
    header = (value) => {
        const amountArray: any[] = value.transInfo ? value.transInfo.map(item => item.amount) : [];
        const amountTotal = amountArray.reduce(accAdd, 0);
        return (
            <div className="header-flex-wrapper">
                <div onClick={e => e.stopPropagation()}>
                    <Checkbox value={value.orderCode} disabled={parseInt(value.auditStatus, 10) !== 0} onChange={this.checkboxOnChange} defaultChecked={this.checked.includes(value.orderCode)} />
                </div>
                <span className="tips">{parseFloat(value.payMoney) > amountTotal && <Icon type="exclamation-circle" />}</span>
                <div className="countdown">
                    <p>认款截止时间倒计时：</p>
                    <strong>{value.leftDays}</strong>
                </div>
                <div className="order-company">
                    <p>订单号：{value.orderCode}</p>
                    <p>客户名称：{value.cName}</p>
                </div>
                <div className="ordertype-total">
                    <p>订单类型：{value.orderTypeName}</p>
                    <p>订单金额：{value.payMoney}</p>
                </div>
                <div className="remark">
                    {
                        value.confirmInfo && <Tooltip placement="topRight" arrowPointAtCenter={true} title={value.confirmInfo}>认款备注：{value.confirmInfo}</Tooltip>
                    }

                </div>
                <div className="handle">

                    {parseInt(value.auditStatus, 10) === 0 && [
                        <a style={{ marginRight: 5 }} href="" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.setState({
                                visible: true,
                                info: value,
                                modalType: 'confirm'
                            })
                        }} >确认到款</a>,
                        <a style={{ marginRight: 5 }} href="" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.setState({
                                visible: true,
                                info: value,
                                modalType: 'reject'
                            })
                        }}>驳回</a>
                    ]}
                    {hasRepealAffirm && value.finishedOrderCancel && <a href="" onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation()
                            this.handleRepealAffirm(value.orderCode)
                        }}>撤回认款</a>
}
                    

                    
                    <div>
                        <span className="more" onClick={(e) => { e.preventDefault(); this.setSessionStorageParams(value) }}>查看更多</span>
                    </div>
                </div>
            </div>
        )
    }
    content = (value) => {
        return (
            <table className="collapse-content-table">
                <thead>
                    <tr>
                        <th className="date">银行交易日期时间</th>
                        <th className="bank">对方银行账户名称</th>
                        <th className="account">到款银行账号</th>
                        <th className="money">交易金额</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        value.transInfo && value.transInfo.length > 0 && value.transInfo.map(value =>
                            <tr>
                                <td>{value.transTime}</td>
                                <td>{value.oppositeAccountsName}</td>
                                <td>{value.accounts}</td>
                                <td>{value.amount}</td>
                            </tr>
                        )
                    }

                </tbody>
            </table>
        )
    }
    pagination = () => {
        const {
            currentPage,
            pageSize,
        } = this.props;
        const {
            total,
            onChange,
        } = this.props;

        return statePaginationConfig({
            currentPage,
            pageSize,
            total,
        },
            onChange || null,
            null,
            (currentPage, pageSize) => {
            },
        )
    }
    collapse = () => {
        const {
            dataSource = Immutable.fromJS([]),
            showArrow = false,
            loading,
        } = this.props;
        if (dataSource.size <= 0) {
            return <div className="ant-table-placeholder">
                暂无数据
            </div>
        }
        let index  = 0;
        return dataSource.toJS().map(value => {
            return <div className="collapse-wrapper" key={value.orderCode}> 
                <Collapse key={value.orderCode} defaultActiveKey={parseInt(value.auditStatus, 10) === 0 ? [value.orderCode] : undefined}>
                    <Panel showArrow={showArrow} header={this.header(value)} key={value.orderCode} style={customPanelStyle}>
                        {this.content(value)}
                    </Panel>
                </Collapse>
            </div>
        })
    }
    render() {
        const {
            loading,
        } = this.props;
        const {
            modalType,
            info,
        } = this.state;
        const {
            cName,
            orderTypeName,
            payMoney,
        } = info;
        return (
            <Spin spinning={loading}>
                <div className="collapse-table">
                    {this.collapse()}
                    <Pagination style={{ textAlign: 'right', marginTop: 20, }} {...this.pagination() } />
                </div>
                <Modal {...this.modalProps(modalType) }>
                    {
                        modalType == 'confirm' ? <FundConfirmAlert company={cName} orderContent={orderTypeName} orderMoney={payMoney} /> : (
                            <div>
                                <Alert message='请填写驳回原因' type="error" />
                                <TextArea style={{ height: 100 }} ref={node => this.rejectReson = node} />
                            </div>
                        )
                    }
                </Modal>
            </Spin>

        )
    }
}

const FundConfirmAlert = ({ company, orderContent, orderMoney }) => {
    return (
        <div>
            <Alert message='请再次核对付款信息' type="warning" />
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{ textAlign: 'right' }}>企业名称：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>{company}</Col>
            </Row>
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{ textAlign: 'right' }}>订单内容：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>{orderContent}</Col>
            </Row>
            <Row className="confirm-wrapper" type="flex" justify="start" align="middle">
                <Col span={6} style={{ textAlign: 'right' }}>金额：</Col>
                <Col className="confirm-text-right" offset={3} span={15}>¥ {orderMoney}</Col>
            </Row>
        </div>
    )
}

function mapStateToProps(state?: any) {
    const data = state.get('fundConfirm');
    return {
        dataSource: data.get('dataSource'),
        cacheSearchParams: data.get('cacheSearchParams').toJS(),
        searchParams: data.get('searchParams').toJS(),
        total: data.get('total'),
        fetching: data.get('fetching'),
        searchStatus: data.get('searchStatus'),
        switchStatus: data.get('switchStatus'),
        badge: data.get('badge'),
    }
}

export default connect(mapStateToProps)(FundConfirm)




