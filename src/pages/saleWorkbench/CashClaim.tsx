import React, { Component } from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import Immutable from 'immutable';
import * as moment from 'moment';
import Invoice from '../../businessComponents/common/invoice';
import {
    connect,
} from 'react-redux';
import {formatMoney} from '../../util/util';
import {
    Select,
    Input,
    Table,
    Row,
    Col,
    Radio,
    DatePicker,
    message,
    Card,
    Button,
    Form,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Icon,
    Tooltip,
} from 'antd';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import { statePaginationConfig } from '../../util/pagination';
import '../../css/saleWorkbench/cashClaim';
import { Map } from 'immutable'
import {
    cashClaimSaga,
    transactionHisSaga,
    ifneedopeninvoiceSaga,
    cashClaimCheckSaga,
    cashClaimCommitSaga,

} from '../../action/saleWorkbench/cashClaimAction';

const TextArea = Input.TextArea;
const FormItem = Form.Item;
const Option = Select.Option;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const confirm = Modal.confirm;

interface TStateProps {
    dataSource:  Map<any, any>;
    searchParams: Map<any, any>,
    total: number;
    fetching: boolean;
    transactionHisData: Map<any, any>;
    userInfo: any;
    LocalDataSource: any[];
    needIvoice: boolean;
    claimableData: Map<any, any>;
}
interface TOwnProps {
    location?: any;
}
interface TDispatchProps {
    dispatch: any;
}
type CashClaimProps = TStateProps &  TOwnProps &  TDispatchProps;
interface columns {
    (data?): any[];
}
const typepay = ['CBS', '支付宝', '微信', '京东', '连连支付'];
/**
 * [isNull 判断是否为 null]
 * @param  {[type]}  value [description]
 * @return {Boolean}       [description]
 */
