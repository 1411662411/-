import * as Immutable from 'immutable';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    ORDER_LIST_REDUCERS,
    ORDER_DISMISSREASON_REDUCERS,
    FETCHING,
} from '../../action/businessComponents/orderListAction';
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy:'DEADLINE',
    
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: [],
    exportdatacount: {
        count1:0,
        count2:0,
        count3:0,
        count4:0
    },
    dismissReason:{},
    fetching: true,
    searchParams,
   
});
export const orderListReducer = (state=initialState, action) => {
    const {
        type,
        params,
    } = action;
    const data = action.params;
    switch (type) {
        case ORDER_LIST_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data || [])
                ).update('dismissReason', () => Immutable.fromJS(data.dismissData || [])
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
        case ORDER_DISMISSREASON_REDUCERS: {
            return state.update('dismissReason', () => Immutable.fromJS(data.data || []));
        }
        case FETCHING : {
            return state.update('fetching', () => params);
        }
        default:
            return state
    }
};