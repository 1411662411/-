import {
    SOCIAL_APPROVE_SAGA,
    DATA_RECEIVED,
    ISFETCHING,
} from '../../action/financialManagement/socialApproveAction';
import * as Immutable from 'immutable';

const sessionInitialState = JSON.parse(sessionStorage.getItem('socialApprove')!);

const initialState = Immutable.fromJS({
    dataSource: [],
    total: 0,
    pageSize: 20,
    currentPage: 1,
    listIsFetching: true,
    operStatus: 3,
	paymentType: 1, /* 请款类型 */
	approvalStatus: '', /* 审批状态 */
	receivablesName: '', /* 收款方名称 */
	createUserName: '', /* 请款人 */
    ...sessionInitialState
});

const parseData = (data) => {
    const total = data.recordsTotal;
    const { pageSize = initialState.getIn(['pageSize']), 
        currentPage = initialState.getIn(['currentPage']),
        operStatus = initialState.getIn(['operStatus']),
        paymentType = initialState.getIn(['paymentType']),
        approvalStatus = initialState.getIn(['approvalStatus']),
        receivablesName = initialState.getIn(['receivablesName']),
        createUserName = initialState.getIn(['createUserName']),
    } = data;
    if(data && data.data && data.data.length) {
        return {
            total,
            dataSource: data.data,
            currentPage,
            pageSize,
            paymentType,
            approvalStatus,
            receivablesName, 
            createUserName, 
        }
    }
    
    return {
        dataSource: [],
        total: 0,
        currentPage,
        pageSize,
        paymentType,
        approvalStatus,
        receivablesName, 
        createUserName, 
    }
}

export const socialApprove = (state = initialState, action) =>  {
    switch (action.type) {
        case DATA_RECEIVED: 
            const {
                dataSource,
                total,
                currentPage,
                pageSize,
                paymentType,
                approvalStatus,
                receivablesName, 
                createUserName, 
            } = parseData(action.params);
            return state.updateIn(['dataSource'], () => {
                return Immutable.fromJS(dataSource);
            }).updateIn(['total'], () => {
                return total;
            }).updateIn(['currentPage'], () => {
                return currentPage;
            }).updateIn(['paymentType'], () => {
                return paymentType;
            }).updateIn(['approvalStatus'], () => {
                return approvalStatus;
            }).updateIn(['receivablesName'], () => {
                return receivablesName;
            }).updateIn(['createUserName'], () => {
                return createUserName;
            }).updateIn(['pageSize'], () => {
                return pageSize;
            });
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
