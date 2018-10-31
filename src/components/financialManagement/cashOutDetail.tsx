/**
 * Created by caozheng on 2017/2/21.
 */

import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import { bindActionCreators } from '../../redux-realize';
import Immutable from 'immutable';
import * as CashOutDetailAction from '../../action/financialManagement/cashOutDetailAction';
import * as moment from 'moment';
import { PHP_DOMAIN } from '../../global/global'
import {
    Row,
    Col,
    Table,
    Button,
    Modal,
    Alert,
    Input,
    message,
    Spin,
    Radio,
    DatePicker,
    Select,
    Form,
    Card,
    Tabs,
    Icon,
} from 'antd';
// import { Header } from '../../components/financialManagement/header';
import { getColumns } from '../../components/financialManagement/detailTableColumn';
import { formatDateTime } from '../../util/timeFormat';
import { statePaginationConfig } from '../../util/pagination';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import '../../css/financialManagement/cashOutDetail.less';
import * as _ from 'lodash';
import PayeeInfo from '../../businessComponents/common/payeeInfo';
const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const TextArea = Input.TextArea;
interface TDispatchProps {
    triggerCashOutDetailSaga?: any;
    triggerCashOutDetailTableSaga?: any;
    setModalVisible?: any;
    triggerCashOutAuditSaga?: any;
    setCashOutButton?: any;
    setLoadingState?: any;
    setRadioState?: any;
    getAccountListSaga?: any;
    setBankValue?: any;
    setSelectTime?: any;
    triggerCashOutEmitSubmitSaga?: any;
    addPrepayments?: any;
}
interface TOwnProps {
    location?: any;
    role: number;
}
interface TStateProps {
    businessType: any;
    detailData: any;
    tableData: any[];
    money: any;
    visible: any;
    modalType: any;
    loading: any;
    radioState: any;
    accountList: any;
    bankTransferValue: any;
    checkBankValue: any;
    remitTime: any;
    checkTime: any;
    total: number;
}
type CashOutDetailProps = TStateProps & TDispatchProps & TOwnProps;
// interface CashOutDetailProps extends TStateProps, TOwnProps {
    
// }
interface CashOutDetailState {
    searchParams: any;
    financePlanPayTime?: any;
}
interface infoEntryParam {
    prepaymentsCode: any;
    payType?: any;
    payBankName?: any;
    paySerialNumber?: any;
    payDrawer?: any;
    payTime?: any;
   
}
const range = (start, end) => {
    const result: Array<number> = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
}
const headerNames = {
    0: '请款单明细', // 社保款请款
    1: '请款单明细：', // 社保专员请款详情款详情
    2: '审批请款单号：', // 业务方审批
    3: '审批请款单号：', // 财务方审批
    4: '打款信息录入_请款单号：', // 信息录入
    5: '打款信息录入_请款单号：', // 信息录入详情
};
class DetailTable extends Table<any>{ }



class CashOutDetail extends React.Component<CashOutDetailProps, CashOutDetailState> {

    constructor(props) {
        super(props);
        this.detailArgs = JSON.parse(this.props.location.query.detailArgs);
        this.buttonShow = this.detailArgs.info || 1;
        this.state = {
            financePlanPayTime:0,
            searchParams: {
                ...PAGINATION_PARAMS,
                isCost:0,
                qOrderId:null,
                serviceName:'',
                financeType:null,
                insuranceFeesMonth:null,
                policyId:null,
                ...this.detailArgs
                
            }
        }
    }
    buttonShow: number | string;
    detailArgs: any;
    rejectText: any;
    // 流水号
    serialNumber: any;
    // 支票号
    checkNumber: any;
    remark: any
    paymentDeadline: number;

