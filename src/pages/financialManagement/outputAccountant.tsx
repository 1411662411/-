import * as React from 'react';
import * as QueueAnim from "rc-queue-anim/lib";
import { connect } from 'react-redux';
import * as moment from 'moment';
import { 
    Tabs, 
    Button, 
    Select, 
    Input, 
    Table, 
    Row, 
    Col,
    Form,
    DatePicker,
    Tooltip,
    message,
    Spin,
    Modal,
    Progress,
    Alert,
    InputNumber,
} from 'antd';
import {
    outputAccountant,
    updateSearchParams,
    outPutRecord,
    updataProgress,
    tabPaneChange,
} from '../../action/financialManagement/outputAccountantAction';
import { ROUTER_PATH,DOMAIN_OXT,WSS,HE_XIAO_DOMAIN } from '../../global/global';
import { OutputFile } from '../../businessComponents/common/outputFile';
import {
    FormComponentProps,
} from 'antd/lib/form/Form';
import '../../css/financialManagement/earningAccountant';

const RangePicker = DatePicker.RangePicker
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;

/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};


// interface OutputAccountantProps {
//     dispatch: any;
//     index: any;
//     pane1: any;
//     pane2: any;
//     userInfo: any;
//     isFetching: boolean;
//     progress: any;
//     form?: any;

    
// }


