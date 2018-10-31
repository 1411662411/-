import * as Immutable from 'immutable';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    SOCIAL_ORDER_SUBMIT_REDUCERS,
    SOCIAL_ORDER_BILL_REDUCERS,
    FETCHING,
    
} from './../../action/socialManagement/socialOrderSubmitAction';
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
    dataSource: [],
    socialBillData:{
        list:[],
        total:{}
    },
    fetching: true,
    searchParams,
   
});

export const socialOrderSubmitReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case SOCIAL_ORDER_BILL_REDUCERS: {
            const list = data.type === 6 ? data.data.list:data.data.jsOrderSocialDetailSp
            const total = data.type === 6 ? data.data.jdWagesBillDto:data.data.total
            const socialBillData ={
                list,
                total
            }
            return state.update('socialBillData', () => Immutable.fromJS(socialBillData)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
        case SOCIAL_ORDER_SUBMIT_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
                );
        }
        
       
        default: return state
    }
}