    componentWillMount() {
        const { headerNo, companyId, city } = this.detailArgs;
        // 获取基础信息
        if (headerNo == 0) {
            this.props.triggerCashOutDetailSaga({ type: 1, ...this.detailArgs,...PAGINATION_PARAMS })
        }
        else {
            this.props.triggerCashOutDetailSaga({ orderNum: this.detailArgs.orderNum || "", type: 2,...PAGINATION_PARAMS });
        }





        // 设置底部按钮显示隐藏
        // this.props.setCashOutButton(this.detailArgs.info || "1");
        // 如果当前页面是打款信息录入发送请求
        if (headerNo == 4 || headerNo == 5) {
            this.props.getAccountListSaga();
        }
        // 协议发送完成前loading状态
        // this.props.setLoadingState(false);
    }
    handleOk = () => {
        const {
            modalType,
            radioState,
            accountList,
            bankTransferValue,
            remitTime,
            checkTime,
            checkBankValue,
            detailData,
            role,
        } = this.props;
        
        const detailArgs = this.detailArgs;

        const checkBank = accountList.checkBank;
        const bankTransfer = accountList.bankTransfer;
        const orderNum = this.detailArgs.orderNum;
        let param: infoEntryParam = { prepaymentsCode: orderNum };
        
        if (modalType == "reject") {
            // 拒绝
            let value = this.rejectText.textAreaRef.value;
            if (value.length < 1) {
                message.error('驳回原因不能为空', 3);
                return;
            }
            _.assign(param, { financeStatus: 3, financeReason: value, role });
            this.props.triggerCashOutAuditSaga(param);
        } else if (modalType == "infoEntry") {
            // 确认提交
            param.payType = radioState;
            if (radioState == 1) {
                if (this.serialNumber.input.value === '') {
                    message.error('请填写流水号');
                    return;
                }
                if (remitTime === '') {
                    message.error('请填写打款时间');
                    return;
                }
                param.payBankName = accountList.bankTransfer[bankTransferValue].dictName;
                param.paySerialNumber = this.serialNumber.input.value;
                param.payDrawer = bankTransfer[0].description;
                param.payTime = new Date(remitTime).getTime() / 1000;
            } else {
                if (this.checkNumber.input.value === '') {
                    message.error('请填写支票号');
                    return;
                }
                if (checkTime === '') {
                    message.error('请填写开票时间');
                    return;
                }
                param.payBankName = accountList.checkBank[checkBankValue].dictName;
                param.paySerialNumber = this.checkNumber.input.value;
                param.payDrawer = checkBank[0].description;
                param.payTime = new Date(checkTime).getTime() / 1000;
            }
            this.props.triggerCashOutEmitSubmitSaga(param);
        } else if (modalType == "pass") {
            let defualtPlanPayTime = this.props.detailData.paymentsDeadline
            let financePlanPayTime
            if(this.state.financePlanPayTime === '') {
                message.error('请选择财务计划支付时间', 3);
                return;
            } else if (this.state.financePlanPayTime === 0 || this.state.financePlanPayTime===undefined) {
                financePlanPayTime = defualtPlanPayTime
            }else{
                if (typeof this.state.financePlanPayTime==="string"){
                    financePlanPayTime = Date.parse(this.state.financePlanPayTime) / 1000
                }else{
                    financePlanPayTime = this.state.financePlanPayTime
                }
                
            }
            _.assign(param, { financeStatus: 2, role, financePlanPayTime});
           
            this.props.triggerCashOutAuditSaga(param);
           
        }
        else if (modalType === 'generate') {
            const payeeInfo = this.payeeInfo.getWrappedInstance();
            const {
                secondCashout,
                secondCashoutPayeeId,
                secondCashoutRemark,
                cashoutDeadline,
                promiseDeadline,
            } = payeeInfo.validate();
            // if(this.paymentDeadline === undefined) {
            //     message.error('请选择约定付款截止日');
            //     return;
            // }
            const {
                // promiseDeadline,
                receivablesId,
                receivablesType,
                receivablesName,
            } = detailData;
            const params = {
                // financePlanPayTime: this.state.financePlanPayTime,
                isAgain: secondCashout,
                againReceiveId: secondCashoutPayeeId,
                againRemark: secondCashoutRemark,
                insuranceFeesMonth: detailArgs.month,
                businessType: detailArgs.requestNature,
                socialAddress: detailArgs.cityName,
                receivablesType: receivablesType,
                receivablesName: receivablesName || '',
                receivablesId: receivablesId,
                // paymentDeadline : (this.paymentDeadline / 1000).toFixed(0),
                promiseDeadline: promiseDeadline.format('YYYY-MM-DD'),
                paymentDeadline: (cashoutDeadline.valueOf() / 1000).toFixed(0),
                paymentsRemark: this.remark.textAreaRef.value,
                areaPolicyId: detailArgs.city
            };
            this.props.addPrepayments(params, () => 
            window.location.href = `${PHP_DOMAIN}/social/business/socialbusiness?city=${this.detailArgs.city}&month=${this.detailArgs.month}&cityName=${this.detailArgs.cityName}&service=${this.detailArgs.companyType}`); 
        }

        this.props.setModalVisible(false)
    };

