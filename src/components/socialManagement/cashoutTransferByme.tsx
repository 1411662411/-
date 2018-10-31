/**
 * Created by yangws on 2017/5/16.
 */
import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import * as moment from 'moment';
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
    Form,
    message,
    Modal,
    Alert,
    Spin,
    InputNumber,
    Icon,
    Menu,
    Dropdown,
    Badge,
    Upload,
    notification,
} from 'antd';
import { Link } from 'react-router';
import { statePaginationConfig } from '../../util/pagination';
import { DOMAIN_OXT } from '../../global/global';
import '../../css/components/cashoutApproveUi';
import "./../../css/components/cashoutTransferByme";
import { cashoutTransferBymeColumns } from '../../components/common/columns/cashoutTransferBymeColumns';
import { BatchApproval } from '../../components/socialManagement/batchApproveUi';
import { RejectReason } from '../../components/common/cashoutApproveUi';
import { Organizations } from '../../components/common/organizationsUi';
import { EntryInfo } from '../../components/common/payInfoEntryUi';
import { OutputFile } from '../../businessComponents/common/outputFile';
import UploadFile from '../../businessComponents/common/uploadFile';
import {
    cashoutTransferBymeSaga,
    cashoutRejectReasonSaga,
    cashoutCancelSaga,
    userByOrganizationsSaga,
    useMapSaga,
    getProve,
    payentryinfoSaga,
    countNumber,
} from '../../action/socialManagement/cashoutTransferBymeAction';
import { fetchFn } from '../../util/fetch';
import { formatDateTime, accAdd, formatMoney } from '../../util/util';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import { Map, List } from 'immutable'
import { Dispatch } from 'redux';
import { isAbsolute } from 'path';

const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
const { MonthPicker, RangePicker } = DatePicker;
const InputGroup = Input.Group;
const confirm = Modal.confirm;

interface rejectReasonData {
    reason: string;
    files: [
        {
            name: string;
            link: string;
        }
    ]
}
interface selectSource {
    name: string | number;
    value: string | number;
}

// interface CashoutTransferBymeProps {
//     dispatch?: any;
//     location?: any;
//     approvalHandlerData: [any];
//     cashoutSubmitterData: [any];
//     recordsTotal: number;
//     pageSize: number;
//     current: number;

//     edit?: boolean; /* 录入：true 查看: false */
//     bankSource: Array<selectSource>; /* 打款银行名称source */
//     payerSource: Array<selectSource>; /* 付款方名称source */
// }

interface TStateProps {
    dataSource: List<Map<any, any>>;
    // searchParams: Map<any, any>; 
    rejectReasonData: Map<keyof rejectReasonData, any>;
    payInfoEntryData: Map<any, any>;
    userByOrganizationsData: Map<any, any>;
    userMapData: Map<any, any>;
    // cashoutSubmitterData: data.get('cashoutSubmitterData').toJS(),
    // approvalHandlerData: data.get('approvalHandlerData').toJS(),
    waitApproval: number;
    waitPay: number;
    total: number;
    fetching: boolean;
    searchStatus: boolean;
    prove: string; /* 打款证明图片 */
    userInfo: any;
    dataNumber: any;
}
interface transforName {
    planPay: any;
    cashMoney: any;
    planPayTime: any;
    cashoutMoney: number;

}
let datesTimes: any = (new Date(new Date().toLocaleDateString()).getTime()) / 1000

interface TOwnProps {
    /**
     * 角色 0 业务方 1 财务  2 ceo 3 提交请款单列表 4 SP请款付款
     */
    role: 0 | 1 | 2 | 3 | 4
}

type CashoutTransferBymeProps = TStateProps & TOwnProps & { dispatch: Dispatch<any> };
class CashoutTransferByme extends React.Component<CashoutTransferBymeProps, any> {
    // 角色 0 业务方 1 财务  2 ceo 3 提交请款单列表 4 SP请款付款
    role: any;
    sessionStorageSearchParams: any;
    constructor(props) {
        super(props);

        this.role = props.role;
        this.sessionStorageSearchParams = JSON.parse(sessionStorage.getItem('CASHOUT_TRANSFER_BYME_SESSIONSTORAGE')!);
        this.state = {
            searchParams: {
                ...PAGINATION_PARAMS,
                orderCode: '',          // 请款单号
                planPayTime: this.props.role == 4 ? datesTimes : null,      // 计划支付时间
                endTime: null,          // 付款截止时间倒计时
                createEndTime: null,
                createStartTime: null,
                socialPaymentMonth: null,
                amountStart: null,
                amountEnd: null,
                exportStatus: '',       // 导出状态
                socialPayType: '',       //社保业务请款性质
                payeeType: '',          // 收款方类型
                payeeName: '',          // 收款方名称
                cashoutMoney: null,     // 请款总金额
                cashoutSubmitter: '',   // 请款提交人
                approvalHandler: '',    // 审批经手人
                approvalStatus: '',     // 审批状态
                payStatus: this.props.role == 4 ? "0" : "",          // 支付状态
                role: props.role,
                countNumber: 0,
                code: "",
                ...this.sessionStorageSearchParams
            },
            selectedRowKeys: [],  // Check here to configure the default column
            editEntryInfo: false,
            entryInfoCode: {},
            bankSource: [{ name: '招商银行杭州分行萧山支行', value: '招商银行杭州分行萧山支行' }], /* 打款银行名称source */
            payerSource: [{ name: '大连招商银行', value: '大连招商银行' }], /* 付款方名称source */
            rejectReasonVisible: false,
            cancelCashoutModal: false,
            showProvePictureModal: false,
            // editEntryFeching:false,
            attachmentUrl: '',
            searchCount: 0,
            isDisplay: false,
            oneLoading: false,
            twoLoading: false,
            imgCount: 0,
            printModalShow: false,
            printLoading: false,
            printButtonText: '批量打印付款单'
        };
    }



