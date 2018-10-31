import * as _ from 'lodash';
import * as Immutable from 'immutable';
import {
    GET_ORDER_INFO,
    CONFIRM_INFO_ORDER_TABLE_ACTION,
    CONFIRM_ORDER_SEARCH_DATA_RECEIVED,
    CONFIRM_ORDER_DATA_RECEIVED,
    IS_FETCHING,
    HIDE_MODAL,
    REJECT_ORDER,
    REJECT_ORDER_DATA_RECEIVED,
} from './../../action/financialManagement/fundConfirmInfoAction';

const initialState = Immutable.fromJS({
    orderData: "",
    dataSource: {},
    current: 1,
    total: 1,
    pageSize: 20,
    company: '',
    orderContent: '', 
    orderMoney: '',
    visible: false,
    confirmType: '',
    isFetching: true,
});

function fundConfirmInfo(state = initialState, action) {
    switch (action.type) {
        case GET_ORDER_INFO: {
            return state.update('orderData', () => action.data);
        }
        case CONFIRM_INFO_ORDER_TABLE_ACTION: {
            return state.update('current', () => action.pages.start || 0)
                    .update('pageSize', () => action.pages.length || 20)
                    .update('total', () => action.data.recordsTotal || 1)
                    .update('dataSource', () => action.data);
            // return {
            //     ...state,
            //     current: action.pages.start|0,
            //     pageSize: action.pages.length||20,
            //     total: action.data.recordsTotal||1,
            //     dataSource: action.data}
        }
        case CONFIRM_ORDER_SEARCH_DATA_RECEIVED: {
            const params = action.params;
            const company =  params.data.records.data[0].c_name;/* 公司名字 */
            const orderContent = params.data.records.data[0].order_name; /* 订单内容 */
            const orderMoney = params.data.records.data[0].order_money; /* 订单金额 */
            return state.update('company', () => company)
                    .update('orderContent', () => orderContent)
                    .update('orderMoney', () => orderMoney)
                    .update('confirmType', () => 'confirm')
                    .update('visible', () => true);
            // return {
            //     ...state,
            //     company,
            //     orderContent,
            //     orderMoney,
            //     confirmType: 'confirm',
            //     visible: true,
            // }
        }
        case CONFIRM_ORDER_DATA_RECEIVED:
        case REJECT_ORDER_DATA_RECEIVED: {
            return state.update('visible', () => false);
            // return {
            //     ...state,
            //     visible: false,
            // }
        }
        case IS_FETCHING : {
            return state.update('isFetching', () => action.params.isFetching);
        }
        case HIDE_MODAL : {
            return state.update('visible', () => action.params.visible);
            // visible
            // return {
            //     ...state,
            //     ...action.params,
            // }
        }
        case REJECT_ORDER : {
            return state.update('visible', () => action.params.visible)
                    .update('confirmType', () => 'reject');
            // return {
            //     ...state,
            //     ...action.params,
            // }
        }
        default:
            return state
    }
}

export { fundConfirmInfo }