    handleCancel() {
        this.props.setModalVisible(false)
    }

    buttonHandleChange = (type) => {
        const payeeInfo = this.payeeInfo.getWrappedInstance();
        if (type === 'generate') {
            const result = payeeInfo.validate();
            if (result === false) {
                return;
            }

        }
        this.setState({
            financePlanPayTime: this.props.detailData.paymentsDeadline
        })
        this.props.setModalVisible(true, type)
    }

    radioHandleChange = (e) => {
        this.props.setRadioState(e.target.value);
    };
    dataChange = (date, dateString) => {
        this.setState({
            financePlanPayTime: dateString
        })
    }
    selectHandleChange = (type, e) => {

        this.props.setBankValue(e.target.value, type)
    };

    datePickerHandleChange = (type, date, dateString) => {
        this.props.setSelectTime(dateString, type);
    };
    datePickerTimeProps = () => {

        let props: any = {
            style: { width: 200 },
            showTime: { defaultValue: moment('17:00', 'HH:mm') },
            disabledTime: () => ({
                disabledHours: () => [0, 1, 2, 3, 4, 5, 6, 7, 8, 19, 20, 21, 22, 23, 24],
                disabledMinutes: () => range(1, 60),
                disabledSeconds: () => range(1, 60),
            }),
            onChange: (date: moment.Moment, dateString: string) => { this.paymentDeadline = date.valueOf() },
            disabledDate: (current) => {
                return !(current && current.valueOf() < moment().add(30, 'days').valueOf() && current.valueOf() > moment().subtract(30, 'days').valueOf());
            },
            format: "YYYY-MM-DD HH:mm",
        }
        return props;
    }
    datePickerProps = () => {
        return {
            style: { width: 200 },
            onChange: this.datePickerHandleChange.bind(this, 'remit'),
            disabledDate: (current) => {
                return !(current && current.valueOf() < moment().add(30, 'days').valueOf() && current.valueOf() > moment().subtract(30, 'days').valueOf());
            }
        }
    }
    // pagination = () => {
        
        
   
    //     const {
    //         total,
    //     } = this.props;
        