    componentWillMount() {

        // 默认加载
        /**获取员工map 后台列表返回id 前端根据id 显示对应的信息 */
        this.props.dispatch(useMapSaga([]));
        /**获取组织架构 */
        this.props.dispatch(userByOrganizationsSaga({}));
        this.handleSearch();

    }
    timestampToTime(timestamp) {
        let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        let Y = date.getFullYear() + '-';
        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
        let D = date.getDate() + " ";
        let H = "00:";
        let S = "00:";
        let Mini = "00";
        let time3 = Date.parse(Y + M + D + S + H + Mini) / 1000;
        return time3
    }
    // 查询列表
    handleSearch = () => {

        this.setState({
            searchCount: this.state.searchCount + 1,
            selectedRowKeys: [],
        })

        let {
            planPayTime,
            payStatus,
        } = this.state.searchParams;
        if (this.role == 4) {

            if (planPayTime != null && planPayTime != '') {
                if (payStatus == '0' || payStatus == "") {
                    this.countNumber1();
                }
            }



        }
        const {
            amountStart,
            amountEnd
        } = this.state.searchParams;

        if (amountStart && amountEnd && amountStart > amountEnd) {
            message.error('金额上限不得小于金额下限', 5);
            return false;
        }
        let planPayFom
        if (planPayTime == null || planPayTime == "") {
            planPayFom = null;
        } else {
            planPayFom = this.timestampToTime(planPayTime)
        }

        this.props.dispatch(cashoutTransferBymeSaga({ ...this.state.searchParams, planPayTime: planPayFom, ...PAGINATION_PARAMS, role: this.role, code: this.state.searchParams.orderCode }));

        this.getTime();
    };
    /**
     * 格式化整数
     */
    getTime = () => {
        datesTimes = (new Date(new Date().toLocaleDateString()).getTime()) / 1000
    }
    countNumber1 = () => {

        let {
            planPayTime,
            payeeType,
            payeeName,
            cashoutMoney,
            cashoutSubmitter,
            payStatus,
            orderCode,
            approvalHandler,
            exportStatus,
        } = this.state.searchParams;
        let params
        params = {
            planPayTime,
            code: orderCode,
            payeeType,
            payeeName,
            cashoutMoney,
            cashoutSubmitter,
            byHandUserId: approvalHandler,
            payStatus: '0',
            exportWaitpayStatus: 0,
        }



        this.props.dispatch(countNumber(params));


    }

    inputFormatterInt = (data) => {

        const { searchParams } = this.state;

        var reg = /^(-|\+)?\d+$/;
        for (var key in data) {
            let param = data[key];
            if (reg.test(param) || param == "") {
                let newParam = {}
                newParam[key] = param;
                let newSearchParams = {
                    ...searchParams,
                    ...newParam,
                }
                this.setState({ searchParams: newSearchParams });
            }

        }


    }
    /**
     * 跳转链接
     */
    setSessionStorageParams = (params) => {

        sessionStorage.setItem('cashoutApproveDetail', JSON.stringify(params));
        const url = params.url;
        switch (this.role) {
            case 0: {
                browserHistory.push(`${DOMAIN_OXT}/newadmin/social/business/cashout/approve/details`);
                break
            }
            case 1: {
                browserHistory.push(`${DOMAIN_OXT}/newadmin/financial/cashout/approve/details`);
                break
            }
            case 2: {
                browserHistory.push(`${DOMAIN_OXT}/newadmin/ceo/cashout/approve/details`);
                break
            }
            case 3: {

                sessionStorage.setItem('cashoutApproveReSubmit', JSON.stringify(params));
                browserHistory.push(url ? url : `${DOMAIN_OXT}/newadmin/social/cashout/approve/details`);
                break
            }
            case 4: {
                sessionStorage.setItem('spPayment', JSON.stringify(params))
                // sessionStorage.setItem('cashoutApproveReSubmit', JSON.stringify(params));
                browserHistory.push(url ? url : `${DOMAIN_OXT}/newadmin/financial/cashout/payinfo/check`);
                break
            }
            default: {
                // browserHistory.push(`${DOMAIN_OXT}/newadmin/social/cashout/approve/submit`);
            }

        }


    };
    /**
     * 获取驳回原因 
     */
    showRejectReason = (params) => {
        const { code } = params;
        const { dispatch, rejectReasonData } = this.props;
        dispatch(cashoutRejectReasonSaga({
            id: code, type: 'single', callback: () => {
                this.setState({ rejectReasonVisible: true })
            }
        }));
    }
    // cancelCashoutModal:false,
    //     showProvePictureModal:false,
    cancelCashout = (params) => {
        const { orderCode } = params;
        const that = this;
        // const {dispatch} = this.props;
        confirm({
            title: '您是否确定取消该笔请款？',
            content: '取消后将无法恢复。',
            onOk() {
                that.props.dispatch(cashoutCancelSaga({ code: orderCode, callback: that.handleSearch }));
            },
            onCancel() {
            },
        });
        // this.setState({cancelCashoutModal:true})

    }
    // 显示打款证明图片
    showProvePicture = (params) => {
        new Promise((resolve) => {
            this.props.dispatch(getProve({
                resolve,
                code: params.params.orderCode
            }))
        }).then(() => {
            this.setState({ showProvePictureModal: true });
        })
    }



    // 重置