interface TStateProps {
    index: any;
    pane1: any;
    pane2: any;
    pane3: any;
    pane4: any;
    userInfo: any;
    isFetching: boolean;
    progress: any;
}
interface TOwnProps {
    location?: any;
}
interface TDispatchProps {
    dispatch?: any;
}
type OutputAccountantProps  = TStateProps & TDispatchProps;
class OutputAccountant extends React.Component<OutputAccountantProps & FormComponentProps, any> {
    columns: Array<any> = [
        // sp
        [
            {
                title: '序号',
                dataIndex: null,
                key: 'sequenceNumber',
                width: 50,
                render: (data, record,index ) => {
                    return index+1

                },
            },{
                title: '付款日期',
                dataIndex: 'payDate',
                key: 'payDate',
                width: 100,
                render: (data) => {
                    return moment(data * 1000).format('YYYY-MM-DD')
                }
                // fixed: 'left',
            },{
                title: '请款单号',
                dataIndex: 'code',
                key: 'code',
                width: 200,
                render: (data) => {
                    return <span>{data}</span>
                }
            },
            {
                title: '付款流水号',
                dataIndex: 'paySerialNumber',
                key: 'paySerialNumber',
                width: 200,
                // fixed: 'left',
            },
            {
                title: '付款银行账户名称',
                dataIndex: 'payBankAccountName',
                key: 'payBankAccountName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'left',
            },
            {
                title: '付款银行账号',
                dataIndex: 'payBankAccount',
                key: 'payBankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '收款方名称',
                dataIndex: 'payeeName',
                key: 'payeeName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '对应客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '摘要',
                dataIndex: 'summary',
                key: 'summary',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 200,
            },
            {
                title: '财务科目内容',
                dataIndex: 'financeSubjectContent',
                key: 'financeSubjectContent',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '科目编码',
                dataIndex: 'subjectCode',
                key: 'subjectCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '金额',
                dataIndex: 'moneyAmount',
                key: 'moneyAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '辅助核算1',
                dataIndex: 'assistCount1',
                key: 'assistCount1',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '辅助核算2',
                dataIndex: 'assistCount2',
                key: 'assistCount2',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '辅助核算3',
                dataIndex: 'assistCount3',
                key: 'assistCount3',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '辅助核算4',
                dataIndex: 'assistCount4',
                key: 'assistCount4',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style:any = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '签约主体',
                dataIndex: 'signingSubject',
                key: 'signingSubject',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
            {
                title: '签约主体编码',
                dataIndex: 'signingSubjectCode',
                key: 'signingSubjectCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
        ],
            // 天吴明细表
        [
            {
                title: '序号',
                dataIndex: null,
                key: 'sequenceNumber',
                width: 50,
                render: (data, record,index ) => {
                    return index+1

                },
            },
            {
                title: '付款日期',
                dataIndex: 'paymentTime',
                key: 'paymentTime',
                width: 100,
                render:(data)=> {
                        let date = new Date(data * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                        let Y = date.getFullYear() + '-';
                        let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                        let D = date.getDate() ;
                       
                        let time3 = Y + M + D ;
                        return time3
                    
                }
                // fixed: 'left',
            },
            {
                title: '请款单号',
                dataIndex: 'prepaymentsCode',
                key: 'prepaymentsCode',
                width: 200,
                render: (data) => {
                    return <span>{data}</span>
                }
            },
            {
                title: '付款流水号',
                dataIndex: 'bankSeqNumber',
                key: 'bankSeqNumber',
                width: 200,
                // fixed: 'left',
            },
            {
                title: '付款银行账户名称',
                dataIndex: 'bankAccountName',
                key: 'bankAccountName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'left',
            },
            {
                title: '付款银行账号',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '收款方名称',
                dataIndex: 'payeeName',
                key: 'payeeName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '收款方编码',
                dataIndex: 'payeeCode',
                key: 'payeeCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '对应客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '对应客户编码',
                dataIndex: 'customerCode',
                key: 'customerCode',
                render: (data) => {
                    data = isEmpty(data);

                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                    
                },
                width: 150,
            },
            {
                title: '财务科目内容',
                dataIndex: 'financeSubject',
                key: 'financeSubject',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '科目编码',
                dataIndex: 'financeSubjectCode',
                key: 'financeSubjectCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '金额',
                dataIndex: 'paymentAmount',
                key: 'paymentAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '摘要',
                dataIndex: 'abstracts',
                key: 'abstracts',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '签约主体',
                dataIndex: 'signOwner',
                key: 'signOwner',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
            {
                title: '签约主体编码',
                dataIndex: 'signOwnerCode',
                key: 'signOwnerCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
        ],
        // 天吴单笔
        [
            {
                title: '付款日期',
                dataIndex: 'patmentTime',
                key: 'patmentTime',
                width: 100,
                render: (data)=>{
                    let date = new Date(data * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
                    let Y = date.getFullYear() + '-';
                    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
                    let D = date.getDate();
                    let time3 = Y + M + D;
                    return time3
                }
            },
            {
                title: '请款单号',
                dataIndex: 'prepaymentsCode',
                key: 'prepaymentsCode',
                width: 200,
                render: (data) => {
                    return <span>{data}</span>
                }
            },
            {
                title: '付款流水号',
                dataIndex: 'bankSeqNumber',
                key: 'bankSeqNumber',
                width: 200,
                // fixed: 'left',
            },
            {
                title: '付款银行账户名称',
                dataIndex: 'bankAccountName',
                key: 'bankAccountName',
                width: 250,
                // fixed: 'left',
            },
            {
                title: '付款银行账号',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '收款方名称',
                dataIndex: 'payeeName',
                key: 'payeeName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '收款方编码',
                dataIndex: 'payeeCode',
                key: 'payeeCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '财务科目内容',
                dataIndex: 'financeSubject',
                key: 'financeSubject',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '科目编码',
                dataIndex: 'financeSubjectCode',
                key: 'financeSubjectCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '金额',
                dataIndex: 'paymentAmount',
                key: 'paymentAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '摘要',
                dataIndex: 'abstracts',
                key: 'abstracts',
                render: (data) => {
                    data = isEmpty(data);
                    if(data === '/') {
                        return <span>{data}</span>
                    }
                    else {
                        const style = {
                            whiteSpace: 'nowrap',
                            width: '134px',
                            overflow: 'hidden' as 'hidden',
                            display: 'block',
                            textOverflow: 'ellipsis',
                            cursor: 'pointer',
                        }
                        return (
                            <Tooltip placement="topLeft" title={data}>
                                <span style={style}>{data}</span>
                            </Tooltip>
                        )
                    }
                },
                width: 150,
            },
            {
                title: '签约主体',
                dataIndex: 'signOwner',
                key: 'signOwner',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
            {
                title: '签约主体编码',
                dataIndex: 'signOwnerCode',
                key: 'signOwnerCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
        ],
    ]
    constructor(props:OutputAccountantProps & FormComponentProps) {
        super(props);
    }
    state = {
        cashoutMoney:null,
        isExporting:false,
    }
    componentDidMount() {
        const {
            index,
        } = this.props;
        // this.props.form.validateFields((err, fieldsValue) => {
        //     if (err) {
        //         return;
        //     }

        //     // Should format date value before submit.
        //     const rangeValue = fieldsValue['range-picker'];
        //     const values = {
        //         ...fieldsValue,

        //         'range-picker': [rangeValue[0].format('YYYY-MM-DD'), rangeValue[1].format('YYYY-MM-DD')],
            
        //     };
        //     console.log('Received values of form: ', values);
        // })
        this.onTabChange(index);
    }
    rangePickerProps = () => {
         const {
             index,
         } = this.props;
         const pane = this.props[`pane${index}`];
         const startTime = pane.getIn(['startTime']);
         const endTime = pane.getIn(['endTime']);
         let props : {
             onChange(x: any, y: any): void;
             defaultValue?: [moment.Moment, moment.Moment];
         } = {
            onChange: (dates, dateStrings) => this.onDateChange({dates, dateStrings, index,}),
         }
         if(startTime && endTime) {
             props.defaultValue = [moment(startTime), moment(endTime)];
         }
        return props;
    }
    pagination:any = (params, index) => {
        const {
            // currentPage,
            total,
        } = params.toJS();
        const pane = this.props[`pane${index}`];
        const currentPage = pane.getIn(['currentPage']);
        const pageSize = pane.getIn(['pageSize']);
        // console.log(pageSize)
        const base = {
            current: currentPage,
            total,
            showSizeChanger: true,
            pageSize: pageSize || 20,
            pageSizeOptions: ['20', '50', '100'],
            showQuickJumper: true,
            showTotal:(total, range) => `${range[0]}-${range[1]} of ${total}`,
        };
        
        const {
            dispatch,
        } = this.props;
        switch (index) {
            case 1 :
            default :
                return {
                    ...base,
                    onShowSizeChange: (current, size) => {
                        dispatch(outputAccountant({
                            currentPage: current,
                            pageSize: size,
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            prepaymentsCode: pane.getIn(['prepaymentsCode']),
                            
                            code: pane.getIn(['code']),
                            cashoutMoney: pane.getIn(['cashoutMoney']),
                        }));
                    },
                    onChange: (current) => {
                        dispatch(outputAccountant({
                            currentPage: current,
                            pageSize: pageSize,
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            prepaymentsCode: pane.getIn(['prepaymentsCode']),
                            code: pane.getIn(['code']),
                            cashoutMoney: pane.getIn(['cashoutMoney']),
                        }));
                    },
                }
        }
    }
    modalOk = () => {
        this.props.dispatch(updataProgress({
            percent: 0,
            message: '',
            url: '',
            status: 'active',
            visible: false,
            buttonDisabled: true,
        }));
    }
    progressModal = () => {
        const {
            progress,
        } = this.props;
        return {
            title: '导出',
            visible: progress.getIn(['visible']),
            closable: false,
            footer:  (
                <Button type="primary" disabled={progress.getIn(['disabled'])} onClick={e => this.modalOk()}>确定</Button>
            ),
        }
    }
    onTabChange = (index) => {

        const {
            dispatch,
        } = this.props;
        index = Number(index);
        if(index >= 4) {
            return;
        }
        /**
         * 更新下index
         */
        dispatch(tabPaneChange({
            index,
        }));

        
        
        /**
         * tab切换的时候控制下是否是第一次加载
         * 
         */
        const pane = this.props[`pane${index}`];
        if(pane.getIn(['isFirstLoad']) === false ) {
            return;
        }

        switch (Number(index)) {
            case 1:
            default:
                dispatch(outputAccountant({
                    index,
                    code: pane.getIn(['code']),
                    cashoutMoney: pane.getIn(['cashoutMoney']),
                    startTime: pane.getIn(['startTime']),
                    endTime: pane.getIn(['startTime']),
                    prepaymentsCode: pane.getIn(['prepaymentsCode']),
                }));
                break;
        }
    }
    /**
     * 上传状态
     * @param isExporting boolean
     */
    handleChangeExportStatus = (isExporting:boolean) => {
       
        this.setState({isExporting:isExporting});
        //!isExporting&&this.onTabChange(this.props.index);
    }
    
    /**
     * 导出前验证
     */
    handleVerifyBefore = () => {

        const data = this.props[`pane${this.props.index}`].toJS();
        const {
            dataSource,
            startTime,
            endTime,
            prepaymentsCode,
            code,
            cashoutMoney
        } = data;
        if(dataSource.length <= 0) {
            message.error('没有可导出的记录');
            return false;
        }
        if(startTime && startTime){
            const threeMonthsAfter = moment(startTime).add(3, 'months').valueOf();
            if(threeMonthsAfter< moment(endTime).valueOf()){
                message.error('单次最多可以导出3个月数据');
                return false;
            }
        }else{
            message.error('请选择付款日期');
            return false;
        }
        return true;

    }
    onDateChange = ({index, dates, dateStrings}) => {
        const {
            dispatch,
        } = this.props;
        const pane = this.props[`pane${index}`];
        dispatch(outputAccountant({
            index,
            startTime: dateStrings[0],
            endTime: dateStrings[1],
            code: pane.getIn(['code']),
            prepaymentsCode: pane.getIn(['prepaymentsCode']),
            cashoutMoney: pane.getIn(['cashoutMoney']),
        }))
    }
    setSingleState = (param) => {
        
        this.setState(param);
    }
    onInputChange = ({e, index, key}) => {
        const {
            dispatch,
        } = this.props;
        const pane = this.props[`pane${index}`];
        const value = e.target.value;
        const oldValue = pane.getIn([key]);
     
        if(value === oldValue) {
            return;
        }
        dispatch(outputAccountant({
            index,
            startTime: pane.getIn(['startTime']),
            endTime: pane.getIn(['endTime']),
            cashoutMoney: pane.getIn(['cashoutMoney']),
            code: e.target.value,
            prepaymentsCode: e.target.value,
          
        }));
    }
    onInputNumberBlur = ({e, index, key}) => {
        const {
            dispatch,
        } = this.props;
        const pane = this.props[`pane${index}`];
        const value = e.target.value;
        const oldValue = pane.getIn([key]);
     
        if(value === oldValue) {
            return;
        }
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            dispatch(outputAccountant({
                index,
                startTime: pane.getIn(['startTime']),
                endTime: pane.getIn(['endTime']),
              
                prepaymentsCode: pane.getIn(['prepaymentsCode']),
                code: pane.getIn(['code']),
                cashoutMoney: value,
            }));
        }else{
            message.error('金额格式有误');
            return;
        }
        
    }
    onInputNumberChange = ({e}) => {
        const { value } = e.target;
        const reg = /^-?(0|[1-9][0-9]*)(\.[0-9]*)?$/;
        if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
            this.setState({'cashoutMoney':value})
        }
    }
    outPut = ({index}) => {
        const {
            dispatch,
        } = this.props;
        const data = this.props[`pane${index}`].toJS();
        const {
            dataSource,
            startTime,
            endTime,
            code,
            prepaymentsCode,
            cashoutMoney
        } = data;
        if(dataSource.length <= 0) {
            message.error('没有可导出的记录');
            return;
        }
        if(!startTime) {
            message.error('请选择时间');
            return;
        }
        const threeMonthsAfter = moment(startTime).add(3, 'months').valueOf();
        if(threeMonthsAfter< moment(endTime).valueOf()){
            message.error('单次最多可以导出3个月数据');
            return false;
        }
        dispatch(outPutRecord({
            index,
            // startTime: '2016-11-01',
            // endTime: '2016-12-30',
            startTime,
            endTime,
            code,
             prepaymentsCode,
            cashoutMoney,
            redisKey: Date.now(),
        }));
        
    }
    
    render() {
        let {
            index,
            progress,
            isFetching,
        }  =  this.props;
        const { getFieldDecorator } = this.props.form;

        const pane = this.props[`pane${index}`];
        const rangePickerProps = this.rangePickerProps();
        const code = pane.getIn(['code']);
        const cashoutMoney = pane.getIn(['cashoutMoney']);
       const  prepaymentsCode = pane.getIn(['prepaymentsCode']);
        // const { cashoutMoney } = this.state;
        const data = this.props[`pane${index}`].toJS();
        const {
            dataSource,
            startTime,
            endTime,
            
        } = data;
        // 时间格式后台要秒数
        const newStartTime = startTime && moment(startTime+' 00:00:00').valueOf()/1000;
        const newEndTime = endTime && moment(endTime+' 23:59:59').valueOf()/1000;
        const rangeConfig = {
            rules: [{ type: 'array', message: 'Please select time!' },{validator:(rule, value, callback) => {
                const startTimeValue = value[0];
                const endTimeValue = value[1];

                const threeMonthsAfter = moment(startTimeValue).add(3, 'months').valueOf();
                if(threeMonthsAfter<endTimeValue.valueOf()){
                    callback('超过三个月了')
                }
                
                // Note: 必须总是返回一个 callback，否则 validateFieldsAndScroll 无法响应
                callback()
            }}],
        };
        const scrollY = window.innerHeight * 0.6;
        // const outerA = <a style={{color:"rgba(0, 0, 0, 0.65)"}} href={`${HE_XIAO_DOMAIN}/demo/reportJsp/preview.jsp?rpx=%2Ffinance%2Ffinance_unite.rpx&rpxHome=WEB-INF%2FreportFiles&dfxHome=&arg=%2Ffinance%2Ffinance_unite_arg.rpx`} target="_blank">天吴客户社保款预请款总表 （待核销）</a>;
        // const outerB = <a style={{color:"rgba(0, 0, 0, 0.65)"}} href={`${HE_XIAO_DOMAIN}/demo/reportJsp/preview.jsp?rpx=%2Ffinance%2Ffinance_receipt.rpx&rpxHome=WEB-INF%2FreportFiles&dfxHome=&arg=%2Ffinance%2Ffinance_receipt_arg.rpx`} target="_blank">天吴客户社保款实缴账单明细表（已核销）</a>;
        return(
            <QueueAnim>
                <Spin tip="Loading..." spinning={isFetching}>
                    <div key="1">
                        <Tabs activeKey={index.toString()} 
                            onChange={ key => this.onTabChange(key)}
                        >
                           
                            {/* <TabPane tab={outerA} key="4">
                            </TabPane>
                            <TabPane tab={outerB} key="5">
                            </TabPane> */}
                            <TabPane tab="天吴付款明细表" key="1">
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        <FormItem label="付款日期">
                                            <RangePicker {...rangePickerProps}/>
                                        </FormItem>
                                        <FormItem label="请款单号">
                                            <Input size="default" style={{ width: 250 }} defaultValue={prepaymentsCode} onBlur={e => this.onInputChange({ e, index, key: 'prepaymentsCode'})}/>
                                        </FormItem>
                                       
                                        <FormItem label="金额">
                                            <Input size="default" defaultValue={cashoutMoney}
                                                onChange={e => this.onInputNumberChange({e})} 
                                                onBlur={e => this.onInputNumberBlur({e, index, key: 'cashoutMoney'})}/>
                                        </FormItem>
                                    </Form>
                                    <Button type="primary" className="output-record" onClick={ e => this.outPut({index})}>导出查询结果</Button>
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="1-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            columns={this.columns[1]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane, 1)} 
                                            scroll={{ x: 2500,y:scrollY }}
                                            rowKey={record => record['id']}
                                            bordered
                                            className="overflow-x-scroll"
                                        />
                                    </div>
                                </QueueAnim>
                            </TabPane>
                            <TabPane tab="天吴单笔付款明细表" key="2">
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        <FormItem label="付款日期">
                                            <RangePicker {...rangePickerProps}/>
                                        </FormItem>
                                        <FormItem label="请款单号">
                                            <Input size="default" style={{ width: 250 }} defaultValue={prepaymentsCode} onBlur={e => this.onInputChange({ e, index, key: 'prepaymentsCode'})}/>
                                        </FormItem>
                                      
                                        <FormItem label="金额">
                                            <Input size="default" defaultValue={cashoutMoney}
                                            onBlur={e => this.onInputNumberBlur({e, index, key: 'cashoutMoney'})}/>
                                        </FormItem>
                                    </Form>
                                    <Button type="primary" className="output-record" onClick={ e => this.outPut({index})}>导出查询结果</Button>
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="3-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            columns={this.columns[2]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane, 2)} 
                                            scroll={{ y: scrollY, x: 2500 }}
                                            rowKey={record => record['id']}
                                            className="overflow-x-scroll"
                                        />
                                    </div>
                                </QueueAnim>
                            </TabPane>
                            <TabPane tab="SP 付款明细表" key="3">
                                <Spin tip="导出中..." spinning={this.state.isExporting}>
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        
                                        <FormItem
                                        label="付款日期"
                                        >
                                        {/*{getFieldDecorator('range-picker', rangeConfig)(
                                            <RangePicker {...rangePickerProps}/>
                                        )}*/}
                                            <RangePicker {...rangePickerProps}/>
                                        </FormItem>
                                        {/* 付款银行账户名称 */}
                                            <FormItem label="请款单号">
                                            <Input size="default" style={{ width: 250 }} defaultValue={code} onBlur={e => this.onInputChange({e, index, key: 'code'})}/>
                                        </FormItem>
                                        <FormItem label="金额">
                                            <Input size="default" defaultValue={cashoutMoney}
                                                    
                                                    onBlur={e => this.onInputNumberBlur({e, index, key: 'cashoutMoney'})}/>
                                            
                                        </FormItem>
                                    </Form>
                                    <OutputFile
                                            outputParams={{ startTime: newStartTime, endTime: newEndTime, code,  prepaymentsCode,cashoutMoney}} 
                                        contentType='application/json'
                                        outputUrl={`${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/detail`}
                                        downloadUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download`}
                                        callback ={this.handleChangeExportStatus}
                                        beforeOutput = {this.handleVerifyBefore}
                                        pollUrl = {`${DOMAIN_OXT}/apiv4_/v1/sppayu/schedule/get`}
                                        pollData= {{ type: 6 , userId: this.props.userInfo.userId} }
                                        >
                                        
                                        <Button type="primary" className="output-record">导出查询结果</Button>
                                    </OutputFile>
                                    
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="1-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            columns={this.columns[0]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane,3)} 
                                            scroll={{ y: scrollY, x: 2550 }}
                                            rowKey={record => record['id']}
                                            className="overflow-x-scroll"
                                        />
                                    </div>
                                </QueueAnim>
                                </Spin>
                            </TabPane>
                        </Tabs>
                    </div>
                    <Modal {...this.progressModal()}>                       
                        <Progress percent={progress.getIn(['percent'])} status={progress.getIn(['status'])} />
                        <span>
                            {progress.getIn(['message'])}
                        </span>
                    </Modal>
                    <iframe src={progress.getIn(['url'])} style={{display: 'none'}}></iframe>
                </Spin>
            </QueueAnim>
        )
    }
}

const mapStateToProps = (state?: any): TStateProps => {
    const data = state.getIn(['outputAccountant']);
    
    return {
        index: data.getIn(['index']),
        pane1: data.getIn(['pane1']),
        pane2: data.getIn(['pane2']),
        pane3: data.get('pane3'),
        pane4: data.get('pane4'),
        progress: data.getIn(['progress']),
        isFetching: data.getIn(['isFetching']),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
    }
}

const OutputAccountantForm = Form.create<OutputAccountantProps>()(OutputAccountant) as any;
export default connect(mapStateToProps)(OutputAccountantForm)
