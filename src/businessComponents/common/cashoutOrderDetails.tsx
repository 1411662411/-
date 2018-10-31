/**
 * 请款单
 */
import * as React from 'react';
import * as QueueAnim from 'rc-queue-anim/lib/';
import { browserHistory, Link } from 'react-router';
import { ROUTER_PATH } from '../../global/global';
import {
    connect,
} from 'react-redux';

import * as moment from 'moment';
import * as Immutable from 'immutable'
import { eachUpdateIn } from '../../util/immutableUtil';
import {
    Tabs,
    Form,
    Input,
    Card,
    Button,
    Cascader,
    Row,
    notification,
    Spin,
    message,
    Modal,
    Alert,
} from 'antd';
import * as columns from '../../components/common/columns/index';
import {
    getPaymentschedule,
    getAdvancedetails,
    getPaymentbill,
    getCashoutorderdetails,
    baseFetching,
    resetState,
    submit,
    getApproved,
} from '../../action/businessComponents/cashoutOrderDetailsAction';
import {
    SocialInfo,
    RecipientInfo,
    Paymentschedule,
    Paymentbill,
    CashoutApproveRecords,
    ApprovalComments,
} from '../../components/common/cashoutApproveUi';

import {
    accAdd,
} from '../../util/math';
import { formatMoney } from '../../util/util';
const TabPane = Tabs.TabPane;


interface TStateProps {
    recipientSourceLoading: boolean;
    paymentscheduleDataSource: any;
    advancedetailsDataSource: any;
    paymentbillDataSource: any;
    paymentscheduleTotal: any;
    // paymentbillTotal: number | string;
    paymentbillTotal: any;
    advancedetailsTotal: any;
    baseSource: any;
    baseFetching: boolean;
    submitFetching: boolean;
    approvalPersonDataSource: any;
    exceptionModal?: any;
    personInfo:any;
    userInfo:any;
    personInfoShow: boolean; /* 用户详情弹窗 */
    personInfoLoading: boolean;
}
interface TOwnProps {
    /** 角色控制，0:只读, 1 ：业务 2：财务, 3: CEO */
    role: 0 | 1 | 2 | 3; 
    /** 请款单号 */
    orderCode: number | undefined | null; 
}
interface TDispatchProps {
    dispatch: any;
}
type CashoutOrderDetailsProps = TStateProps & TOwnProps & TDispatchProps;


