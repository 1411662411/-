import * as React from 'react';
import { connect } from 'react-redux'
import { browserHistory } from 'react-router';
import { EntryInfo } from '../../components/common/payInfoEntryUi';
import {
    ROUTER_PATH,
} from '../../global/global';
import {
    Row,
    Col,
    Button,
    Card,
    Affix,
    Tabs,
    Form,
    Spin,
    message,
    Modal,
    Alert,
} from 'antd';
import {
    RecipientInfo,
    Paymentschedule,
    Paymentbill,
    CashoutApproveRecords,
    SocialInfo,
} from '../../components/common/cashoutApproveUi';
import {
    getPayinfoentry,
    baseFetching,
    getPaymentbill,
    getPaymentschedule,
    getRecords,
    resetState,
    submit,
    remove,
} from '../../action/businessComponents/payInfoEntryAction';

import {
    accAdd,
} from '../../util/math';
import { formatMoney } from '../../util/util';

import Table from '../../components/Table';
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const ButtonGroup = Button.Group;

interface TStateProps {
    paymentscheduleDataSource: any;
    advancedetailsDataSource: any;
    paymentbillDataSource: any;
    paymentscheduleTotal: number | string;
    // paymentbillTotal: number | string;
    paymentbillTotal: any;
    advancedetailsTotal: number | string;
    baseSource: any;
    baseFetching: boolean;
    bankSource: any; /* 打款银行名称source */
    payerSource: any; /* 付款方名称source */
    submitFetching: boolean;
    removeFetching:boolean;
    exceptionModal?: any;
}
interface TOwnProps {
    orderCode: number | undefined | null; /* 请款单号 */
    edit?: boolean; /* 录入：true 查看: false */
}
interface TDispatchProps {
    dispatch: Any.Dispatch<any>;
}
type PayInfoEntryProps = TStateProps & TOwnProps & TDispatchProps;