    handleReset = () => {
        const {
            dispatch,
        } = this.props;
        const params = {
            // role:this.role,        //角色
            cashoutSubmitter: '',   //请款提交人
            approvalHandler: '',    //审批经手人
            orderCode: '',          //请款单号
            planPayTime: this.props.role == 4 ? datesTimes : null,
            createEndTime: null,
            createStartTime: null,
            socialPaymentMonth: null,
            amountStart: null,
            amountEnd: null,
            endTime: null,            //付款截止时间倒计时
            exportStatus: '',       //导出状态
            socialPayType: "",             //社保业务请款性质
            cashoutType: '',        //请款方类型
            payeeType: '',          //收款方类型
            payeeName: '',          //收款方名称
            cashoutMoney: null,       //请款总金额
            approvalStatus: '',    // 审批状态
            payStatus: this.props.role == 4 ? "0" : "",         // 支付状态



        };
        this.setState({ searchParams: { ...this.state.searchParams, ...params } });
        sessionStorage.setItem('CASHOUT_TRANSFER_BYME_SESSIONSTORAGE', JSON.stringify({}));

    }


    // 更新缓存查询条件
    handleUpdateCacheSearchParams = (params) => {
        this.props.dispatch(cashoutTransferBymeSaga({ searchStatus: false, ...params, role: this.role }));
    }
    /**
     * 时间选择器配置
     */
    rangePickerProps = () => {
        const {
            createEndTime,
            createStartTime,
        } = this.state.searchParams;
        let props: {
            format: string;
            onChange(x: any, y: any): void;
            value?: [any, any];
        } = {
                format: 'YYYY-MM-DD',
                onChange: (data, timeString) => {
                    if (data.length > 1) {
                        // 后台需要起始日期时间为零点结束时间为24点
                        this.setSearchParamState({ createStartTime: moment(timeString[0] + ' 00:00:00').format('X'), createEndTime: moment(timeString[1] + ' 23:59:59').format('X') })
                    } else {
                        this.setSearchParamState({ createStartTime: null, createEndTime: null })
                    }

                }
            }
        if (createEndTime && createStartTime) {
            props.value = [moment(createStartTime * 1000), moment(createEndTime * 1000)];
        } else {
            props.value = [null, null];
        }
        return props;
    }
    // change = (value, dateString)=>{

    //     const {
    //         planPayTime,
    //     } = this.state.searchParams;
    //     this.setState({
    //         planPayTime: value.format("X")
    //     })

    // }
    monthPickerProps = () => {
        const {
            socialPaymentMonth,
        } = this.state.searchParams;
        let props: {
            onChange(x: any, y: any): void;
            value?: any;
        } = {
                onChange: (data, dateString) => this.setSearchParamState({ socialPaymentMonth: dateString })
            }
        if (socialPaymentMonth) {
            props.value = moment(socialPaymentMonth);
        } else {
            props.value = null;
        }
        return props;
    }
    onMonthPickerChange = (date, dateString) => {
        this.setSearchParamState({ 'socialPaymentMonth': dateString })
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
        const setCurrentPage = (currentPage, pageSize) => {
            this.setState({selectedRowKeys: []})
            this.setSearchParamState({ 'currentPage': currentPage, 'pageSize': pageSize })
        }
        return statePaginationConfig({ ...searchParams, currentPage, total, pageSize, role: this.role }, cashoutTransferBymeSaga, dispatch, setCurrentPage)
    }


    // 更新搜索条件state
    setSearchParamState = (param) => {
        const { searchParams } = this.state;
        let newSearchParams = {
            ...searchParams,
            code: param.orderCode,
            ...param,
        }
        this.setState({
            searchParams: newSearchParams
        })
        return newSearchParams;
    }
    setSingleState = (param) => {

        this.setState(param);
    }
    modalProps = () => {
        const { rejectReasonVisible } = this.state;



        return {
            visible: rejectReasonVisible,
            closable: false,
            footer: (<Button type="primary" onClick={this.modalHandleCancel}>知道了</Button>)

        }
    }
    modalHandleCancel = () => {
        this.setState({ rejectReasonVisible: false });
    };
    // 显示驳回原因
    handleOpenAttachment = (url) => {
        let checkUrl = /http(s)?:\/\/([\w-]+\.)+[\w-]+(\/[\w- .\/?%&=]*)?/;
        if (checkUrl.test(url)) {
            this.setState({ attachmentUrl: url });
        } else {
            message.error("下载地址有误", 5);
        }

    };
    // 今天计划支付
    onTodayPay = (e) => {
        e.preventDefault;

        const searchParams = this.setSearchParamState({ planPayTime: moment(moment().format('YYYY-MM-DD')).format('X') });

        this.props.dispatch(cashoutTransferBymeSaga({ ...searchParams, role: this.role }));

    }
    // 打款信息录入
    editPlayShallInfo = (data) => {
        const { code } = data;
        this.props.dispatch(cashoutRejectReasonSaga({
            id: code,
        }));
        this.setState({ 'editEntryInfo': true, entryInfoCode: code })

        // const { payInfoEntryData } = this.props;

        // this.setState({ 'editEntryInfo': true, 'entryInfoSource': payInfoEntryData.toJS() });
        return
    }
    handleModalCancel = () => {
        this.setState({ 'editEntryInfo': false });
    }
    EntryInfo: any;
    handleModalOk = () => {

        const { entryInfoCode } = this.state;
        // 
        const result = this.EntryInfo.validate();
        if (result !== false) {
            let params;
            let {
                type,
                bank,
                paytime,
                serialNumber,
                attachment,
                payer,
                accountNumber,
                checkNumber,
                invoicingTime,
                payBankAccount,
            } = result;
            type = 1; // v241sp 暂时去除支票类型
            if (type === 1) {
                params = {
                    type,
                    payBankName: bank,
                    payBankAccount,
                    serialNumber,
                    payTime: paytime.format('YYYY-MM-DD HH:mm'),
                    url: attachment.length > 0 ? attachment[0].ossKey : undefined,
                    code: entryInfoCode,
                    callback: () => {
                        // this.setState({editEntryFeching:false});
                        this.handleModalCancel();
                    }
                }
            }
            else {
                params = {
                    type,
                    payerName: payer,
                    drawerAccount: accountNumber,
                    payBankAccount,
                    checkNumber,
                    openTicketTime: invoicingTime.format('YYYY-MM-DD HH:mm'),
                    url: attachment.length > 0 ? attachment[0].ossKey : undefined,
                    code: entryInfoCode,
                    callback: () => {
                        // this.setState({editEntryFeching:false});
                        this.handleModalCancel();
                    }
                }
            }
            // this.setState({editEntryFeching:true});
            this.props.dispatch(payentryinfoSaga(params));
        }

    }

