import * as Immutable from 'immutable';
import {
    CASHOUTORDERDETAILS_DATA_RECEIVED,
    CASHOUTORDERDETAILS_PAYMENTBILL_DATA_RECEIVE,
    CASHOUTORDERDETAILS_ADVANCEDETAILS_DATA_RECEIVE,
    CASHOUTORDERDETAILS_PAYMENTSCHEDULE_DATA_RECEIVE,
    CASHOUTORDERDETAILS_RESET,
    BASEFETCHING,
    SUBMITFETCHING,
    SET_APPROVED,
    EXCEPTION_MODAL,
} from '../../action/businessComponents/cashoutOrderDetailsAction';
const initialState = Immutable.fromJS({
    baseSource: {
        socialMonth: '', /* 社保缴费月（操作月）*/
        socialNature: '', /* 社保请款性质 */
        recipientType: '', /* 收款方类型 */
        recipientName: '', /* 收款方名称 */
        deadline: '', /* 本次请款付款截止时间 */
        billStatus: '', /* 付款清单（客户维度）的状态 */
        submitPerson: '', /* 请款提交人姓名 */
        submitPersonPhone: '', /* 请款提交人手机 */
        rejectReasonData: '',
        recordsDataSource: [],
        payTime: '', /* 计划支付时间 */

        existNoDetail: 1, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
        noDetailAmount: 0, /** 无明细款项金额 */
        noDetailRemark: '', /** 无明细款项备注*/
    },
    recipientSourceLoading: true, /* 收款方信息loading */
    paymentscheduleDataSource: [], /* 付款清单（客户维度） */
    paymentscheduleTotal: { total : 0}, /* 付款清单价格 */
    advancedetailsDataSource: [], /* 垫款明细 */
    advancedetailsTotal: { total : 0}, /* 垫款明细价格 */
    paymentbillDataSource: [], /* 付款账单（人月次维度明细表） */
    paymentbillTotal: { total: 0}, /* 付款账单 价格 */
    baseFetching: true,
    submitFetching: false,
    personInfo: {}, /* 用户详情 */
    personInfoShow: false,
    personInfoLoading: true,
    approvalPersonDataSource: [], /* 审批人source */
    exceptionModal: {
        visible: false, 
    }
});

export const cashoutOrderDetails = (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case BASEFETCHING: {
            return state.update('baseFetching', () => params);
        }
        case SUBMITFETCHING: {
            return state.update('submitFetching', () => params);
        }
        case CASHOUTORDERDETAILS_DATA_RECEIVED: {
            return state.update('baseSource', () => Immutable.fromJS(params))
        }
        case CASHOUTORDERDETAILS_PAYMENTSCHEDULE_DATA_RECEIVE: {
             return state.update('paymentscheduleDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentscheduleTotal', () => Immutable.fromJS(params.total));
        }
        case CASHOUTORDERDETAILS_ADVANCEDETAILS_DATA_RECEIVE: {
            return state.update('advancedetailsDataSource', () => Immutable.fromJS(params.dataSource))
                .update('advancedetailsTotal', () => Immutable.fromJS(params.total));
        }
        case CASHOUTORDERDETAILS_PAYMENTBILL_DATA_RECEIVE: {
            return state.update('paymentbillDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentbillTotal', () => Immutable.fromJS(params.total));
        }
        // case CASHOUTORDERDETAILS_RECORDS_DATA_RECEIVE: {
        //     return state.update('recordsDataSource', () => (Immutable.fromJS(
        //         params,
        //     )));
        // }
        case CASHOUTORDERDETAILS_RESET: {
            return initialState;
        }
        case SET_APPROVED: {
            return state.update('approvalPersonDataSource', () => Immutable.fromJS(params));
        }
        case EXCEPTION_MODAL: {
            return state.update('exceptionModal', () => Immutable.fromJS(params));
        }
        default:
            return state;
    }
}
