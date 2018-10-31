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
} from 'antd';
import {
    earningAccountant,
    updateSearchParams,
    outPutRecord,
    updataProgress,
    tabPaneChange,
} from '../../action/financialManagement/earningAccountantAction';
import '../../css/financialManagement/earningAccountant';

const RangePicker = DatePicker.RangePicker
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const InputGroup  = Input.Group;
/**
 * 判断是否为空
 * @param {any} value 值
 * @return {any} 
 */
const isEmpty = (value) => {
    return value === null || value === undefined || value === '' ? '/' : value;
};



interface EarningAccountantProps {
    dispatch: any;
    index: any;
    pane1: any;
    pane2: any;
    pane3: any;
    isFetching: boolean;
    progress: any;
}



class EarningAccountant extends React.Component<EarningAccountantProps, any> {
    columns: Array<any> = [
        [
            {
                title: '到款日期',
                dataIndex: 'transDateTime',
                key: 'transDateTime',
                width: 100,
                // fixed: 'left',
            },
            {
                title: '到款金额',
                dataIndex: 'paymentAmount',
                key: 'paymentAmount',
                width: 100,
                // fixed: 'left',
            },
            {
                title: '到款银行流水号',
                dataIndex: 'bankSeqNumber',
                key: 'bankSeqNumber',
                width: 180,
                // fixed: 'left',
            },
            {
                title: '到款银行帐户名称',
                dataIndex: 'bankAccountName',
                key: 'bankAccountName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
            },
            {
                title: '到款银行账号',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 180,
            },
            {
                title: '认款时间',
                dataIndex: 'createTime',
                key: 'createTime',
                render: (data) => {
                    return moment(data*1000).format('YYYY-MM-DD HH:mm:ss')
                },
                width: 170,
            },
            {
                title: '天吴已认款金额',
                dataIndex: 'claimedAmount',
                key: 'claimedAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
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
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '客户会员类型',
                dataIndex: 'customerMemberType',
                key: 'customerMemberType',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '订单类型',
                dataIndex: 'orderType',
                key: 'orderType',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '订单号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 190,
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
                title: '财务科目内容',
                dataIndex: 'financeSubject',
                key: 'financeSubject',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
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
                title: '签约主体',
                dataIndex: 'signOwner',
                key: 'signOwner',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 190,
                // fixed: 'right',
            },
            {
                title: '签约主体编码',
                dataIndex: 'signOwnerCode',
                key: 'signOwnerCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
                // fixed: 'right',
            },
            
        ],
        [
            {
                title: '到款日期',
                dataIndex: 'transDateTime',
                key: 'transDateTime',
                width: 100,
                // fixed: 'left',
            },
            {
                title: '到款银行流水号',
                dataIndex: 'bankSeqNumber',
                key: 'bankSeqNumber',
                width: 250,
                // fixed: 'left',
            },
            {
                title: '到款银行帐户名称',
                dataIndex: 'bankAccountName',
                key: 'bankAccountName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
                // fixed: 'left',
            },
            {
                title: '到款银行账号',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '到款金额',
                dataIndex: 'paymentAmount',
                key: 'paymentAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '天吴已认款金额',
                dataIndex: 'claimedAmount',
                key: 'claimedAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 100,
            },
            {
                title: '待认款金额',
                dataIndex: null,
                key: 'waitClaimedAmount',
                render: (data) => {
                    if(data.paymentAmount && data.claimedAmount){
                        return <span>{(data.paymentAmount-data.claimedAmount).toFixed(2)}</span>
                    }else if(data.paymentAmount && !data.claimedAmount){
                        return <span>{data.paymentAmount}</span>
                    }else{
                        return '/'
                    }
                    
                },
                width: 150,
            },
            {
                title: '付款方账户名称',
                dataIndex: 'payerAccountName',
                key: 'payerAccountName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 180,
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
                title: '财务科目内容',
                dataIndex: 'financeSubject',
                key: 'financeSubject',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '科目编码',
                dataIndex: 'financeSubjectCode',
                key: 'financeSubjectCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
            },
            {
                title: '签约主体',
                dataIndex: 'signOwner',
                key: 'signOwner',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 190,
                // fixed: 'right',
            },
            {
                title: '签约主体编码',
                dataIndex: 'signOwnerCode',
                key: 'signOwnerCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
                // fixed: 'right',
            },
        ],
        [
            {
                title: '订单类型',
                dataIndex: 'orderType',
                key: 'orderType',
                width: 100,
                // fixed: 'left',
            },
            {
                title: '确认到款日期',
                dataIndex: 'confirmTimeString',
                key: 'confirmTimeString',
                width: 150,
                // fixed: 'left',
            },
            {
                title: '订单号',
                dataIndex: 'orderCode',
                key: 'orderCode',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'left',
            },
            {
                title: '客户名称',
                dataIndex: 'customerName',
                key: 'customerName',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '订单金额',
                dataIndex: 'orderAmount',
                key: '确认到款日期',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '发票号',
                dataIndex: 'invoiceNo',
                key: 'invoiceNo',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: '增值税发票类型',
                dataIndex: 'invoiceType',
                key: 'invoiceType',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
            },
            {
                title: '发票抬头',
                dataIndex: 'invoiceTitle',
                key: 'invoiceTitle',
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
                title: <span>税务登记证号<br/>(纳税人识别号)</span>,
                dataIndex: 'taxCertificateNo',
                key: 'taxCertificateNo',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 250,
            },
            {
                title: <span>在主管税务机关备案的<br/>地址/税务票据开票电话</span>,
                dataIndex: 'taxPhone',
                key: 'taxPhone',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
            },
            {
                title: '开户行/账号',
                dataIndex: 'bankAccount',
                key: 'bankAccount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 200,
                // fixed: 'right',
            },
            {
                title: '订单发票总额',
                dataIndex: 'orderInvoiceAmount',
                key: 'orderInvoiceAmount',
                render: (data) => {
                    return <span>{isEmpty(data)}</span>
                },
                width: 150,
                // fixed: 'right',
            },
            {
                title: '备注',
                dataIndex: 'remark',
                key: 'remark',
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
                // fixed: 'right',
            },
        ]
    ]
    constructor(props) {
        super(props);
    }
    componentDidMount() {
        const {
            index,
        } = this.props;
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
            currentPage,
            total,
        } = params.toJS();
        const base = {
            current: currentPage,
            total,
            showSizeChanger: true,
            defaultPageSize: 20,
            pageSizeOptions: ['20', '50', '100'],
            showQuickJumper: true,
            showTotal:(total, range) => `${range[0]}-${range[1]} of ${total}`,
        };
        const pane = this.props[`pane${index}`];
        const {
            dispatch,
        } = this.props;
        switch (index) {
            case 1 :
            case 2 :
                return {
                    ...base,
                    onShowSizeChange: (current, size) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: size,
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            bankAccount: pane.getIn(['bankAccount']),
                            customerName: pane.getIn(['customerName']),
                            minAmount: pane.get('minAmount'),
                             maxAmount: pane.get('maxAmount'),
                        }));
                    },
                    onChange: (current) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: pane.getIn(['pageSize']),
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            bankAccount: pane.getIn(['bankAccount']),
                            customerName: pane.getIn(['customerName']),
                            minAmount: pane.get('minAmount'),
                            maxAmount: pane.get('maxAmount'),
                        }));
                    },
                }
            case 2 :
                return {
                    ...base,
                    onShowSizeChange: (current, size) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: size,
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            bankAccount: pane.getIn(['bankAccount']),
                        }));
                    },
                    onChange: (current) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: pane.getIn(['pageSize']),
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            bankAccount: pane.getIn(['bankAccount']),
                        }));
                    },
                }
            case 3:
                return {
                    ...base,
                    onShowSizeChange: (current, size) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: size,
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            customerName: pane.getIn(['customerName']),
                        }));
                    },
                    onChange: (current) => {
                        dispatch(earningAccountant({
                            currentPage: current,
                            pageSize: pane.getIn(['pageSize']),
                            index,
                            startTime: pane.getIn(['startTime']),
                            endTime: pane.getIn(['endTime']),
                            customerName: pane.getIn(['customerName']),
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
            case 1: {
                dispatch(earningAccountant({
                    index,
                    bankAccount: pane.getIn(['bankAccount']),
                    startTime: pane.getIn(['startTime']),
                    endTime: pane.getIn(['startTime']),
                    minAmount: pane.get('minAmount'),
                    maxAmount: pane.get('maxAmount'),
                    customerName: pane.getIn(['customerName']),
                }));
                break;
            }
            case 2:
                dispatch(earningAccountant({
                    index,
                    bankAccount: pane.getIn(['bankAccount']),
                    startTime: pane.getIn(['startTime']),
                    endTime: pane.getIn(['startTime']),
                }));
                break;
            case 3:
                dispatch(earningAccountant({
                    index,
                    startTime: pane.getIn(['startTime']),
                    endTime: pane.getIn(['startTime']),
                }));
                break;
        }
    }
    onDateChange = ({index, dates, dateStrings}) => {
        const {
            dispatch,
        } = this.props;
        const pane = this.props[`pane${index}`];
        let obj = {};
        if(index === 1) {
            obj = {
                minAmount: pane.get('minAmount'),
                maxAmount: pane.get('maxAmount'),
            }
        }
        dispatch(earningAccountant({
            index,
            startTime: dateStrings[0],
            endTime: dateStrings[1],
            bankAccount: pane.getIn(['bankAccount']),
            customerName: pane.getIn(['customerName']),
            ...obj,
        }))
    }
    onInputChange = ({e, index, key}) => {
        const {
            dispatch,
        } = this.props;
        const pane = this.props[`pane${index}`];
        const value =  e.target ? e.target.value : e;
        const oldValue = pane.getIn([key]);
        const amount = ['minAmount', 'maxAmount']

        
        /**
         * 到款金额
         */
        if( amount.indexOf(key) > -1 && value) {
            if(!/^(-?\d{1,8})(\.\d{1,2})?$/.test(value)) {
                message.error('请输入正确的金额');
                return;
            }
            if(key === 'minAmount' && pane.get('maxAmount') && parseInt(value, 10) > parseInt(pane.get('maxAmount'), 10)) {
                message.error('到款最小金额不能大于到款最大金额');
                return;
            }
            if(key === 'maxAmount' && pane.get('minAmount') && parseInt(value, 10) < parseInt(pane.get('minAmount'), 10)) {
                message.error('到款最大金额不能小于于到款最小金额');
                return;
            }
        }


        if(value === oldValue  && amount.indexOf(key) < 0) {
            return;
        }
        const data  = {
            index,
            startTime: pane.getIn(['startTime']),
            endTime: pane.getIn(['endTime']),
            bankAccount: pane.getIn(['bankAccount']),
            customerName: pane.getIn(['customerName']),
            orderType: pane.getIn(['orderType']),
            minAmount: pane.getIn(['minAmount']),
            maxAmount: pane.getIn(['maxAmount']), 
            [key]: value,
        }

        
        dispatch(earningAccountant(data));
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
            bankAccount,
            orderType,
            minAmount,
            maxAmount,
        } = data;
        if(dataSource.length <= 0) {
            message.error('没有可导出的记录');
            return;
        }
        if(!startTime) {
            message.error('请选择时间');
            return;
        }
        let obj  =  {};
        if(index === 1) {
            obj = {
                minAmount, 
                maxAmount, 
            }
        }
        dispatch(outPutRecord({
            index,
            // startTime: '2016-11-01',
            // endTime: '2016-12-30',
            orderType,
            startTime,
            endTime,
            bankAccount,
            redisKey: Date.now(),
            ...obj,
        }));
        
    }
    render() {
        let {
            index,
            progress,
            isFetching,
        }  =  this.props;
        const pane = this.props[`pane${index}`];
        const rangePickerProps = this.rangePickerProps();
        const bankAccount = pane.getIn(['bankAccount']);
        const customerName = pane.getIn(['customerName']);
        const orderType = pane.getIn(['orderType']);
        return(
            <QueueAnim>
                <Spin tip="Loading..." spinning={isFetching}>
                    <div key="1">
                        <Tabs defaultActiveKey={index.toString()} 
                            onChange={ key => this.onTabChange(key)}
                        >
                            <TabPane tab="认款明细表" key="1">
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        <FormItem label="到款日期">
                                            <RangePicker {...rangePickerProps} />
                                        </FormItem>
                                        <FormItem label="到款金额">
                                            <InputGroup>
                                                <Input style={{ width: 100, textAlign: 'center', borderRight: 0 }} placeholder="最小金额" onBlur={e => this.onInputChange({e, index, key: 'minAmount'})} />
                                                <Input style={{ width: 30, borderLeft: 0, borderRight: 0, pointerEvents: 'none', backgroundColor: '#fff' }} placeholder="~" disabled />
                                                <Input style={{ width: 100, textAlign: 'center', borderLeft: 0 }} placeholder="最大金额" onBlur={e => this.onInputChange({e, index, key: 'maxAmount'})} />
                                            </InputGroup>
                                        </FormItem>
                                        <FormItem label="到款银行账户名称">
                                            <Input size="default" defaultValue={bankAccount} onBlur={e => this.onInputChange({e, index, key: 'bankAccount'})}/>
                                        </FormItem>
                                        <FormItem label="客户名称">
                                            <Input size="default" defaultValue={customerName} onBlur={e => this.onInputChange({e, index, key: 'customerName'})}/>
                                        </FormItem>
                                        <FormItem label="订单类型">
                                            <Select
                                                defaultValue={ orderType}
                                                style={{ width: 150 }}
                                                onChange={e => { this.onInputChange({ e, index, key: 'orderType'}) }}
                                                >
                                                <option value=''>全部</option>
                                                <option value='1'>会员套餐订单</option>
                                                <option value='2'>社保订单</option>
                                                <option value='3'>商保订单</option>
                                                <option value='4'>社保补差订单</option>
                                                <option value='5'>SP社保订单</option>
                                                <option value='6'>代发工资订单</option>
                                                
                                            </Select>
                                            {/* <Input size="default" defaultValue={customerName} onBlur={e => this.onInputChange({e, index, key: 'customerName'})}/> */}
                                        </FormItem>
                                    </Form>
                                    <Button type="primary" className="output-record" onClick={ e => this.outPut({index})}>导出查询结果</Button>
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="1-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            bordered
                                            columns={this.columns[0]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane, 1)} 
                                            scroll={{ x: 3300,y:window.innerHeight * 0.6 }}
                                            rowKey={record => record['id']}
                                        />
                                    </div>
                                </QueueAnim>
                            </TabPane>
                            <TabPane tab="到款明细表" key="2">
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        <FormItem label="到款日期">
                                            <RangePicker {...rangePickerProps} />
                                        </FormItem>
                                        <FormItem label="到款银行账户名称">
                                            <Input size="default" defaultValue={bankAccount} onBlur={e => this.onInputChange({e, index, key: 'bankAccount'})}/>
                                        </FormItem>
                                    </Form>
                                    <Button type="primary" className="output-record" onClick={ e => this.outPut({index})}>导出查询结果</Button>
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="3-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            bordered
                                            columns={this.columns[1]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane, 2)} 
                                            scroll={{ y: window.innerHeight * 0.6, x: 2550 }}
                                            rowKey={record => record['id']}
                                        />
                                    </div>
                                </QueueAnim>
                            </TabPane>
                            <TabPane tab="会员费到款明细表" key="3">
                                <div className="search-group">
                                    <Form layout="inline" className="search-form">
                                        <FormItem label="确认到款日期">
                                            <RangePicker {...rangePickerProps} />
                                        </FormItem>
                                        <FormItem label="客户名称">
                                            <Input size="default" defaultValue={customerName} onBlur={e => this.onInputChange({e, index, key: 'customerName'})}/>
                                        </FormItem>
                                    </Form>
                                    <Button type="primary" className="output-record" onClick={ e => this.outPut({index})}>导出查询结果</Button>
                                </div>
                                <QueueAnim type="bottom" delay="300">
                                    <div key="2-1" style={{marginTop: '20px'}}>
                                        <Table 
                                            bordered
                                            columns={this.columns[2]} 
                                            dataSource={pane.getIn(['dataSource']).toJS()}
                                            pagination={this.pagination(pane, 3)} 
                                            scroll={{ y: window.innerHeight * 0.6, x: 2550 }}
                                            rowKey={record => record['id']}
                                        />
                                    </div>
                                </QueueAnim>
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

function mapStateToProps(state: any) {
    const data = state.getIn(['earningAccountant']);
    return {
        index: data.getIn(['index']),
        pane1: data.getIn(['pane1']),
        pane2: data.getIn(['pane2']),
        pane3: data.getIn(['pane3']),
        progress: data.getIn(['progress']),
        isFetching: data.getIn(['isFetching']),
    }
}

export default connect(mapStateToProps)(EarningAccountant)