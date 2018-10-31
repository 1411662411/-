import * as Immutable from 'immutable';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    BLACKLISTMANAGEMENT_REDUCERS,
    FETCHING,
    
} from './../../action/socialManagement/blacklistManagementAction';
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
    fetching: true,
    searchParams,
   
});

export const blacklistManagementReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case BLACKLISTMANAGEMENT_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
            ).update('total', () => data.recordsTotal);
        }
       
        default: return state
    }
}




