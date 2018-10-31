import * as immutable from 'immutable';
import {
    ORDER_INFO_DATA_RECEIVE,
    FETCHING,
} from '../../action/socialManagement/cashoutApproveReSubmitAction';

export const initialState = immutable.fromJS({
    baseSource: {
        socialMonth: '', /* 社保缴费月（操作月）*/
        socialNature: '', /* 社保请款性质 */
        recipientType: '', /* 收款方类型 */
        recipientName: '', /* 收款方名称 */
        deadline: '', /* 本次请款付款截止时间 */
        billStatus: 2, /* 付款清单（客户维度）的状态 */
        remark: '', /* 备注 */
        approvalPerson: '', /* 审批人 */
        rejectReasonData: '',
        recipientSelectSource: { /* 收款方类型source */
            one: [],
            two: [],
        },
        recordsDataSource: [],
        
        existNoDetail: 1, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
        noDetailAmount: 0, /** 无明细款项金额 */
        noDetailRemark: '', /** 无明细款项备注*/
    },
    baseSourceLoading: true,
    personInfo: {}, /* 用户详情 */
    personInfoShow: false,
    personInfoLoading: true,
});

export const cashoutApproveReSubmit = (state = initialState, action) => {
    const {
        params,
        type,
    } = action;
    switch (type) {
        case ORDER_INFO_DATA_RECEIVE: {
            return state.update('baseSource', () => immutable.fromJS(params));
        }
        case FETCHING: {
            return state.update('baseSourceLoading', () => params);
        }
        default:
            return state;
    }
}