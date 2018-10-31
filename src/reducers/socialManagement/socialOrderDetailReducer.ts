import * as Immutable from 'immutable';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    SOCIAL_ORDER_DETAIL_REDUCERS,
    FETCHING,
    
} from './../../action/socialManagement/socialOrderDetailAction';
import { eachUpdateIn } from '../../util/immutableUtil'; 
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy:'DEADLINE',
    
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: {
        orderData:{},
        invoiceData:{},
        expressData:[],
        socialData:{}
    },
    fetching: true,
    searchParams,
   
});

export const socialOrderDetailReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case SOCIAL_ORDER_DETAIL_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data));
        }
       
        default: return state
    }
}