const formItemLayout = {
    labelCol: {
        xs: {
            span: 0,
        },
        sm: {
            span: 0,
        },
    },
    wrapperCol: {
        xs: {
            span: 24,
        },
        sm: {
            span: 24,
        },
    }
}
class PayInfoEntry extends React.Component<PayInfoEntryProps, any> {
    constructor(props) {
        super(props);
        this.state={
            loading:false
        }
        const {
            dispatch,
            orderCode,
        } = this.props;
        dispatch(baseFetching(true));
        if (!orderCode) {
            message.error("缺少请款单号查询参数");
            return;
        }
        /* 基本请款信息 */
        dispatch(getPayinfoentry({ id: orderCode }))

        /* 付款清单（客户维度） */
        dispatch(getPaymentschedule({ code: orderCode, }));
        /* 付款账单（人月次维度明细表） */
        dispatch(getPaymentbill({ code: orderCode, }));



        /* 请款记录 */
        dispatch(getRecords({ orderCode, }))
    }
    componentWillUnmount() {
        this.props.dispatch(resetState());
    }
    EntryInfo: any
    submit = () => {
        const {
            dispatch,
            orderCode,
        } = this.props;
        const result = this.EntryInfo.validate();
        console.log('validate::', result);
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
            /**
             * v241 sp 修改 默认银行
             */
            type = 1;
            if (type === 1) {
                params = {
                    type,
                    payBankName: bank,
                    payBankAccount,
                    serialNumber,
                    payTime: paytime.format('YYYY-MM-DD HH:mm'),
                    url: 　attachment.length > 0 ? attachment[0].ossKey : undefined,
                    code: orderCode,
                }
            }
            else {
                params = {
                    type,
                    payerName: payer,
                    drawerAccount: accountNumber,
                    checkNumber,
                    openTicketTime: invoicingTime.format('YYYY-MM-DD HH:mm'),
                    url: 　attachment.length > 0 ? attachment[0].ossKey : undefined,
                    code: orderCode,
                }
            }
            dispatch(submit(params));
        }
    }
    remove = () => {
        this.setState({
            loading:true
        })
        const __this = this
        const {
                dispatch,
                orderCode,
            } = this.props;

        let params;
        params = {
            code: orderCode,
        }
        Modal.confirm({
            title: '请与客服确认后再取消该请款单',
            content: '请款单取消后将不可恢复，你还要继续吗？',
            okText: '继续',
            cancelText: '我再想想',
            onOk() {
                dispatch(remove(params));
            },
            onCancel() {
                __this.setState({
                    loading: false
                })
             },
        });
       
    }
    entryInfoProps = () => {
        const {
            edit,
            baseSource,
            bankSource,
            payerSource,
        } = this.props;
        const {
            type,
            serialNumber, /* 流水号 */
            accountNumber, /* 出票人账号 */
            checkNumber, /* 支票号 */
            paytime, /* 打款时间  */
            invoicingTime, /* 开票时间 */
            attachment, /* 附件 */
            bank, /* 打款银行名称 */
            payer,/* 付款方名称 */
            payBankAccount,
        } = baseSource.toJS();
        /* 编辑形态 */
        if (edit) {
            return {
                ref: node => this.EntryInfo = node,
                bankSource: bankSource.toJS(),
                payerSource: payerSource.toJS(),
                type,
                edit,
            }
        }
        /* 查看形态 */
        return {
            ref: node => this.EntryInfo = node,
            type,
            serialNumber,
            accountNumber,
            checkNumber,
            paytime,
            invoicingTime,
            attachment,
            bank,
            payer,
            payBankAccount,
        }

    }
    rednerRecipientType = (value) => {
        const map = {
            '1': '给服务商合并请款',
            '2': '给服务商五险请款',
            '3': '给服务商公积金请款',
            '4': '给自营户五险请款',
            '5': '给自营户公积金请款',
        };
        /**
         * 无编辑状态
         */
        if (Object.prototype.hasOwnProperty.call(map, value)) {
            return <span>{map[value]}</span>;
        }
        else {
            return <span></span>;
        }
    }
    goDetails = () => {
        const {
            sessionStorageName,
            redirectUrl,
        } = this.props.exceptionModal.toJS();
        const params = { params: { orderCode: this.props.orderCode } };
        if(sessionStorageName !== undefined) {
             sessionStorage.setItem(sessionStorageName, JSON.stringify(params));
        }
        browserHistory.push(redirectUrl);
    }
    totalCalc = () => { //计算收款方信息所需字段请款总金额
        const {
            paymentscheduleTotal,
            advancedetailsTotal,
            paymentbillTotal,
            baseSource,
        } = this.props;
        const {
            noDetailAmount,
        } = baseSource.toJS()
        let money:number = 0;
        money = accAdd(paymentbillTotal.get('total') || 0, noDetailAmount);
        return formatMoney(money, 2, '');
    }
    render() {
        const {
            dispatch,
            paymentscheduleDataSource,
            advancedetailsDataSource,
            paymentbillDataSource,
            paymentscheduleTotal,
            paymentbillTotal,
            baseSource,
            baseFetching,
            edit,
            orderCode,
            advancedetailsTotal,
            submitFetching,
            removeFetching,
            exceptionModal,
        } = this.props;
        const {
            socialMonth, /* 社保缴费月（操作月）*/
            socialNature, /* 社保请款性质 */
            recipientType, /* 收款方类型 */
            recipientName, /* 收款方名称 */
            deadline, /* 本次请款付款截止时间 */
            billStatus, /* 付款清单（客户维度）的状态 */
            submitPerson, /* 请款提交人姓名 */
            submitPersonPhone, /* 请款提交人手机 */
            rejectReasonData, /* 驳回原因 */
            recordsDataSource,
            openBank,
            account,
            type,

            existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount, /** 无明细款项金额 */
            noDetailRemark, /** 无明细款项备注*/
        } = baseSource.toJS();
        const {
            visible,
            message,
        } = exceptionModal.toJS(); 
        return (
            <Spin spinning={baseFetching}>
                <Modal 
                    title="提示"
                    visible={ !edit ? false : visible ? true: false }
                    closable={false}
                    footer={
                        <Button type="primary" onClick={e => this.goDetails()}>确定</Button>
                    }
                >
                    <Alert message={message}
                        type="warning"
                    />
                </Modal>
                <div key="payInfoEntry">
                    <Tabs activeKey="1">
                        <TabPane tab={`请款单：${orderCode}`} key="1" style={{ padding: '10px' }}>
                            <SocialInfo
                                socialMonth={socialMonth}
                                socialNature={socialNature}
                                recipientType={recipientType}
                                isEdit={false}
                                existNoDetail={existNoDetail}
                                noDetailAmount={noDetailAmount}
                                noDetailRemark={noDetailRemark}
                                submitPerson={submitPerson}
                                submitPersonPhone={submitPersonPhone}
                            />
                            
                            {/* <Card style={{ marginBottom: 26 }}>
                                <Form className="form-1" key="form-1">
                                
                                    <Table 
                                        dataSource={[
                                            {
                                                label: '请款提交人',
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="请款提交人"
                                                >
                                                    <span>{submitPerson}/{submitPersonPhone}</span>
                                                </FormItem>,
                                                isAll: true,
                                            },
                                            {
                                                label: '社保缴费月（操作月）',
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="社保缴费月（操作月）"
                                                >
                                                    <span>{socialMonth}</span>
                                                </FormItem>
                                            },
                                            {
                                                label: '社保业务请款性质',
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="社保业务请款性质"
                                                >
                                                    <span>
                                                        {
                                                            socialNature === 1 ? '实付请款' : '预付请款'
                                                        }
                                                    </span>
                                                </FormItem>
                                            },
                                            {
                                                label: '预请款中是否存在无明细的请款款项',
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="预请款中是否存在无明细的请款款项"
                                                >
                                                    <span className='text-error'>存在无明细款项</span>
                                                </FormItem>
                                            },
                                            {
                                                label: '无明细款项金额',
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="无明细款项金额"
                                                >
                                                    <span className='text-error'>100.111.00</span>
                                                </FormItem>
                                            },
                                            {
                                                label: '无明细款项备注说明',
                                                isAll: true,
                                                value: <FormItem
                                                    {...formItemLayout}
                                                    label="无明细款项备注说明"
                                                >
                                                    <span>无明细款项备注说明</span>
                                                </FormItem>
                                            },
                                        ]}
                                    />
                                </Form>
                            </Card> */}

                            <RecipientInfo  // 收款方信息
                                deadline={deadline}
                                recipientName={recipientName}
                                recipientType={recipientType}
                                openBank={openBank}
                                account={account}
                                total={this.totalCalc()}
                            />

                            <Card style={{ marginBottom: 26 }}>
                                <EntryInfo {...this.entryInfoProps() } />
                            </Card>
                            <Paymentschedule
                                billStatus={billStatus}
                                paymentscheduleDataSource={paymentscheduleDataSource}
                                advancedetailsDataSource={advancedetailsDataSource}
                                paymentscheduleTotal={paymentscheduleTotal}
                                advancedetailsTotal={advancedetailsTotal}
                            />
                            <Paymentbill
                                paymentbillDataSource={paymentbillDataSource}
                                paymentbillTotal={paymentbillTotal}
                            />
                            <CashoutApproveRecords
                                dataSource={recordsDataSource}
                            />
                           
                            {
                                edit
                                &&
                                <Row type="flex" justify="center" >
                                    <Affix offsetBottom={20} style={{width:400}}>
                                   
                                        <Button className="submit" type="primary" loading={submitFetching} onClick={(e) => this.submit()} style={{ marginTop: 20 ,float:"left"}}>
                                                确定提交
                                        </Button>
                                  
                                        
                               
                                        <Button className="remove" onClick={(e) => this.remove()} loading={this.state.loading} style={{ marginTop: 20 ,marginLeft: 30,float:"left"}}>
                                                取消该请款单
                                            </Button>
                                   
                                        
                                    </Affix>
                                </Row>
                            }

                        </TabPane>
                    </Tabs>

                </div>
            </Spin>
        )
    }
}
const mapStateToProps = (state:Any.Store, ownProps: TOwnProps):TStateProps => {
    const data = state.get('payInfoEntry');
    return {
        baseSource: data.get('baseSource'),
        baseFetching: data.get('baseFetching'),
        submitFetching: data.get('submitFetching'),
        removeFetching: data.get('removeFetching'),
        paymentscheduleDataSource: data.get('paymentscheduleDataSource'),
        advancedetailsDataSource: data.get('advancedetailsDataSource'),
        paymentbillDataSource: data.get('paymentbillDataSource'),
        paymentscheduleTotal: data.get('paymentscheduleTotal'),
        paymentbillTotal: data.get('paymentbillTotal'),
        advancedetailsTotal: data.get('advancedetailsTotal'),
        bankSource: data.get('bankSource'),
        payerSource: data.get('payerSource'),
        exceptionModal: data.get('exceptionModal'),
        
    }
};
export default connect(mapStateToProps)(PayInfoEntry);