    //     return {
    //         total:total,
    //         showSizeChanger: true,
    //         showQuickJumper: true,
    //         defaultPageSize: PAGINATION_PARAMS.pageSize,
    //         pageSizeOptions: ['20', '50', '100'],
    //         showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
    //     } as any;
    // }
    pagination = () => {
        const {
            total,
            triggerCashOutDetailTableSaga,
            detailData
        } = this.props;
        const { searchParams } = this.state;
     
        const newParams = {
            ...searchParams,
            insuranceFeesMonth: formatDateTime(detailData.insuranceFeesMonth, 'merge'),
            isCost: detailData.payStatus || 0,
            serviceName:detailData.branchName,
            policyId: detailData.areaPolicyId,
            financeType: detailData.businessType
        }
        const {
            currentPage,
            pageSize,
        } = searchParams;
        const setCurrentPage = (currentPage,pageSize) => {

            this.setSearchParamState({ 'currentPage': currentPage,'pageSize':pageSize})
        }
        return statePaginationConfig({ ...newParams, currentPage, total, pageSize }, triggerCashOutDetailTableSaga,null, setCurrentPage)
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
    detailTableProps = (businessType) => {
        let scroll = {};
        switch (Number(businessType)) {
            case 14:
                scroll = {
                    x: 9100,
                    y: window.innerHeight*0.6
                };
                break;
            case 15:
                scroll = {
                    x: 6950,
                    y: window.innerHeight*0.6
                };
                break;
            case 16:
                scroll = {
                    x: 3000,
                    y: window.innerHeight*0.6
                };
                break;
        }
        return {
            scroll,
            style: { marginTop: 20 },
            bordered: true,
            dataSource: this.props.tableData,
            pagination: this.pagination(),
            columns: getColumns(businessType)
        }
    }
    payeeInfoProps = () => {
        const {
            company,
            orderNum,
        } = this.detailArgs;
        const {
            depositName,
            depositAccount,
            receivablesId,
            promiseDeadline,
            branchName,
            receivablesName,
            receivablesType,
            isAgain,
            againRemark,
            againBranchName,
            againDepositAccount,
            againDepositName,
            againReceiveId,
            paymentsDeadline,
            financePlanPayTime,
        } = this.props.detailData;
        
        // policyId: data.areaPolicyId,
        //             insuranceFeesMonth: formatDateTime(data.insuranceFeesMonth, 'merge'),
        //             financeType: data.businessType,
        //             isCommit: 1,
        //             serviceName: data.branchName,
        if (orderNum) {

            return {
                uiType: 1,
                edit: false,
                recipientName: receivablesName,
                receivablesId: receivablesId,
                recipientType: receivablesType,
                openBank: depositName,
                account: depositAccount,
                promiseDeadline,
                cashoutDeadline: paymentsDeadline,
                secondCashoutInfo: Immutable.fromJS({
                    secondCashoutRemark: againRemark,
                    secondCashoutOpenBank: againDepositName,
                    secondCashoutAccount: againDepositAccount,
                    secondCashoutPayeeId: againReceiveId,
                    secondCashoutPayeeName: againBranchName,
                }),
                secondCashout: isAgain,
                financePlanPayTime,
            }
        }
        else {
            return {
                uiType: 1,
                edit: true,
                recipientName: company,
                recipientId: receivablesId,
                recipientType: receivablesType,
                openBank: depositName,
                account: depositAccount,
                promiseDeadline,
                financePlanPayTime,
            }
        }

    }
    timestampToTime(timestamp) {
        let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() ;
        let time3 = Y + M + D ;
        return time3
    }
    payeeInfo: any;
    render() {
        console.log(this.detailArgs)
        const dateFormat = 'YYYY-MM-DD';

        let defalutTime = this.timestampToTime(this.props.detailData.paymentsDeadline)
        const {
            detailData,
            visible,
            modalType,
            // buttonShow,
            loading,
            radioState,
            accountList,
            bankTransferValue,
            checkBankValue,
            money,
            businessType,
        } = this.props;
        
        const {
            insuranceFeesMonth,
            socialAddress,
            prepaymentsCode,
        } = detailData;
        const detailArgs = this.detailArgs;
        const {
            headerNo,
            month,
            cityName,
        } = detailArgs;
        const {
            bankTransfer,
            checkBank
        } = accountList;
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
        const tabName = (headerNo !== undefined && headerNames[headerNo]) + (prepaymentsCode ? prepaymentsCode : '')
        const UrlPathName = window.location.pathname
        const pathName = UrlPathName.split("/").pop();
        return (
            <QueueAnim>
                <div key="CashOutDetail" className="cash-out-detail">
                    <Spin tip="Loading..." spinning={loading}>
                        <Tabs animated={false} activeKey="1">
                            <TabPane tab={<span><Icon type="left-circle-o" />{tabName}</span>} key="1" style={{ padding: '10px' }}>

                                {/* <Header detailData={detailData} detailArgs={detailArgs} /> */}

                                <div className="cash-out">

                                    <Row type="flex" justify="start" align="middle">
                                        <Col className="header-distance">业务类型：{
                                            (() => {
                                                if (businessType == 14) {
                                                    return "社保五险一金"
                                                } else if (businessType == 15) {
                                                    return "五险"
                                                } else {
                                                    return "公积金"
                                                }
                                            })()
                                        }</Col>
                                        <Col className="header-distance">社保缴费月：{
                                            headerNo != 0 ?
                                                insuranceFeesMonth && formatDateTime(insuranceFeesMonth, 'merge')
                                                :
                                                month
                                        }
                                        </Col>
                                        <Col className="header-distance">参保地：{
                                            headerNo != 0 ?
                                                socialAddress && socialAddress
                                                :
                                                cityName
                                        }</Col>
                                    </Row>
                                </div>
                                {
                                    (() => {
                                        if (detailArgs && (headerNo == 4 || headerNo == 5)) {
                                            return (
                                                <Row className="cash-out-radio-group" >
                                                    <Form layout="horizontal">
                                                        <FormItem {...formItemLayout}>
                                                            <RadioGroup onChange={this.radioHandleChange} disabled={headerNo == 5 ? true : false} value={radioState}>
                                                                <Radio value={1}>银行转账</Radio>
                                                                <Radio value={2}>支票</Radio>
                                                            </RadioGroup>
                                                        </FormItem>
                                                    </Form>
                                                    {
                                                        radioState == 1 ? (
                                                            <div key="radio-1">
                                                                <Form layout="horizontal" style={{ width: 605 }}>
                                                                    <FormItem label="打款银行名称" {...formItemLayout}>
                                                                        {
                                                                            headerNo == 5 ?
                                                                                <span>{
                                                                                    bankTransfer && (bankTransfer.map((items, index) => <span key={index}>{items.dictName}</span>))
                                                                                }
                                                                                </span>
                                                                                :
                                                                                <Select value={bankTransferValue} style={{ width: 200 }} onChange={this.selectHandleChange.bind(this, 'bankTransfer')} size="default">
                                                                                    {
                                                                                        bankTransfer && (bankTransfer.map((items, index) => <Option key={index} value={String(index)}>{items.dictName}</Option>))
                                                                                    }
                                                                                </Select>
                                                                        }
                                                                    </FormItem>
                                                                    <FormItem label="打款银行账号" {...formItemLayout}>
                                                                            {
                                                                                bankTransfer && bankTransfer.map((items, index) => <label>{items.description}</label>)
                                                                            }
                                                                        </FormItem>
                                                                    <FormItem label="流水号" {...formItemLayout}>
                                                                        {
                                                                            headerNo == 5 ?
                                                                                <span>{detailData.paySerialNumber}</span>
                                                                                :
                                                                                <Input ref={(node) => this.serialNumber = node} style={{ width: 200 }} size="default" />
                                                                        }
                                                                    </FormItem>
                                                                    <FormItem label="打款时间" {...formItemLayout}>
                                                                        {
                                                                            headerNo == 5 ?
                                                                                <span>{formatDateTime(detailData.payTime)}</span>
                                                                                :
                                                                                <DatePicker {...this.datePickerProps() } size="default" />
                                                                        }
                                                                    </FormItem>
                                                                </Form>
                                                            </div>
                                                        ) : (
                                                                <div key="radio-2">
                                                                    <Form layout="horizontal" style={{ width: 510 }}>
                                                                        <FormItem label="付款行名称" {...formItemLayout}>
                                                                            {
                                                                                headerNo == 5 ?
                                                                                    <span>{detailData.payBankName}</span>
                                                                                    :
                                                                                    <Select value={checkBankValue} style={{ width: 200 }} onChange={this.selectHandleChange.bind(this, 'checkBank')} size="default">
                                                                                        {
                                                                                            checkBank && checkBank.map((items, index) => <Option key={index} value={String(index)}>{items.dictName}</Option>)
                                                                                        }
                                                                                    </Select>
                                                                            }
                                                                        </FormItem>
                                                                        <FormItem label="出票人账号" {...formItemLayout}>
                                                                            {
                                                                                checkBank && checkBank.map((items, index) => <label>{items.description}</label>)
                                                                            }
                                                                        </FormItem>
                                                                        <FormItem label="支票号" {...formItemLayout}>
                                                                            {
                                                                                headerNo == 5 ?
                                                                                    <span>{detailData.paySerialNumber}</span>
                                                                                    :
                                                                                    <Input ref={(node) => this.checkNumber = node} style={{ width: 200 }} size="default" />
                                                                            }
                                                                        </FormItem>
                                                                        <FormItem label="开票时间" {...formItemLayout}>
                                                                            {
                                                                                headerNo == 5 ?
                                                                                    <span>{formatDateTime(detailData.payTime)}</span>
                                                                                    :
                                                                                    <DatePicker style={{ width: 200 }} onChange={this.datePickerHandleChange.bind(this, 'checkTime')} size="default" />
                                                                            }
                                                                        </FormItem>
                                                                    </Form>
                                                                </div>
                                                            )
                                                    }
                                                </Row>
                                            )
                                        }
                                    })()
                                }
                                <DetailTable  {...this.detailTableProps(businessType) } />
                                <div style={{ 'textAlign': 'right', marginBottom: 26 }}>
                                    本次请款需支付：<strong style={{ 'font-size': '20px', 'font-weight': 600, color: 'red' }}>¥{money}</strong>
                                </div>
                                {/* <Row type="flex" align="middle" justify="start" >
                            <Col className="cash-out-title">
                                <label className="cash-out-label">对应客户情况</label>
                            </Col>
                        </Row> */}
                                <PayeeInfo {...this.payeeInfoProps() } ref={node => this.payeeInfo = node} />
                                {/* <Row className="client-info">
                            <Col>
                                <Row style={{ marginTop: 0 }} className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                    <Col span={24}>
                                        <label className="col-label">打款给：</label>
                                        <span>{detailData && (detailData.receivablesType == 1 ? '分公司' : '服务商')}</span>
                                    </Col>
                                </Row>
                                <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                    <Col span={24}>
                                        <label className="col-label">收款方名称：</label>
                                        <span>{detailData && detailData.branchName || '/'}</span>
                                    </Col>
                                </Row>
                                <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                    <Col span={24}>
                                        <label className="col-label">开户行：	</label>
                                        <span>{detailData && detailData.depositName || '/'}</span>
                                    </Col>
                                </Row>
                                <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                    <Col span={24}>
                                        <label className="col-label">账号：</label>
                                        <span>{detailData && detailData.depositAccount || '/'}</span>
                                    </Col>
                                </Row>
                                {
                                    detailData.receivablesType === 2 && (
                                        <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                            <Col span={24}>
                                                <label className="col-label">约定付款截止日期：</label>
                                                <span>{detailData && detailData.promiseDeadline || '/'}</span>
                                            </Col>
                                        </Row>
                                    )
                                }
                                <Row className="distance-info" gutter={16} type="flex" justify="start" align="middle">
                                    <Col span={24}>
                                        <label className="col-label">本次请款付款截止日：	</label>
                                        {
                                            headerNo == 0 ? 
                                                <DatePicker {...this.datePickerTimeProps()}  />
                                                :
                                                <span>{detailData && formatDateTime(detailData.paymentsDeadline) || "/"}</span>
                                        }
                                        
                                    </Col>
                                </Row>
                            </Col>
                        </Row> */}
                                {/* <Row type="flex">
                            <Col className="cash-out-title">
                                <label className="cash-out-label">请款备注</label>
                            </Col>
                        </Row> */}
                                <Card className="card" key="card-2" title='请款备注'>
                                    {
                                        headerNo != 0 ?
                                            detailData && detailData.paymentsRemark || ""
                                            :
                                            <TextArea maxLength={180} style={{ height: 150 }} ref={node => this.remark = node} />
                                    }
                                </Card>

                                {
                                    (() => {
                                        if (this.buttonShow == 2) {
                                            if (headerNo == 3) {
                                                return (<Row type="flex" align="middle" justify="center" >
                                                    <Button className="btn-resolve" type="primary" onClick={() => this.buttonHandleChange('pass')}>审批通过</Button>
                                                    <Button onClick={() => this.buttonHandleChange('reject')}>审批驳回</Button>
                                                </Row>)
                                            }
                                            if (headerNo == 4) {
                                                return (
                                                    (<Row type="flex" align="middle" justify="center" >
                                                        <Button type="primary" onClick={() => this.buttonHandleChange('infoEntry')}>确认提交</Button>
                                                    </Row>)
                                                )
                                            }
                                            if (headerNo == 0) {
                                                return (
                                                    (<Row type="flex" align="middle" justify="center" >
                                                        <Button type="primary" onClick={() => this.buttonHandleChange('generate')}>生成支付请款单</Button>
                                                    </Row>)
                                                )
                                            }
                                        }
                                    })()


                                }
                            </TabPane>
                        </Tabs>
                    </Spin>
                </div>
                <Modal title="提示"
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.handleCancel.bind(this)}
                    visible={visible}>
                    {
                        (() => {
                            if (modalType == "reject") {
                                return (
                                    <Row>
                                        <TextArea ref={(node) => this.rejectText = node} style={{ height: 100 }} placeholder="请填写驳回原因" />
                                    </Row>
                                )
                            } else if (modalType == "pass") {
                                if (pathName == 'payinfoapprove') {
                                    return (<Row>
                                        <Col offset={4}>财务计划支付时间：<DatePicker defaultValue={moment(defalutTime, dateFormat)} format={dateFormat}
                                            onChange={(date: any, dateStrings: string) => this.dataChange(date, dateStrings)}
                                        /></Col>
                                    </Row>)
                                }else{
                                    return (<Row>
                                        <Alert message="是否确认审核通过" type="error" />
                                    </Row>)
                                }
                                
                            } else if (modalType == "infoEntry") {
                                return <Alert message="是否确认提交" type="error" />
                            }
                            else if (modalType == "generate") {
                                return <Alert message="是否确认生成支付请款单" type="error" />
                            }
                        })()
                    }
                </Modal>
            </QueueAnim>
        )
    }
}

const mapStateToProps = (state: Any.Store, ownProps: TOwnProps): TStateProps => {
    let propsData = state.get('cashOutDetailReducer');
    return {
        businessType: propsData.businessType,
        detailData: propsData.detailData,
        tableData: propsData.tableData.data && propsData.tableData.data.list || [],
        money: propsData.tableData.data && propsData.tableData.data.money,
        visible: propsData.visible,
        total: propsData.total,
        modalType: propsData.modalType,
        // buttonShow: propsData.buttonShow,
        loading: propsData.loading,
        radioState: propsData.radioState,
        accountList: propsData.accountList,
        bankTransferValue: propsData.bankTransferValue,
        checkBankValue: propsData.checkBankValue,
        remitTime: propsData.remitTime,
        checkTime: propsData.checkTime
    }
};

const mapDispatchToProps = (dispatch): TDispatchProps => bindActionCreators(CashOutDetailAction, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(CashOutDetail);