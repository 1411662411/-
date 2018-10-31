import * as Immutable from 'immutable';

import{
    RECEIVE_SP_TABLE_DATA,
    RECEIVE_OUT_TABLE_DATA,
   
} from '../../action/financialManagement/spPaymentAction';

const initialState = Immutable.fromJS({
    dataSource1: [],
    dataSource2: [],
    total:0,
    isFetching: true,
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
    },
    bankSource: [{ name: '招商银行杭州分行萧山支行 ', value: 1 }], /* 打款银行名称source */
    payerSource: [{ name: '招商银行杭州分行萧山支行222 ', value: 1 }], /* 付款方名称source */

});

export const spPaymentReducer = (state = initialState, action) => {
     const data = action.params;
    switch(action.type){
        case RECEIVE_SP_TABLE_DATA:
            return state.update( 'dataSource1', () => Immutable.fromJS(data.data) ).
                    update( 'isFetching', () => false ).update('total', () => data.recordsTotal);
        case RECEIVE_OUT_TABLE_DATA:
            return state.update( 'dataSource2', () => Immutable.fromJS(data.data) ).
                    update( 'isFetching', () => false ).update('total', () => data.recordsTotal);
       
        default: 
            return state
    }
}