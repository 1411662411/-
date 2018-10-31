import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    CASH_CLAIM_REDUCERS,
    CASH_CLAIM_CBS_REDUCERS,
    TRANSACTION_HIS_REDUCERS,
    IFNEEDOPENINVOICE_REDUCERS,
    CASH_CLAIM_CHECK_REDUCERS,
    CASH_CLAIM_COMMIT_REDUCERS,
    FETCHING,
    
} from './../../action/saleWorkbench/cashClaimAction';
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
    LocalDataSource: [],
    transactionHisData: {},
    needIvoice:false,
    fetching: true,
    claimableData:{},
    searchParams,
   
});

export const cashClaimReducers = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case CASH_CLAIM_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
    
        case TRANSACTION_HIS_REDUCERS: {
            return state.update('transactionHisData', () => Immutable.fromJS(data.data));
                
        }
        case CASH_CLAIM_CBS_REDUCERS: {
            return state.update('LocalDataSource', () => Immutable.fromJS(data.data.records));
        }
        case CASH_CLAIM_CHECK_REDUCERS: {
            
            return state.update('claimableData', () => Immutable.fromJS(data.data));
        }
        case IFNEEDOPENINVOICE_REDUCERS: {
            return state.update('needIvoice', () => data.data === 1);
        }
        // case CASH_CLAIM_COMMIT_REDUCERS: {
        //     // return 
        // }
       
        default: return state
    }
}