    entryInfoProps = () => {
        const {

            payInfoEntryData,
        } = this.props;
        const { bankSource, payerSource } = this.state;

        return {

            ref: node => this.EntryInfo = node,
            bankSource,
            payerSource,
            edit: true,
            ...payInfoEntryData.toJS()
        }

    }
    handleChangeExportStatus = (isExporting: boolean) => {
        this.setState({ isExporting: isExporting })
        let {
            planPayTime,
            payStatus,
        } = this.state.searchParams;
        if (this.role == 4) {
            if (payStatus == '0' || payStatus == "") {
                this.countNumber1();
            }
        }
    }

    handleVerifyBefore = () => {

        const {
            planPayTime,
            payStatus,
            role,
        } = this.state.searchParams;
        if (role == 4) {
            if (planPayTime == null || planPayTime == '') {
                message.error('请选择计划支付时间')

                return false
            }
            if (payStatus == '1') {
                notification.error({
                    type: 'error',
                    message: '提醒',
                    description: '没有可导出的记录',

                });

                return false
            }
        }
        return true
    }
    onSelectChange = (selectedRowKeys) => {
        this.setState({ selectedRowKeys });
    }
    handleLoading = (event) => {
        this.setState({ email: event.target.value });
    }
    tableRowClassName = (record, index) => {
        //  0：待审批 1：审批通过 2：审批驳回 3：已取消
        return record.status == 2 ? 'tr-grey' : ''

    }
    datePickerProps = () => {
        const planPayTime = this.state.searchParams.planPayTime;
        let props: any = {
            style: { widht: 200 },
            onChange: (date: any, dateStrings: string) => this.setSearchParamState({ planPayTime: dateStrings }),
        };

        if (planPayTime) {
            props.value = moment(planPayTime)
        }


        return props;
    }
    batchPrint = async () => {
        const max = 60;
        const selectedRowKeys = this.state.selectedRowKeys;
        if (selectedRowKeys.length <= 0) {
            return message.error('请选择要打印的请款单');
        }
        if (selectedRowKeys.length > max) {
            return message.error(`每次最多支持打印${max} 个付款单`);
        }
        this.setState({
            printLoading: true,
            printButtonText: '需要打印的请款单生成中...'
        }, async () => {
            const data = await fetchFn(`${DOMAIN_OXT}/apiv3_/v1/sppay/print/batch`, selectedRowKeys, {
                headers: { 'Content-Type': 'application/json' }
            });

            if(data.status === 0) {
                this.setState({
                    printModalShow: true,
                    printLoading: false,
                    printButtonText: '批量打印付款单',
                    printUrl: data.data,
                });
            }
            else {
                this.setState({
                    printLoading: false,
                    printButtonText: '批量打印付款单'
                });
                message.error(data.errmsg || '需要打印的请款单生成失败')   
            }
        })
        
        
        
    }
    tableProps = () => {
        const {
            role,
            dataSource,
            fetching,
            userMapData,
        } = this.props;
        let props: any = {
            rowKey: (record: any) => record.code,
            dataSource: dataSource.toJS(),
            loading: fetching,
            pagination: this.pagination(),
            rowClassName: this.tableRowClassName,
        }
        const { selectedRowKeys } = this.state;


        let tableCallback = {
            setSessionStorageParams: this.setSessionStorageParams,
            showRejectReason: this.showRejectReason,
            cancelCashout: this.cancelCashout,
            showProvePicture: this.showProvePicture,
            editPlayShallInfo: this.editPlayShallInfo,
            userMapData: userMapData.toJS() || {},
            role: role,
        }
        const scrollY = window.innerHeight * 0.6;
        const columns = cashoutTransferBymeColumns(tableCallback);
        switch (role) {
            case 0: {
                columns.splice(20, 1);
                columns.splice(15, 1);
                columns.splice(14, 1);
                columns.splice(13, 1);
                columns.splice(12, 1);
                columns.splice(11, 1);
                columns.splice(10, 1);
                columns.splice(6, 1);
                columns.splice(5, 1);
                columns.splice(1, 1);
                props = {
                    ...props,
                    scroll: { x: 2075, y: scrollY },
                    columns,
                }
                break;
            }
            case 1: {
                columns.splice(20, 1)
                const rowSelection = {
                    selectedRowKeys,
                    onChange: this.onSelectChange,
                };
                props = {
                    ...props,
                    rowSelection,
                    scroll: { x: 3150, y: scrollY },
                    columns,
                }
                break;
            }
            case 2: {
                columns.splice(20, 1);
                columns.splice(6, 1);
                columns.splice(5, 1);
                props = {
                    ...props,
                    scroll: { x: 2896, y: scrollY },
                    columns,
                }
                break;
            }
            case 3: {
                columns.splice(20, 1);
                columns.splice(17, 1);
                columns.splice(14, 1);
                columns.splice(13, 1);
                columns.splice(12, 1);
                columns.splice(11, 1);
                columns.splice(10, 1);
                columns.splice(6, 1);
                columns.splice(5, 1);
                columns.splice(1, 1);
                props = {
                    ...props,
                    scroll: { x: 2055, y: scrollY },
                    columns,
                }
                break;
            }
            case 4: {
                columns.splice(19, 1);
                columns.splice(14, 1);
                columns.splice(13, 1);
                columns.splice(12, 1);
                columns.splice(11, 1);
                columns.splice(10, 1);
                columns.splice(6, 1);
                columns.splice(5, 1);
                const rowSelection = {
                    selectedRowKeys,
                    onChange: this.onSelectChange,
                };
                props = {
                    ...props,
                    scroll: { x: 2346, y: scrollY },
                    columns,
                    rowSelection,
                }

                break;
            }
        }

        return props;
    }
    render() {
        const {
            dispatch,
            dataSource,
            fetching,
            searchStatus,
            userByOrganizationsData,
            // cashoutSubmitterData,
            // approvalHandlerData,
            rejectReasonData,
            waitApproval,
            waitPay,
            userMapData,
            prove,
            payInfoEntryData,
            dataNumber,
        } = this.props;
        const newUserByOrganizationsData = userByOrganizationsData.toJS();
        const { searchParams, attachmentUrl, rejectReasonVisible, selectedRowKeys } = this.state;

        const {
            orderCode,          // 请款单号
            createEndTime,
            createStartTime,
            socialPaymentMonth,
            amountStart,
            amountEnd,
            planPayTime,        // 计划支付时间
            endTime,            // 付款截止时间倒计时
            exportStatus,       // 导出状态
            socialPayType,      //社保业务请款性质
            payeeType,          // 收款方类型
            payeeName,          // 收款方名称
            cashoutMoney,       // 请款总金额
            cashoutSubmitter,   // 请款提交人
            approvalHandler,    // 审批经手人
            approvalStatus,     // 审批状态
            payStatus,          // 支付状态
        } = searchParams;

        const role = this.role;
        console.log(role)
        // let tableCallback = {
        //     setSessionStorageParams: this.setSessionStorageParams,
        //     showRejectReason: this.showRejectReason,
        //     cancelCashout: this.cancelCashout,
        //     showProvePicture: this.showProvePicture,
        //     editPlayShallInfo: this.editPlayShallInfo,
        //     userMapData: userMapData.toJS() || {},
        //     role: role,
        // }
        // const columns = cashoutTransferBymeColumns(tableCallback);
        // let newColumns = columns;
        // if(role==0){
        //     newColumns.splice(20, 1) 
        //     newColumns.splice(15, 1) 
        //     newColumns.splice(14, 1)
        //     newColumns.splice(13, 1)
        //     newColumns.splice(12, 1)
        //     newColumns.splice(11, 1)
        //     newColumns.splice(10, 1)
        //     newColumns.splice(6, 1)
        //     newColumns.splice(5, 1)
        //     newColumns.splice(1, 1)
        // }
        // if(role==1){
        //     newColumns.splice(20, 1) 
        // }
        // if (role == 2) {
        //     newColumns.splice(20, 1)
        //     newColumns.splice(6, 1)
        //     newColumns.splice(5, 1)
        // }
        // if(role==3){
        //     newColumns.splice(20, 1)
        //     newColumns.splice(17, 1)
        //     newColumns.splice(14, 1)
        //     newColumns.splice(13, 1)
        //     newColumns.splice(12, 1)
        //     newColumns.splice(11, 1)
        //     newColumns.splice(10, 1)
        //     newColumns.splice(6, 1)
        //     newColumns.splice(5, 1)
        //     newColumns.splice(1, 1)
        // }
        // if(role==4){
        //     newColumns.splice(19, 1)
        //     newColumns.splice(14, 1)
        //     newColumns.splice(13, 1)
        //     newColumns.splice(12, 1)
        //     newColumns.splice(11, 1)
        //     newColumns.splice(10, 1)
        //     newColumns.splice(6, 1)
        //     newColumns.splice(5, 1)
        // }
        // const rowSelection = {
        //     selectedRowKeys,
        //     onChange: this.onSelectChange,


        // };

        const hasSelected = selectedRowKeys.length > 0;
        const byBankUrl = `${DOMAIN_OXT}/apiv2_/pleasepay/v1/sppay/payInfoImport/byBank`;//导入网银流水
        const quickUrl = `${DOMAIN_OXT}/apiv2_/pleasepay/v1/sppay/payInfoImport/quick`;//导入流水号、打款时间
        const pollUrl = `${DOMAIN_OXT}/apiv4_/v1/sppayu/upload/file`;//进度
        const typeNumber = 0;
        const props1 = {
            name: 'file',
            action: pollUrl,
            headers: {
                authorization: 'authorization-text',
            },
            className: "del-list",

            beforeUpload: (file) => {
                file.status = 'uploading';
                this.setState({ oneLoading: true });
                if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                    return true;
                } else {
                    this.setState({ oneLoading: false })
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '导入格式错误,请上传.xls或.xlsx文件',

                    });
                    return false
                }

            },
            onChange: (info) => {
                if (info.file.status !== 'uploading') {

                    const parmas = {
                        ossKey: info.file.response.data.ossKey,
                        fileName: info.file.name,
                    }
                    return new Promise((resolve, reject) => {
                        fetchFn(quickUrl, parmas, undefined, typeNumber).then(data => data).then((data: any) => {
                            if (data.status == 0 && data.errcode == 0) {
                                this.setState({ oneLoading: false })
                                Modal.success({
                                    cancelText: '知道了',
                                    title: '导入成功',
                                    content: (
                                        <div>
                                            <p>本次共上传了{data.data.success}条数据</p>
                                        </div>
                                    ),
                                });
                            } else {
                                this.setState({ oneLoading: false })
                            }

                        });
                    })


                }
            },
        };
        const props2 = {
            name: 'file',
            action: pollUrl,
            headers: {
                authorization: 'authorization-text',
            },
            className: "del-list",
            beforeUpload: (file) => {
                file.status = 'uploading';
                this.setState({ twoLoading: true });
                if (file.name.split('.').pop() == 'xls' || file.name.split('.').pop() == 'xlsx') {
                    return true;
                } else {
                    this.setState({ twoLoading: false })
                    notification.error({
                        type: 'error',
                        message: '提醒',
                        description: '导入格式错误,请上传.xls或.xlsx文件',

                    });
                    return false
                }

            },
            onChange: (info) => {
                if (info.file.status !== 'uploading') {

                    const parmas = {
                        ossKey: info.file.response.data.ossKey,
                        fileName: info.file.name,
                    }
                    return new Promise((resolve, reject) => {
                        fetchFn(byBankUrl, parmas, undefined, typeNumber).then(data => data).then((data: any) => {
                            if (data.status == 0 && data.errcode == 0) {
                                this.setState({ twoLoading: false })
                                Modal.success({
                                    cancelText: '知道了',
                                    title: '导入成功',
                                    content: (
                                        <div>
                                            <p>本次共上传了{data.data.success}条数据</p>
                                        </div>
                                    ),
                                });
                            } else {
                                this.setState({ twoLoading: false })
                            }

                        });
                    })


                }
            },
        };

        return (
            <QueueAnim>

                <div key="cashoutTransferByme" className="wrapper-content">
                    {role === 4 && <Row style={{ marginBottom: 15 }}>
                        <Col span={12}>
                            <a className="todayPay" onClick={this.onTodayPay}>今天计划支付</a>
                        </Col>
                    </Row>}
                    <Row className="search-group">


                        <Form layout="inline" className="search-form">

                            {
                                (role == 1 || role == 3 || role == 4) && (<FormItem style={{ marginBottom: 8 }} label="请款单号： ">
                                    <Input
                                        style={{ width: 180 }}
                                        placeholder=""
                                        value={orderCode}
                                        onChange={(e: any) => { this.setSearchParamState({ orderCode: e.target.value }) }}
                                    />
                                </FormItem>)
                            }
                            {
                                (role == 3) && (<FormItem style={{ marginBottom: 8 }} label="创建时间： ">
                                    <RangePicker {...this.rangePickerProps() } />
                                </FormItem>)
                            }
                            {(role == 1 || role == 2 || role == 4) && (
                                <FormItem style={{ marginBottom: 8 }} label={(role == 4) ? "财务计划支付时间（最晚时间）： " : "财务计划支付时间"}>
                                    <DatePicker
                                        style={{ width: 200 }}
                                        format="YYYY-MM-DD "
                                        value={(planPayTime ? moment(planPayTime * 1000) : planPayTime)}
                                        onChange={(date: any, dateStrings: string) => { this.setSearchParamState({ planPayTime: dateStrings ? date.format('X') : dateStrings }) }}
                                    // onChange={(date: any, dateStrings: string) =>this.change(date, dateStrings)}
                                    />
                                    {/*style={{ width: 180 }}
                                        placeholder=""
                                        
                                        onChange: (date: any, dateStrings: string) => this.setSearchParamState({ planPayTime: dateStrings }),
                                        value={planPayTime ? moment(planPayTime) : null}
                                        onChange={(date: any, dateStrings: string) => { this.setSearchParamState({ planPayTime: dateStrings }) }}*/}
                                </FormItem>)}
                            {(role == 1 || role == 2) && (
                                <FormItem style={{ marginBottom: 8 }} label="客服计划付款时间倒计时： ">
                                    <Input
                                        prefix="≤"
                                        addonAfter="天"
                                        placeholder=""

                                        style={{ width: 180 }}
                                        value={endTime}
                                        onChange={(e: any) => { this.inputFormatterInt({ endTime: e.target.value }) }}
                                    />
                                </FormItem>)}
                            {role == 1 && (
                                <FormItem style={{ marginBottom: 8 }} label="导出状态：">
                                    <Select
                                        value={exportStatus}
                                        style={{ width: 100 }}
                                        onChange={value => { this.setSearchParamState({ exportStatus: value }) }}
                                    >
                                        <option value=''>全部</option>
                                        <option value='1'>已导出</option>
                                        <option value='0'>未导出</option>

                                    </Select>

                                </FormItem>)}
                            {role == 1 && (
                                <FormItem style={{ marginBottom: 8 }} label="社保业务请款性质:">
                                    <Select
                                        value={socialPayType}
                                        style={{ width: 100 }}
                                        onChange={value => { this.setSearchParamState({ socialPayType: value }) }}
                                    >
                                        <option value=''>全部</option>
                                        <option value='1'>实付请款</option>
                                        <option value='2'>预付请款</option>

                                    </Select>

                                </FormItem>)}
                            {(role == 1 || role == 2 || role == 4) && (
                                <FormItem style={{ marginBottom: 8 }} label="收款方类型：" >
                                    <Select
                                        value={payeeType}
                                        style={{ width: 100 }}
                                        onChange={value => { this.setSearchParamState({ payeeType: value }) }}
                                    >
                                        <option value=''>全部</option>
                                        <option value='1'>服务商</option>
                                        <option value='2'>分公司</option>
                                    </Select>

                                </FormItem>)}
                            {(role == 3 || role == 1 || role == 2 || role == 4) && (
                                <FormItem style={{ marginBottom: 8 }} label="收款方名称： ">
                                    <Input
                                        style={{ width: 250 }}
                                        placeholder=""
                                        value={payeeName}
                                        onChange={(e: any) => { this.setSearchParamState({ payeeName: e.target.value }) }}
                                    />
                                </FormItem>)}
                            {(role == 3) && (
                                <FormItem style={{ marginBottom: 8 }} label={<span>社保缴费月(操作月)</span>}>
                                    <MonthPicker  {...this.monthPickerProps() } />
                                </FormItem>)}
                            {
                                (role == 3) && (<FormItem style={{ marginBottom: 8 }} label="请款总金额： ">
                                    <InputGroup compact>

                                        <InputNumber
                                            style={{ width: 110, textAlign: 'center', margin: 0 }}
                                            max={999999999}

                                            value={amountStart}
                                            onChange={(value) => { this.setSearchParamState({ amountStart: value }) }}
                                            placeholder="请输入" />
                                        <Input style={{ width: 32, borderLeft: 0, pointerEvents: 'none' }} disabled={true} placeholder="~" />
                                        <InputNumber
                                            style={{ width: 110, textAlign: 'center', borderLeft: 0, margin: 0 }}


                                            value={amountEnd}
                                            onChange={(value) => { this.setSearchParamState({ amountEnd: value }) }}
                                            placeholder="请输入" />
                                    </InputGroup></FormItem>)
                            }
                            {(role == 1 || role == 4) && (
                                <FormItem style={{ marginBottom: 8 }} label="请款总金额： ">
                                    <InputNumber
                                        style={{ width: 180 }}
                                        placeholder=""
                                        value={cashoutMoney}
                                        onChange={(e: any) => { this.setSearchParamState({ cashoutMoney: e }) }}
                                    />
                                </FormItem>)}
                            {(role == 1 || role == 0 || role == 4) && (
                                <FormItem style={{ marginBottom: 8 }} label="请款提交人：">

                                    <Organizations
                                        initValue={cashoutSubmitter}
                                        onChange={value => { this.setSearchParamState({ cashoutSubmitter: value }) }}
                                        dataSource={newUserByOrganizationsData[0]}>
                                    </Organizations>
                                </FormItem>)}
                            {(role !== 3 && role !== 4) &&
                                <FormItem style={{ marginBottom: 8 }} label="审批经手人：">
                                    <Organizations
                                        initValue={approvalHandler}
                                        onChange={value => { this.setSearchParamState({ approvalHandler: value }) }}
                                        dataSource={newUserByOrganizationsData[0]}>
                                    </Organizations>

                                </FormItem>
                            }
                            {role < 4 && <FormItem style={{ marginBottom: 8 }} label="审批状态：">
                                <Select
                                    value={approvalStatus}
                                    style={{ width: 100 }}
                                    onChange={value => { this.setSearchParamState({ approvalStatus: value }) }}
                                >
                                    <option value=''>全部</option>
                                    <option value='0'>待审批</option>
                                    <option value='1'>审批通过</option>
                                    <option value='2'>审批驳回</option>
                                    <option value='3'>已取消</option>


                                </Select>

                            </FormItem>}


                            <FormItem style={{ marginBottom: 8 }} label="支付状态：">
                                <Select
                                    value={payStatus}
                                    style={{ width: 100 }}
                                    onChange={value => { this.setSearchParamState({ payStatus: value }) }}
                                >
                                    <option value=''>全部</option>
                                    <option value='0'>未支付</option>
                                    <option value='1'>已支付</option>


                                </Select>

                            </FormItem>
                            <Button type="primary" style={{ marginTop: 5 }} onClick={e => this.handleSearch()}>搜索</Button>
                            {(role == 3 || role == 1 || role == 2 || role == 4) && (<Button style={{ marginLeft: 8, marginTop: 5 }} onClick={e => this.handleReset()}>重置</Button>)}

                        </Form>




                    </Row>
                    {
                        (role == 4) && <Row type="flex" justify="start">

                            <OutputFile
                                outputParams={{
                                    "byHandUserId": this.state.searchParams.approvalHandler,
                                    "cashoutMoney": this.state.searchParams.cashoutMoney,
                                    "cashoutSubmitter": this.state.searchParams.cashoutSubmitter,
                                    "code": this.state.searchParams.orderCode,
                                    "payStatus": this.state.searchParams.payStatus,
                                    "payeeName": this.state.searchParams.payeeName,
                                    "payeeType": this.state.searchParams.payeeType,
                                    "planPayTime": this.state.searchParams.planPayTime,
                                    "exportWaitpayStatus": 0
                                }}
                                contentType='application/json'
                                outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/tobepaid`}
                                downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                callback={this.handleChangeExportStatus}
                                pollUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
                                pollData={{ type: 7, userId: this.props.userInfo.userId }}
                                type={1}
                                role={role}
                                beforeOutput={this.handleVerifyBefore}
                            >
                                <Button icon="download">
                                    导出付款信息
                                    </Button>
                            </OutputFile>


                            {(role == 4 && this.state.searchParams.planPayTime) ? <p style={{ marginLeft: 20, lineHeight: "32px" }}>
                                在该财务计划支付时间范围内，有<span style={{ color: "red" }}>{(this.state.searchParams.payStatus == '0' || this.state.searchParams.payStatus == '') ? this.props.dataNumber : 0}</span>个请款单需要导出。
                                </p> : null}

                        </Row>
                    }
                    {
                        (role == 4) && <Row style={{ marginTop: 20 }}>
                            <Col span={22}>
                                <Col style={{ marginRight: 20, float: "left" }}>
                                    <Upload {...props2}>
                                        <Spin spinning={this.state.twoLoading}>
                                            <Button icon="upload" className="ant-dropdown-link">
                                                导入网银流水
                                            </Button>
                                        </Spin>
                                    </Upload>
                                </Col>
                                <Col style={{ float: "left" }}>
                                    <Upload {...props1}>
                                        <Spin spinning={this.state.oneLoading}>
                                            <Button icon="upload" className="ant-dropdown-link">
                                                导入流水号、打款时间
                                        </Button>
                                        </Spin>
                                    </Upload>
                                </Col>
                            </Col>
                            <Col>
                                {(role == 4) ? <Link style={{ float: 'right' }} to={`${DOMAIN_OXT}/newadmin/financial/cashout/payinfo/records`}>查看导出导入历史</Link> : {}}
                            </Col>
                        </Row>
                    }

                    {
                        role == 3 && (
                            <Row>
                                <Col span={12}>
                                    <p>待审批：<span className="text-money">{waitApproval}</span>，审批通过，未支付：<span className="text-money">{waitPay}</span></p>
                                </Col>
                            </Row>

                        )
                    }
                    <QueueAnim type="bottom" delay="300">
                        <div key="1-1" style={{ marginTop: '20px', position: 'relative' }}>
                            <Table {...this.tableProps() } />
                            {role === 4 && this.props.dataSource.size > 0 && <Button type="primary" style={{ position: 'absolute', left: 0, bottom: 16 }} onClick={this.batchPrint} loading={this.state.printLoading}>{this.state.printButtonText}</Button>}
                            {/* {role == 1 ? <Table columns={newColumns}
                                rowKey={(record: any) => record.code}
                                rowSelection={rowSelection}
                                rowClassName={this.tableRowClassName}
                                dataSource={dataSource.toJS()}
                                loading={fetching}
                                scroll={{ x: 3150, y: window.innerHeight * 0.6 }}
                                pagination={this.pagination()}
                            /> : <Table columns={newColumns}
                                rowKey={(record: any) => record.code}
                                rowClassName={this.tableRowClassName}
                                dataSource={dataSource.toJS()}
                                loading={fetching}
                                scroll={{ x: (role == 2 ? 2896 : (role == 3 ? 2055 : (role==4)?2346:2075)), y: window.innerHeight * 0.6 }}
                                pagination={this.pagination()}
                                />} */}
                            {role == 1 &&
                                <OutputFile
                                    outputParams={selectedRowKeys}
                                    contentType='application/json'
                                    outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/bill/customer`}
                                    downloadUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                    callback={this.handleChangeExportStatus}
                                    pollUrl={`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
                                    pollData={{ type: 4, userId: this.props.userInfo.userId }}
                                    type={1}
                                >

                                    <Button type="primary" disabled={!hasSelected}>批量导出付款清单（客户维度）与垫款明细</Button>
                                </OutputFile>}



                            <Modal {...this.modalProps() }  >
                                <RejectReason rejectReasonData={rejectReasonData.toJS()} key={Date.now()} />
                            </Modal>
                            <Modal
                                key={this.state.imgCount}
                                title="打款证明图片"
                                width={700}
                                wrapClassName="vertical-center-modal"
                                visible={this.state.showProvePictureModal}
                                onCancel={e => { this.setSingleState({ showProvePictureModal: false, imgCount: this.state.imgCount + 1, }) }}
                                footer={<Button type="primary" onClick={() => { this.setSingleState({ showProvePictureModal: false }) }}>关闭</Button>}
                            >
                                <img src={prove} alt="打款证明图片" width="100%" />
                            </Modal>
                            {payInfoEntryData && <Modal
                                visible={this.state.editEntryInfo}
                                title="编辑打款信息"
                                onCancel={this.handleModalCancel}
                                onOk={this.handleModalOk}
                                okText="确定"
                            >

                                <Spin spinning={fetching} >
                                    <EntryInfo {...this.entryInfoProps() } key={Date.now()} vertical={true}/>
                                </Spin>
                            </Modal>}
                            {/**/}
                        </div>


                    </QueueAnim>

                </div>

                <Modal 
                    width={300}
                    maskClosable={false}
                    title="提示" 
                    visible={this.state.printModalShow}
                    onCancel={() => this.setState({printModalShow: false})}
                    footer={[
                        <a className="ant-btn ant-btn-primary" href={this.state.printUrl} target="_blank">好的立刻前往打印</a>,
                    ]}
                >
                    <Icon type="check-circle" style={{color: '#52c41a', fontSize: 22, marginRight: 16, float: 'left', minHeight: 48,}} />需要打印的请款单已经准备好了。
                </Modal>
            </QueueAnim>

        )
    }
}


function mapStateToProps(state: Any.Store, ownProps: TOwnProps): TStateProps {
    const data = state.get('cashoutTransferByme');
    return {
        dataSource: data.get('dataSource'),
        dataNumber: data.get('dataNumber'),
        // searchParams: data.get('searchParams').toJS(),
        rejectReasonData: data.get('rejectReasonData'),
        payInfoEntryData: data.get('payInfoEntryData'),
        userByOrganizationsData: data.get('userByOrganizationsData'),
        userMapData: data.get('userMapData'),
        // cashoutSubmitterData: data.get('cashoutSubmitterData').toJS(),
        // approvalHandlerData: data.get('approvalHandlerData').toJS(),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        waitApproval: data.get('waitApproval'),
        waitPay: data.get('waitPay'),
        total: data.get('total'),
        fetching: data.get('fetching'),
        searchStatus: data.get('searchStatus'),
        prove: data.get('prove'),
    }
}

export default connect(mapStateToProps)(CashoutTransferByme);




