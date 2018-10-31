import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    CASHOUT_IMPORT_RECORD_REDUCERS,
    FETCHING,
    
} from './../../action/socialManagement/cashoutImportRecordAction';
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

export const cashoutImportRecord = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case CASHOUT_IMPORT_RECORD_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
       
        default: return state
    }
}




