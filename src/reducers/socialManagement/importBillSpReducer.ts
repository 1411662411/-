import * as Immutable from 'immutable';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    IMPORT_BILL_SP_REDUCERS,
    FETCHING,
    
} from './../../action/socialManagement/importBillSpAction';
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
    dataSource: {},
    fetching: true,
    searchParams,
   
});

export const importBillSpReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case IMPORT_BILL_SP_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
       
        default: return state
    }
}




