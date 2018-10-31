import * as Immutable from 'immutable';
import {
    PAYINFOENTRY_DATA_RECEIVED,
    PAYINFOENTRY_PAYMENTBILL_DATA_RECEIVE,
    PAYINFOENTRY_ADVANCEDETAILS_DATA_RECEIVE,
    PAYINFOENTRY_PAYMENTSCHEDULE_DATA_RECEIVE,
    PAYINFOENTRY_RECORDS_DATA_RECEIVE,
    PAYINFOENTRY_RESET,
    BASEFETCHING,
    SUBMITFETCHING,
    EXCEPTION_MODAL,
} from '../../action/businessComponents/payInfoEntryAction';
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
        serialNumber: '', /* 流水号 */
        accountNumber: '', /* 出票人账号 */
        checkNumber: '', /* 支票号 */
        paytime: '', /* 打款时间  */
        invoicingTime: '', /* 开票时间 */
        attachment: '', /* 附件 */
        bank: '', /* 打款银行名称 */
        payer: '',/* 付款方名称 */
        type: '',/*信息类型 1：银行转账，2：支票 */
        recordsDataSource: [],

        existNoDetail: 1, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
        noDetailAmount: 0, /** 无明细款项金额 */
        noDetailRemark: '', /** 无明细款项备注*/
    },
    bankSource: [{ name: '招商银行杭州分行萧山支行', value: '招商银行杭州分行萧山支行' }], /* 打款银行名称source */
    payerSource: [{ name: '大连招商银行', value: '大连招商银行' }], /* 付款方名称source */
    // paymentscheduleDataSource: [],
    // paymentbillDataSource: [],
    // advancedetailsDataSource: [],
    // recordsDataSource: [],
    // paymentscheduleTotal: '',
    // paymentbillTotal: '',

    paymentscheduleDataSource: [], /* 付款清单（客户维度） */
    paymentscheduleTotal: { total : 0}, /* 付款清单价格 */
    advancedetailsDataSource: [], /* 垫款明细 */
    advancedetailsTotal: { total : 0}, /* 垫款明细价格 */
    paymentbillDataSource: [], /* 付款账单（人月次维度明细表） */
    paymentbillTotal: { total: 0}, /* 付款账单 价格 */
    baseFetching: true,
    personInfo: {}, /* 用户详情 */
    personInfoShow: false,
    personInfoLoading: true,
    submitFetching: false,
    exceptionModal: {
        visible: false,
    }
});

export const payInfoEntry = (state = initialState, action) => {
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
        case PAYINFOENTRY_DATA_RECEIVED: {
            return state.update('baseSource', () => Immutable.fromJS(params))
        }
        case PAYINFOENTRY_PAYMENTSCHEDULE_DATA_RECEIVE: {
           return state.update('paymentscheduleDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentscheduleTotal', () => Immutable.fromJS(params.total));
        }
        case PAYINFOENTRY_ADVANCEDETAILS_DATA_RECEIVE: {
           return state.update('advancedetailsDataSource', () => Immutable.fromJS(params.dataSource))
                .update('advancedetailsTotal', () => Immutable.fromJS(params.total));
        }
        case PAYINFOENTRY_PAYMENTBILL_DATA_RECEIVE: {
            return state.update('paymentbillDataSource', () => Immutable.fromJS(params.dataSource))
                .update('paymentbillTotal', () => Immutable.fromJS(params.total));
        }
        case PAYINFOENTRY_RECORDS_DATA_RECEIVE: {
            return state.update('recordsDataSource', () => (Immutable.fromJS(
                params,
            )));
        }
        case PAYINFOENTRY_RESET: {
            return initialState;
        }
        case EXCEPTION_MODAL : {
            return state.update('exceptionModal', () => Immutable.fromJS(params));
        }
        default:
            return state;
    }
}
