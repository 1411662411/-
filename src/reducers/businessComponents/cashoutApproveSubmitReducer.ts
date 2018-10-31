import * as Immutable from 'immutable';
import {
    UPLOADING,
    RECIPIENTSOURCELOADING,
    RECIPIENTSELECTSOURCE_DATA_RECEIVED,
    setPaymentschedule,
    CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_DATA_RECEIVE,
    CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_DATA_RECEIVE,
    CASHOUTAPPROVESUBMIT_PAYMENTBILL_DATA_RECEIVE,
    SET_APPROVED,
    SUBMITFETCHING,
    EXCEPTION_MODAL,
    CASHOUTAPPROVESUBMIT_PAYMENTBILL_FETCHING,
    CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_FETCHING,
    CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_FETCHING,
    UPDATE_CAS_PAYMENT_ID,// 更新请款单id；
    CASHOUTAPPROVESUBMIT_SET_PAYMENT_LIST, //设置出款单列表
} from '../../action/businessComponents/cashoutApproveSubmitAction';

const initialState = Immutable.fromJS({
    task: { /* 上传文件的任务标识 */
        task1: true,
        task2: true,
        task3: true,
    },
    recipientSourceLoading: false, /* 收款方信息loading */
    paymentscheduleDataSource: [], /* 付款清单（客户维度） */
    paymentscheduleFetching: true, /* 付款清单（客户维度）loading */
    paymentscheduleTotal: { total : 0}, /* 付款清单价格 */
    advancedetailsDataSource: [], /* 垫款明细 */
    advancedetailsFetching: true,/* 垫款明细 loading */
    advancedetailsTotal: { total : 0}, /* 垫款明细价格 */
    paymentbillDataSource: [], /* 付款账单（人月次维度明细表） */
    paymentbillTotal: { total: 0}, /* 付款账单 价格 */
    paymentbillFetching: true, /* 付款账单（人月次维度明细表）loading */
    approvalPersonSource: [], /* 审批人source */
    recipientSelectSource: {
        one: [],
        two: [],
    },
    personInfo: {}, /* 用户详情 */
    personInfoLoading: true,
    submitFetching: false,
    exceptionModal: {
        visible: false, 
    },
    requestInfoId: undefined,
    paymentList: [],
});

export const cashoutApproveSubmit = (state = initialState, action) => {
    const {
        params,
        type,
    } = action;
    switch (type) {
        case UPLOADING: {
            return state.update('task', () => (Immutable.fromJS({
                ...state.get('task').toJS(),
                ...params,
            })));
        }
        case RECIPIENTSOURCELOADING: {
            return state.update('recipientSourceLoading', () => params);
        }
        case SUBMITFETCHING: {
            return state.update('submitFetching', () => params);
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_DATA_RECEIVE: {
            return state.update('paymentscheduleDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentscheduleTotal', () => Immutable.fromJS(params.total));
        }
        case CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_DATA_RECEIVE: {
            return state.update('advancedetailsDataSource', () => Immutable.fromJS(params.dataSource))
                .update('advancedetailsTotal', () => Immutable.fromJS(params.total));
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTBILL_DATA_RECEIVE: {
            return state.update('paymentbillDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentbillTotal', () => Immutable.fromJS(params.total));
        }
        case CASHOUTAPPROVESUBMIT_SET_PAYMENT_LIST: {
            return state.update('paymentList', () => Immutable.fromJS(params))
        }
        case RECIPIENTSELECTSOURCE_DATA_RECEIVED: {
            const {
                key,
                value,
            } = params;
            return state.updateIn(['recipientSelectSource', `${key}`], () => Immutable.fromJS(value));
        }
        case SET_APPROVED: {
            return state.update('approvalPersonSource', () => Immutable.fromJS(params));
        }
        case EXCEPTION_MODAL: {
            return state.update('exceptionModal', () => Immutable.fromJS(params));
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTBILL_FETCHING: {
            return state.update('paymentbillFetching', () => params);
        }
        case CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_FETCHING: {
            return state.update('paymentscheduleFetching', () => params);
        }
        case CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_FETCHING: {
            return state.update('advancedetailsFetching', () => params);
        }
        case UPDATE_CAS_PAYMENT_ID: {
            console.log(params,'sss');
            return state.update('requestInfoId', () => params);
        }
        default:
            return state;
    }
}