const isNull = (value) => {
    return (value && value !== 'null') ? value : '/'
}
class CashClaim extends Component<CashClaimProps, any> {
    sessionStorageSearchParams: any;
    orderCode:any;
    cashclaimLocalSelectKeys = (localStorage.cashclaimLocalSelectKeys && (JSON.parse(localStorage.cashclaimLocalSelectKeys) || {})) || {};
    cashclaimLocalSelectRows = (localStorage.cashclaimLocalSelectRows && (JSON.parse(localStorage.cashclaimLocalSelectRows) || {})) || {};
    localLoadTime:number;
    constructor(props) {
        super(props)
        this.sessionStorageSearchParams = JSON.parse(sessionStorage.getItem('CASHCLAIM_SESSIONSTORAGE')!);
        this.orderCode = props.location.query.orderCode;
        this.localLoadTime = 0;
        this.state = {
            cId: props.location.query.cId,
            customerName: props.location.query.invoiceTitle,//客户名称
            orderCode: this.orderCode,
            orderMoney: props.location.query.orderMoney,
            contractId: props.location.query.contractId,
            isEdit: props.location.query.isEdit,
            cashMark: '', //认款备注
            rejectReason: '', //驳回原因
            selectedRowKeys: [],
            choiceIvoice: 2, //是否选择开发票 0 不开 1开 2 未选择
            localSelectKeys: this.cashclaimLocalSelectKeys[this.orderCode]?this.cashclaimLocalSelectKeys[this.orderCode]:[],
            selectedRow: [],
            localSelectRows: this.cashclaimLocalSelectRows[this.orderCode]?this.cashclaimLocalSelectRows[this.orderCode]:[],
            claimableModal: true,
            searchParams: {
                // 客户付款查询开始时间
                payTimeSearchStart: null,
                // 客户付款查询结束时间
                payTimeSearchEnd: null,
                // 客户汇款最小金额
                amountSearchMix: '',
                // 客户汇款最大金额
                amountSearchMax: '',
                // 客户帐号名称
                oppositeAccountsName: '',
                // 客户汇款账号
                oppositeAccounts: '',
                // 客户汇款平台
                transactionPlatform: '',


                ...PAGINATION_PARAMS,
                ...this.sessionStorageSearchParams,
                length: 10
            }
        }

    };
    columns: columns = (type) => [
        type === 2 ? {
            title: '操作',
            dataIndex: null,
            key: 'operation-box',
            width: 100,
            fixed: 'left',
            render: (data, record, index) => {
                return <a onClick={(e) => this.handleRemoveLocal(data.transId)}>删除</a>;

            },
        } : {},
        {
            title: '收款来源',
            dataIndex: 'transationPlatform',
            key: 'transationPlatform',
            width: 100,
            render: (data, record, index) => {
                return typepay[data] || '暂无数据';

            },
        }, {
            title: '交易ID',
            dataIndex: 'transId',
            width: 280,
            key: 'transId',
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '银行账号',
            dataIndex: 'accounts',
            key: 'accounts',
            width: 200,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '收款单位',
            dataIndex: 'accountsName',
            key: 'accountsName',
            width: 200,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '对方银行开户行',
            dataIndex: 'oppositeBankName',
            key: 'oppositeBankName',
            width: 200,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '对方银行账户名称',
            dataIndex: 'oppositeAccountsName',
            key: 'oppositeAccountsName',
            width: 200,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '对方银行账号',
            dataIndex: 'oppositeAccounts',
            key: 'oppositeAccounts',
            width: 200,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '银行交易日期时间',
            dataIndex: 'transDatetime',
            key: 'transDatetime',
            width: 150,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '借贷标志',
            dataIndex: 'debitCreditFlag',
            key: 'debitCreditFlag',
            width: 100,
            render: (data) => {
                return data == 1 ? "借" : '贷'
            }

        }, {
            title: '协议类型',
            dataIndex: 'protocolType',
            key: 'protocolType',
            width: 100,
            render: (data) => {
                switch (data) {
                    case 'U':
                        { return '上划' }
                    case 'D':
                        { return '下拨' }
                    case 'F':
                        { return '费用' }
                    default:
                        { return '未知类型' }
                }
            }

        }, {
            title: '交易金额',
            dataIndex: 'amount',
            key: 'amount',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '已认款金额',
            dataIndex: 'claimedAmount',
            key: 'claimedAmount',
            width: 100,
            // render: (data) => {
            //     return isNull(data)
            // }

        }, {
            title: '待认款金额',
            dataIndex: 'restAmount',
            key: 'restAmount',
            width: 100,
            // render: (data) => {
            //     return isNull(data)
            // }

        }, {
            title: '币种',
            dataIndex: 'currencyType',
            key: 'currencyType',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '用途',
            dataIndex: 'purpose',
            key: 'purpose',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '摘要',
            dataIndex: 'abstractMsg',
            key: 'abstractMsg',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '银行流水号',
            dataIndex: 'bankSeqNumber',
            key: 'bankSeqNumber',
            width: 150,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '业务参考号',
            dataIndex: 'referenceNumber',
            key: 'referenceNumber',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '交易识别码',
            dataIndex: 'transNumber',
            key: 'transNumber',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
            width: 150,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '来源',
            dataIndex: 'fromWhoFlag',
            key: 'fromWhoFlag',
            width: 100,
            render: (data) => {
                return isNull(data)
            }

        }, {
            title: '备注信息',
            dataIndex: 'recordInfo',
            key: 'recordInfo',
            width: 200,
            render: (data) => {
                // return isNull(data)
                if (!data) {
                    return '/';
                }
                const style = {
                    whiteSpace: 'nowrap',
                    width: '200px',
                    color: 'green',
                    overflow: 'hidden' as 'hidden',
                    display: 'block',
                    textOverflow: 'ellipsis',
                    cursor: 'pointer',
                }
                return (
                    <Tooltip placement="topLeft" title={data}>
                        <span style={style}>{data}</span>
                    </Tooltip>

                );
            }

        }
    ]
    componentWillMount() {
        const {
            dispatch
        } = this.props;
        const {
            orderCode
        } = this.state;
        // dispatch(cashClaimSaga({
        //     payTimeSearchStart: '2017-05-01',
        //     payTimeSearchEnd: '2017-08-01',
        //     amountSearchMix: 1,
        //     amountSearchMax: 100000000,
        //     start: 0,
        //     length: 10
        // }))

        dispatch(ifneedopeninvoiceSaga({ orderCode }))
        dispatch(transactionHisSaga({ orderCode }))
    }
    // LocalDataSource
    // 已加载组件收到新的参数时调用
    componentWillReceiveProps(nextProps) {
        const {
            localSelectRows,
            localSelectKeys,
        } = this.state;
        const LocalDataSourceProp = nextProps.LocalDataSource;
        // 被驳回的订单显示上次提交的数据
        if (LocalDataSourceProp && LocalDataSourceProp.length > 0 && this.localLoadTime < 1) {
            var selectKeysTemp: Array<JSX.Element> = [];
            LocalDataSourceProp.map(function (item) {
                selectKeysTemp.push(item.transId);
            })
            var localSelectKeysTemp = Array.from(new Set(localSelectKeys.concat(selectKeysTemp)));
            var localSelectRowsTemp = uniqeByKeys(localSelectRows.concat(LocalDataSourceProp), ['transId', 'createTime']);
            this.setState({
                localSelectRows: localSelectRowsTemp,
                localSelectKeys: localSelectKeysTemp
            });
            this.localLoadTime ++;
        }

    }
    pagination = () => {
        const {
            dispatch,
            total,
        } = this.props;

        const { searchParams } = this.state;
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage) => {

            this.setSearchParamState({ 'currentPage': currentPage })
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize }, cashClaimSaga, dispatch, setCurrentPage)
    }
    // 更新搜索条件state
    setSearchParamState = (param) => {
        const { searchParams } = this.state;
        let newSearchParams = {
            ...searchParams,
            ...param,
        }
        this.setState({
            searchParams: newSearchParams
        })
        return newSearchParams;
    }
    amountSearchMaxCheck = (value) => {
        const {
            amountSearchMix
        } = this.state.searchParams;
        if (value && amountSearchMix > value) {
            message.error('金额上限不得小于金额下限');
        }
    }

    /**
     * 时间选择器配置
     */
    rangePickerProps = () => {
        const {
            payTimeSearchStart,
            payTimeSearchEnd,
        } = this.state.searchParams;
        let props: {
            onChange(x: any, y: any): void;
            value?: [any, any];
        } = {
                onChange: (data, timeString) => this.setSearchParamState({ payTimeSearchStart: timeString[0], payTimeSearchEnd: timeString[1] })
            }
        if (payTimeSearchStart && payTimeSearchEnd) {
            props.value = [moment(payTimeSearchStart), moment(payTimeSearchEnd)];
        }else{
            props.value = [null, null];
        }
        return props;
    }
    handleSearch = () => {
        const {
            amountSearchMix,
            amountSearchMax
        } = this.state.searchParams;
        if (amountSearchMix && amountSearchMax && amountSearchMix > amountSearchMax) {
            message.error('金额上限不得小于金额下限');
            return false;
        }
        this.props.dispatch(cashClaimSaga({ ...this.state.searchParams, ...PAGINATION_PARAMS, length: 10 }));
    }
    handleReset = () => {

        const params = {
            
            payTimeSearchStart: null,
            // 客户付款查询结束时间
            payTimeSearchEnd: null,
            // 客户汇款最小金额
            amountSearchMix: '',
            // 客户汇款最大金额
            amountSearchMax: '',
            // 客户帐号名称
            oppositeAccountsName: '',
            // 客户汇款账号
            oppositeAccounts: '',
            // 客户汇款平台
            transactionPlatform: '',

            ...PAGINATION_PARAMS,


        };
        this.setState({ searchParams: params });
        sessionStorage.setItem('CASHCLAIM_SESSIONSTORAGE', JSON.stringify({}));
    }
    getResult = (e) => {
        return this.Invoice.getWrappedInstance().getResult(e)
    }
    Invoice: any;
    cashClaimCommit = (e) => {
        const {
            needIvoice,
            dispatch
        } = this.props;
        const {
            choiceIvoice,
            localSelectKeys,
            localSelectRows,
            orderAmount,
            orderCode,
            orderMoney,
            contractId,
            cashMark,
            isEdit,
            cId,
        } = this.state;
        let commitParams: any = {};
        const localSelectKeysLen = localSelectKeys.length;
        if (localSelectKeysLen < 1) {
            message.error('一笔订单至少对应一笔交易纪录');
            return false;
        }
        if (needIvoice && choiceIvoice === 2) {
            message.error('请选择是否开发票');
            return false;
        }

        // 选择开发票
        if (needIvoice && choiceIvoice === 1) {
            var resultIvoice = this.getResult(e);
            // 发票信息校验
            if (!resultIvoice) {
                message.error('请先完善发票信息');
                return false;
            }
            // commitParams = resultIvoice;
            // const {
            //     expressInfo={}
            // } = resultIvoice;
            const expressInfo = resultIvoice.expressInfo;
            if(expressInfo) {
                commitParams.postAddressId = expressInfo.id;
                commitParams.postCity = expressInfo.addressId[1];
                commitParams.postProvince = expressInfo.addressId[0];
                commitParams.postDistrict = expressInfo.addressId[2];
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
            commitParams.taxRegistrationCertificateUrl = convertImgData(resultIvoice.taxImg);
            commitParams.generalTaxpayerQualificationUrl = convertImgData(resultIvoice.taxPersonImg);
            commitParams.bankLicenceUrl = convertImgData(resultIvoice.bankImg);
            commitParams.cId = cId;
            // 添加特殊备注
            commitParams.specificRemark = resultIvoice.specificRemark;
           
            commitParams = {
                ...commitParams,
                // ...resultIvoice
            }
        }


        commitParams.tractionId = localSelectKeys.toString();
        commitParams.amount = 0;
        commitParams.orderAmount = orderMoney;
        commitParams.orderCode = orderCode;
        commitParams.contractId = contractId;
        commitParams.isClaimInvoice = choiceIvoice === 2 ? '' : choiceIvoice;
        commitParams.info = cashMark;
        commitParams.ifNeedInvoice = needIvoice?1:0;
        commitParams.isEdit = isEdit;
        commitParams.createUser = `${this.props.userInfo.name}(${this.props.userInfo.employeeNumber})`;
        commitParams.createId = this.props.userInfo.userId;
        if (localSelectKeysLen === 1) {
            commitParams.amount = localSelectRows[0].amount;
            commitParams.tractionId = localSelectRows[0].transId;
            commitParams.callback = function () {

                dispatch(cashClaimCommitSaga(commitParams))
            }
            commitParams.callSetState = () => {
                this.setState({ 'claimableModal': true })
            }
            dispatch(cashClaimCheckSaga(commitParams))
        } else if (localSelectKeysLen > 1) {
            confirm({
                title: `是否确定提交这${localSelectKeysLen}条记录`,
                content: '（提交后将不可更改）',
                onOk() {
                    dispatch(cashClaimCommitSaga(commitParams))
                },

            });

        }


    }
    handleQuickCommit = (params) => {
        params && this.props.dispatch(cashClaimCommitSaga(params));
    }
    onSelectChange = (selectedRowKeys, selectedRow) => {
        this.setState({ selectedRowKeys, selectedRow });
    }
    handleSetCheckboxProps = (key) => {
        let {
            localSelectKeys,
        } = this.state;
        let result = false
        localSelectKeys.map(function (item) {
            
            if (item === key) {
                result = true;
            }
        })
        return result;

    }
    // 转移至待提交
    handleTransferWait = () => {
        let {
            orderCode,
            selectedRowKeys,
            selectedRow,
            localSelectRows,
            localSelectKeys,
        } = this.state;

        localSelectKeys = Array.from(new Set(localSelectKeys.concat(selectedRowKeys)));
        localSelectRows = uniqeByKeys(localSelectRows.concat(selectedRow), ['transId', 'createTime']);
        // localSelectRows.
        this.setState({ localSelectRows, selectedRow, localSelectKeys, selectedRowKeys: [] });
        
   
        this.cashclaimLocalSelectRows[orderCode] = localSelectRows;
        this.cashclaimLocalSelectKeys[orderCode] = localSelectKeys;
        localStorage.cashclaimLocalSelectRows = JSON.stringify(this.cashclaimLocalSelectRows);
        localStorage.cashclaimLocalSelectKeys = JSON.stringify(this.cashclaimLocalSelectKeys);
        message.success('转移成功');
    }
    handleRemoveLocal = (key) => {
        let {
            localSelectRows,
            localSelectKeys,
            orderCode,
        } = this.state;
        var keyIndex = localSelectKeys.indexOf(key);
        var rowIndex = -1
        localSelectRows.map(function (item, index) {
            if (item.transId === key) {
                rowIndex = index;
            }
        })
        if (keyIndex > -1 && rowIndex > -1) {
            localSelectKeys.splice(keyIndex, 1);
            localSelectRows.splice(rowIndex, 1)
        }
        this.setState({
            localSelectKeys,
            localSelectRows,
        })
        this.cashclaimLocalSelectRows[orderCode] = localSelectRows;
        this.cashclaimLocalSelectKeys[orderCode] = localSelectKeys;
        localStorage.cashclaimLocalSelectRows = JSON.stringify(this.cashclaimLocalSelectRows);
        localStorage.cashclaimLocalSelectKeys = JSON.stringify(this.cashclaimLocalSelectKeys);
        message.success('删除成功');
        // const dataSource = [...this.state.dataSource];
        // dataSource.splice(index, 1);
        // this.setState({ dataSource });
    }
    handleChoiceIvoice = (e) => {
        this.setState({ 'choiceIvoice': e.target.value });
    }
    render() {
        const {
            dataSource,
            transactionHisData,
            needIvoice,
            claimableData,
            fetching
        } = this.props;
        const {
            cId,
            customerName,
            orderCode,
            orderMoney,
            cashMark,
            choiceIvoice,
            searchParams,
            selectedRowKeys,
            localSelectRows,
            localSelectKeys,
            claimableModal,
        } = this.state;
        const {
            payTimeSearchStart,
            payTimeSearchEnd,
            amountSearchMix,
            amountSearchMax,
            oppositeAccounts,
            oppositeAccountsName,
            transactionPlatform,

        } = searchParams;
        const {
            confirmMSG,
            rejectReason,
        } = transactionHisData.toJS();
        // const confirmMSG = [{confirmTime:'1222222',confirmInfo:'的空间开阔了可口可乐'},{confirmTime:'555555555',confirmInfo:'的空间开阔了可口可乐'}]
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
                disabled: this.handleSetCheckboxProps(record.transId),    // Column configuration not to be checked
                // checked: true
            }),
        };
        const claimCheckResult = claimableData.toJS();
        const {
            claimable,
            saveParam,
            claimDetail,
        } = claimCheckResult;
        return (
            <QueueAnim>
                <div key="cashclaimCard" className="wrapper-content">
                    <Card
                        title={<div className="cashclaim-card-title"><span>客户名称： <b>{customerName}</b></span><span>订单号：<b>{orderCode}</b></span><span>应付总额：<b>{formatMoney(orderMoney, 2, '')}</b> 元</span></div>} >
                        <div>
                            {
                                rejectReason && <Alert
                                    message="审核结果：被驳回"
                                    description={rejectReason}
                                    type="error"
                                    closable={true}
                                    showIcon
                                />
                            }
                            <div className="cashclaim-title">
                                查询到款记录
                        </div>
                            <Alert message="请至少输入 对方银行账户名称、对方银行账号、银行交易日期时间、交易金额 中的 2 个条件进行搜索。" type="warning" showIcon />
                            <div className="form-site" style={{ paddingBottom: 15 }}>


                                <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                    <Col className="col-label" span={3}><label>收款来源：</label></Col>
                                    <Col span={5}>
                                        <Select
                                            style={{ width: 200 }}
                                            value={transactionPlatform}
                                            onChange={value => { this.setSearchParamState({ transactionPlatform: value }) }}
                                        >
                                            <option value=''>全部</option>
                                            <option value={0}>银行打款（CBS）</option>
                                            <option value={1}>支付宝</option>

                                        </Select>

                                    </Col>
                                    <Col className="col-label" span={3}><label>对方银行账户名称：</label></Col>
                                    <Col span={5}>
                                        <Input

                                            size="default"
                                            style={{ width: 245 }}
                                            placeholder="请输入"
                                            value={oppositeAccountsName}
                                            onChange={(e: any) => { this.setSearchParamState({ oppositeAccountsName: e.target.value }) }}
                                        />
                                    </Col>
                                    <Col className="col-label" span={3}><label>对方银行账号：</label></Col>
                                    <Col span={5}>
                                        <Input
                                            id="orderCode"
                                            size="default"
                                            style={{ width: 250 }}
                                            placeholder="请输入"
                                            value={oppositeAccounts}
                                            onChange={(e: any) => { this.setSearchParamState({ oppositeAccounts: e.target.value }) }}
                                        />
                                    </Col>
                                </Row>
                                <Row className="fixed-distance" type="flex" justify="start" align="middle">
                                    <Col className="col-label" span={3}><label>银行交易日期时间：</label></Col>
                                    <Col span={5}>
                                        <RangePicker {...this.rangePickerProps() } />
                                    </Col>
                                    <Col className="col-label" span={3}><label>交易金额：</label></Col>
                                    <Col span={5}>
                                        <InputGroup compact>

                                            <InputNumber
                                                style={{ width: 110, textAlign: 'center' }}
                                                max={999999999}
                                                value={amountSearchMix}
                                                onChange={(value) => { this.setSearchParamState({ amountSearchMix: value }) }}
                                                placeholder="请输入" />
                                                <Input style={{ width: 25, borderLeft: 0, pointerEvents: 'none' }} disabled={true} placeholder="~" />
                                            <InputNumber
                                                style={{ width: 110, textAlign: 'center', borderLeft: 0 }}
                                                max={999999999}
                                                value={amountSearchMax}
                                                onChange={(value) => { this.setSearchParamState({ amountSearchMax: value }) }}
                                                placeholder="请输入" />
                                        </InputGroup>
                                    </Col>
                                    <Col span={8}>
                                        <Button type="primary" onClick={e => this.handleSearch()}>搜索</Button>
                                        <Button style={{ marginLeft: 8 }} onClick={e => this.handleReset()}>重置</Button>
                                    </Col>
                                </Row>
                            </div>
                            <QueueAnim type="bottom" delay="300" style={{ paddingBottom: 15 }}>
                                <Table columns={this.columns(1)}
                                    rowSelection={rowSelection}
                                    rowKey={(record: any) => record.transId}
                                    dataSource={dataSource.toJS()}
                                    loading={fetching}
                                    pagination={this.pagination()}
                                    scroll={{ x: 3150, y: 400 }}
                                />
                            </QueueAnim>
                            <div className='transfer-button-box'>
                                {
                                    selectedRowKeys.length > 0 ?
                                        <Button type="primary"  onClick={this.handleTransferWait}><Icon type="folder-add" />转移至待提交</Button> :
                                        <Button  disabled><Icon type="folder-add" />转移至待提交</Button>
                                }
                            </div>

                            <div className="cashclaim-title">
                                待提交的到款记录
                        </div>
                            <QueueAnim type="bottom" delay="300" style={{ paddingBottom: 15 }}>
                                <Table columns={this.columns(2)}
                                    rowKey={(record: any) => record.id}
                                    dataSource={localSelectRows}
                                    scroll={{ x: 3230, y: 100 }}

                                />
                            </QueueAnim>
                            {
                                localSelectKeys.length > 0 && <div className='transfer-button-box'>共{localSelectKeys.length}条</div>
                            }

                            <div className="cashclaim-title">
                                认款备注
                        </div>
                            <Alert message={
                                <div>
                                    <p>如果签约的客户名称与到款记录的对方名称不一致，请再次确认并备注说明；</p>
                                    <p>如果本次订单的金额与到款记录的交易金额不一致（如销售在认领会员费订单时，会有遇到客户将会员费与社保款一起打过来的情况），则需说明交易金额的各项明细，如 会员费金额为：xxxx，社保款金额为：xxxxxx；</p>
                                </div>
                            } type="warning" showIcon />
                            <TextArea value={cashMark} onChange={(e: any) => { this.setState({ 'cashMark': e.target.value }) }} style={{ marginBottom: 15 }}></TextArea>
                            {
                                needIvoice && <div key="choiceIvoice">
                                    <div className="cashclaim-title">
                                        发票信息<span>（必填）</span>
                                    </div>
                                    <Alert message={
                                        <div>
                                            <p>纸质发票将用普通快递的方式发出。电子发票将直接通过短信、邮件发送至客户的收票人手机与 E-mail 中。</p>
                                            <p>本次如果选择不开发票，该订单以后将不能再开。已申请过预开发票的，请在该页面选择不开发票</p>
                                        </div>
                                    } type="warning" showIcon style={{marginBottom:15}}/>



                                    <Radio.Group value={choiceIvoice} onChange={this.handleChoiceIvoice} style={{ paddingBottom: 15 }}>
                                        <Radio.Button value={1}>开发票</Radio.Button>
                                        <Radio.Button value={0}>不开发票</Radio.Button>
                                    </Radio.Group>
                                    {
                                        choiceIvoice === 1 && <div style={{ paddingBottom: 15 }}><Invoice ref={node => this.Invoice = node} type={1} cId={cId}></Invoice></div>
                                    }
                                </div>
                            }

                            {
                                (confirmMSG && confirmMSG.length > 1) && <div className="cashclaim-title">
                                    更多备注
                            </div>
                            }
                            {
                                (confirmMSG && confirmMSG.length > 1) &&

                                confirmMSG.map((data: any) => (<div><p>{data.confirmInfo}</p><p style={{ color: '#999' }}>{data.confirmTime}</p></div>))
                            }

                            <div className="form-site" style={{ paddingBottom: 15, paddingTop: 15 }}>
                                <Button type="primary" loading={fetching} onClick={e => this.cashClaimCommit(e)}>确认并提交</Button>

                            </div>
                        </div>
                    </Card>
                    {
                        claimable === 2 && <Modal
                            maskClosable={false}
                            title="提示"
                            visible={this.state.claimableModal}
                            onCancel={e => { this.setState({ 'claimableModal': false }) }}
                            footer={<Button  type="primary" onClick={e => { this.setState({ 'claimableModal': false }) }}>我知道了</Button>}

                        >
                            <div style={{ paddingLeft: 40 }}>
                                <p>亲，该笔交易纪录已被<span style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: claimDetail }}></span>认领，本认款无法继续进行，请确认收款方。如之前认领有误，请紧急联系财务人员。</p>
                            </div>
                        </Modal>
                    }
                     {
                        claimable === 1 &&<Modal
                            maskClosable={false}
                        title="提示"
                        visible={this.state.claimableModal}
                        onOk={e=>{this.handleQuickCommit(saveParam)}}
                        onCancel={e=>{this.setState({'claimableModal':false})}}
                        okText="确认"
                        cancelText="取消"
                        confirmLoading={fetching}
                       
                        >
                            <div style={{ paddingLeft: 40 }}>
                                <p>亲，该笔交易纪录已被<span style={{ color: 'red' }} dangerouslySetInnerHTML={{ __html: claimDetail }}></span>认领。</p>
                                <p>是否继续认领？</p>
                            </div>

                        </Modal>
                    }
                    {
                        claimable === 4 && <Modal
                            maskClosable={false}
                            title="提示"
                            visible={this.state.claimableModal}
                            onOk={e => { this.handleQuickCommit(saveParam) }}
                            onCancel={e => { this.setState({ 'claimableModal': false }) }}
                            okText="确认"
                            cancelText="取消"
                            confirmLoading={fetching}
                        >
                            <div style={{ paddingLeft: 40 }}>
                                <p>注意：</p>
                                <p>！！！该订单的金额与到款记录的总金额不一致</p>
                                <p style={{ color: 'red' }}>订单金额：{claimCheckResult.orderAmount}</p>
                                <p style={{ color: 'red' }}>到款总金额：{claimCheckResult.amount}</p>
                                <p>是否继续认领？</p>
                                <p>请确认</p>
                            </div>

                        </Modal>
                    }
                    {
                        claimable === 5 && <Modal
                            maskClosable={false}
                            title="提示"
                            visible={this.state.claimableModal}
                            onCancel={e => { this.setState({ 'claimableModal': false }) }}
                            footer={<Button  type="primary" onClick={e => { this.setState({ 'claimableModal': false }) }}>我知道了</Button>}

                        >
                            <div style={{ paddingLeft: 40 }}>
                                <p>认款信息有误，客户的签约主体（杭州今元标矩科技有限公司）与收款单位不一致，需如下应对：</p>
                                <p>1、联系业管变更签约主体，或</p>
                                <p>2、联系财务申请退款并让客户重新打款</p>
                            </div>
                        </Modal>
                    }





                </div>

            </QueueAnim>
        )
    }
};
// 上传图片对象转换
const convertImgData = (data)=> {
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
//将对象元素转换成字符串以作比较
function obj2key(obj, keys) {
    var n = keys.length;
    var key: Array<any> = [];
    while (n--) {
        key.push(obj[keys[n]]);
    }
    return key.join('|');
}
//去重操作
function uniqeByKeys(array, keys) {
    var arr: Array<JSX.Element> = [];
    var hash = {};
    for (var i: number = 0, j = array.length; i < j; i++) {
        var k = obj2key(array[i], keys);
        if (!(k in hash)) {
            hash[k] = true;
            arr.push(array[i]);
        }
    }
    return arr;
}
const mapStateToProps = (state: any) => {
    const data = state.get('cashClaimReducers');
    return {
        dataSource: data.get('dataSource'),
        // searchParams: data.get('searchParams'),
        total: data.get('total'),
        fetching: data.get('fetching'),
        transactionHisData: data.get('transactionHisData'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        LocalDataSource: data.get('LocalDataSource').toJS(),
        needIvoice: data.get('needIvoice'),
        claimableData: data.get('claimableData'),
    }
}
export default connect(mapStateToProps)(CashClaim);



