import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { PAGINATION_PARAMS } from '../../global/global';
import { RES_PAYMENTLIST_REDUCERS,FETCHING,} from './../../action/socialManagement/resPaymentListAction';
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

export const resPaymentListReducer = (state = initialState, action) => {
    
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
            
        }
        case RES_PAYMENTLIST_REDUCERS: {
            
            return state.update('dataSource', () => Immutable.fromJS(data.data)).update( 'isFetching', () => false ).update('total', () => data.recordsTotal);
        }
       
        default: return state
    }
}




