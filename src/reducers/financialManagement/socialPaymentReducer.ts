import {
    SOCIAL_PAYMENT_SAGA,
    DATA_RECEIVED,
    ISFETCHING,
    GET_COUNT_NUMBER,
} from '../../action/financialManagement/socialPaymentAction';
import * as Immutable from 'immutable';

const sessionInitialState = JSON.parse(sessionStorage.getItem('socialPayment') !);

const initialState = Immutable.fromJS({
    dataSource: [],
    total: 0,
    pageSize: 20,
    currentPage: 1,
    listIsFetching: true,
    operStatus: 4,
	paymentType: 1, /* 请款类型 */
	payStatus: '', /* 审批状态 */
    receivablesName: '', /* 收款方名称 */
    prepaymentsCode:'',/*请款单号*/
    createUserName: '', /* 请款人 */
    financePlanPayTime:'',
    noexportUnpayCount:0,
    ...sessionInitialState
});

const parseData = (data) => {
    const total = data.recordsTotal;
    const { pageSize = initialState.getIn(['pageSize']), 
        currentPage = initialState.getIn(['currentPage']),
        operStatus = initialState.getIn(['operStatus']),
        paymentType = initialState.getIn(['paymentType']),
        payStatus = initialState.getIn(['payStatus']),
        receivablesName = initialState.getIn(['receivablesName']),
        prepaymentsCode = initialState.getIn(['prepaymentsCode']),
        // prepaymentsCode
        createUserName = initialState.getIn(['createUserName']),
        financePlanPayTime = initialState.getIn(['financePlanPayTime']),
    } = data;
  
    if(data && data.data && data.data.length) {
        return {
            total,
            dataSource: data.data,
            currentPage,
            pageSize,
            paymentType,
            payStatus,
            receivablesName, 
            prepaymentsCode,
            createUserName, 
            financePlanPayTime,
        }
    }
    
    return {
        dataSource: [],
        total: 0,
        currentPage,
        pageSize,
        paymentType,
        payStatus,
        receivablesName, 
        prepaymentsCode,
        createUserName, 
        financePlanPayTime,
    }
}

export const socialPayment = (state = initialState, action) =>  {
    switch (action.type) {
        case DATA_RECEIVED: 
            const {
                dataSource,
                total,
                currentPage,
                pageSize,
                paymentType,
                payStatus,
                receivablesName, 
                prepaymentsCode,
                createUserName, 
                financePlanPayTime,
            } = parseData(action.params);

            return state.updateIn(['dataSource'], () => {
                return Immutable.fromJS(dataSource);
            }).updateIn(['total'], () => {
                return total;
            }).updateIn(['currentPage'], () => {
                return currentPage;
            }).updateIn(['paymentType'], () => {
                return paymentType;
            }).updateIn(['payStatus'], () => {
                return payStatus;
            }).updateIn(['receivablesName'], () => {
                return receivablesName;
            }).updateIn(['createUserName'], () => {
                return createUserName;
            }).updateIn(['pageSize'], () => {
                return pageSize;
            }).updateIn(['financePlanPayTime'], () => {
            return financePlanPayTime;
            }).updateIn(['prepaymentsCode'], () => {
                return prepaymentsCode;
            })
        case GET_COUNT_NUMBER:{
            return state.update('noexportUnpayCount', () => { return action.params.noexportUnpayCount})
        }
        case ISFETCHING: 
            const {
                listIsFetching,
            } = action.params;
            return state.updateIn(['listIsFetching'], () => {
                return listIsFetching;
            });
        default:
            return state;
    }
}