class CashoutOrderDetails extends React.Component<CashoutOrderDetailsProps, any> {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
        };
    }
    componentWillMount() {
        const {
            dispatch,
            orderCode,
            role,
        } = this.props;
        dispatch(baseFetching(true));
        if (!orderCode) {
            message.error("缺少请款单号查询参数");
            return;
        }

        /**
         * 提交审批人source
         */
        dispatch(getApproved({}));


        /* 基本请款信息 */
        dispatch(getCashoutorderdetails({ id: orderCode, role }));


        /* 付款清单（客户维度） */
        dispatch(getPaymentschedule({ code: orderCode, role, }));

        /* 付款账单（人月次维度明细表） */
        dispatch(getPaymentbill({ code: orderCode, role, }));


        // /* 请款记录 */
        // dispatch(getRecords({ orderCode, role }))
    }
    componentWillUnmount() {
        this.props.dispatch(resetState());
    }
    goDetails = () => {
        const {
            sessionStorageName,
            redirectUrl,
        } = this.props.exceptionModal.toJS();
        const params = { params: { orderCode: this.props.orderCode } };
        sessionStorage.setItem(sessionStorageName, JSON.stringify(params));
        browserHistory.push(redirectUrl);
    }
    approvalComments: ApprovalComments | null;
    approveSubmit = () => {
        const {
            role,
            dispatch,
            orderCode,
            approvalPersonDataSource,
            advancedetailsTotal
        } = this.props;
        const result: any = this.approvalComments === null ?  false : this.approvalComments.validate();
        // console.log('validate::', result);
        const {
            approvalStatus,
            approvalPerson,
            rejectReason,
            paytime,
            remark,
            attachment,
        } = result;
        let params:{
            [propsName : string] : any
        } = {
            code: orderCode,
        };
        /**
         * 财务方
         * 如果该请款单的“垫款金额=0”，则“提交给下一位审批人”为：CEO 
         * 如果该请款单的“垫款金额≠0”，则“提交给下一位审批人”为：CSO
         */
        const getOrganizationId =()=> {
            const approvalPersonData = approvalPersonDataSource.toJS();
            const advancedMoney = advancedetailsTotal.get('total');
            if(advancedMoney){
                return approvalPersonDataSource.toJS().find(function(value, index, arr) {
                    return value.label == "CSO";
                }).value
            }else {
                return approvalPersonData.find(function(value, index, arr) {
                    return value.label == "CEO";
                }).value
            }
        }
        /* 角色控制，1 ：业务 2：财务, 3: CEO */
        switch (role) {
            case 1: {
                if (approvalStatus === 1) {
                    params = {
                        ...params,
                        organizationId: approvalPerson.length >= 1 ? approvalPerson[0] : null,
                        operatorId: approvalPerson.length >= 2 ? approvalPerson[1] : null,
                        operatorContent: remark,
                    }
                }
                else {
                    params = {
                        ...params,
                        rejectReason,
                    }
                }
                break;
            }
            case 2: {
                if (approvalStatus === 1) {
                    params = {
                        ...params,
                        organizationId:getOrganizationId(),
                        payTime: paytime.format('YYYY-MM-DD HH:mm'),
                        operatorContent: remark,
                    }
                }
                else {
                    params = {
                        ...params,
                        rejectReason,
                        files: attachment && attachment.map(({ name, ossKey }) => ({
                            name,
                            url: ossKey,
                        })),
                    }
                }
                break;
            }
            case 3: {
                if (approvalStatus === 1) {
                    params = {
                        ...params,
                        payTime: paytime.format('YYYY-MM-DD HH:mm'),
                        operatorContent: remark,
                    }
                }
                else {
                    params = {
                        ...params,
                        rejectReason,
                    }
                }
                break;
            }
            default: {
                throw new Error('error role in approveSubmit expect "1 ：业务 2：财务, 3: CEO"');
            }
        }

        if (result !== false) {
            this.props.dispatch(submit({
                approvalStatus,
                params,
                role,
            }));
        }
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
            recipientSourceLoading,
            paymentscheduleDataSource,
            advancedetailsDataSource,
            paymentbillDataSource,
            paymentscheduleTotal,
            paymentbillTotal,
            advancedetailsTotal,
            baseSource,
            baseFetching,
            role,
            submitFetching,
            approvalPersonDataSource,
            orderCode,
            exceptionModal,
            userInfo,
        } = this.props;
        
        const {
            visible,
            message,
        } = exceptionModal.toJS();
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
            payTime,
            openBank,
            account,
            isApproval,

            existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
            noDetailAmount, /** 无明细款项金额 */
            noDetailRemark, /** 无明细款项备注*/
        } = baseSource.toJS();
        const rejectReasonDataProps = rejectReasonData ? { rejectReasonData } : {};
        return (
            <QueueAnim>
                <Spin spinning={baseFetching}>
                    <Modal
                        title="提醒"
                        visible={visible}
                        closable={false}
                        footer={<Button type="primary" onClick={e => this.goDetails()}>确定</Button>}
                    >
                        <Alert message={message} type="warning">
                        </Alert>
                    </Modal>
                    <div key="cashoutOrderDetail">
                        <Tabs animated={false} activeKey="1">
                            <TabPane tab={`请款单：${orderCode}`} key="1" style={{ padding: '10px' }}>
                                <SocialInfo
                                    socialMonth={socialMonth}
                                    socialNature={socialNature}
                                    recipientType={recipientType}
                                    submitPerson={submitPerson}
                                    submitPersonPhone={submitPersonPhone}
                                    existNoDetail={existNoDetail}
                                    noDetailAmount={formatMoney(noDetailAmount, 2, '')}
                                    noDetailRemark={noDetailRemark}
                                    {...rejectReasonDataProps}
                                />
                                
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
                                <RecipientInfo
                                    deadline={deadline}
                                    recipientName={recipientName}
                                    recipientType={recipientType}
                                    recipientSourceLoading={recipientSourceLoading}
                                    account={account}
                                    openBank={openBank}
                                    total={this.totalCalc()}
                                />
                                <CashoutApproveRecords
                                    dataSource={recordsDataSource}
                                />
                                {
                                    role !== 0
                                    && 
                                    <div>
                                        <ApprovalComments
                                            approvalPersonDataSource={approvalPersonDataSource}
                                            role={role}
                                            ref={node => this.approvalComments = node}
                                            values={{ payTime,advancedMoney:advancedetailsTotal.get('total'),userInfo }}
                                            loading={submitFetching}
                                            submit={this.approveSubmit}
                                        />
                                        {/*<Row type="flex" justify="center">
                                            <Button className="submit" type="primary" loading={submitFetching} onClick={(e) => this.approveSubmit()} style={{ marginTop: 20 }}>
                                                {roleParams.button}
                                            </Button>
                                        </Row>*/}
                                    </div>
                                }
                            </TabPane>
                        </Tabs>
                    </div>
                </Spin>
            </QueueAnim>
        )
    }
}


const mapStateToProps = (state:Any.Store, ownProps: TOwnProps):TStateProps => {
    const data = state.get('cashoutOrderDetails');
    return {
        baseSource: data.get('baseSource'),
        baseFetching: data.get('baseFetching'),
        submitFetching: data.get('submitFetching'),
        recipientSourceLoading: data.get('recipientSourceLoading'),
        paymentscheduleDataSource: data.get('paymentscheduleDataSource'),
        advancedetailsDataSource: data.get('advancedetailsDataSource'),
        paymentbillDataSource: data.get('paymentbillDataSource'),
        paymentscheduleTotal: data.get('paymentscheduleTotal'),
        paymentbillTotal: data.get('paymentbillTotal'),
        advancedetailsTotal: data.get('advancedetailsTotal'),
        userInfo: state.getIn(['routerPermission', 'permission', 'userInfo']),
        personInfo: data.get('personInfo'), /* 用户详情 */
        personInfoShow: data.get('personInfoShow'), /* 用户详情弹窗 */
        personInfoLoading: data.get('personInfoLoading'),
        approvalPersonDataSource: data.get('approvalPersonDataSource'),
        exceptionModal: data.get('exceptionModal'),
    }
};


export default connect(mapStateToProps)(CashoutOrderDetails)

