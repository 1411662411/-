import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    DATA_RECEIVED,
    FETCHING,
    UPDATE_SEARCH_PARAMS,
    UPDATE_CACHE_SEARCH_PARAMS,
    ORDER_TYPE,
    ORDER_CONFIRM_STATE,
    DEAD_LINE_STATE,
    TIME_RANGE,
    GET_CURRENT_PAGE,
    SET_LOADING,
    GET_DEFAULT_C_NAME,
    SET_DEFAULT_PAGESIZE,
    DEFAULT_ORDER_CODE,
    SWITCH_CHANGE_SET,
} from './../../action/financialManagement/fundConfirmAction';
import { eachUpdateIn } from '../../util/immutableUtil'; 
const searchParams = {
    ...PAGINATION_PARAMS,
    orderType: '',
    customerName: '',
    orderCode: '',
    confirmStatus: '0',

    
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: [],
    fetching: true,
    searchStatus: true, /*用于判断是否点击了搜索按钮 */
    searchParams,
    cacheSearchParams: _.assign({}, searchParams),  /* 用于只是改变组件状态的参数 */
    switchStatus: 0,
    badge: [],
});

export const fundConfirm = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case DATA_RECEIVED: {
            return state.update('dataSource', () => 
                    Immutable.fromJS(data.data)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'currentPage'], () => data.currentPage
                ).updateIn(['cacheSearchParams', 'pageSize'], () => data.pageSize
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                ).update('switchStatus', () => data.switchStatus)
                .update('badge', () => Immutable.fromJS(data.badge.map(item => item.orderType) || []))
        }
        case UPDATE_SEARCH_PARAMS: {
            state = state.update('searchStatus', () => data.searchStatus);
            delete data.searchStatus;
            return eachUpdateIn(state, data, ['searchParams']);
        }
        case UPDATE_CACHE_SEARCH_PARAMS: {
            state = state.update('searchStatus', () => data.searchStatus);
            delete data.searchStatus;
            return eachUpdateIn(state, data, ['cacheSearchParams']);
        }
        case SWITCH_CHANGE_SET: {
            return state.update('switchStatus', () => data);
        }
        default: return state
    }
}




