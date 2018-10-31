import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    INVOICES_SEND_LIST_REDUCERS,
    INVOICES_EXPORTDATACOUNT_REDUCERS,
    FETCHING,
    
} from './../../action/financialManagement/invoicesSendAction';
import { eachUpdateIn } from '../../util/immutableUtil'; 
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy:'DEADLINE',
    
};
interface exportdatacount {
    count1:number;
    count2:number;
    count3:number;
    count4:number;
}
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
    fetching: true,
    searchParams,
   
});

export const invoicesSendReducers = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case INVOICES_SEND_LIST_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
        case INVOICES_EXPORTDATACOUNT_REDUCERS: {
            if(data.data){
                return state.update('exportdatacount', () => data.data);
            }
            
        }
       
        default: return state
    }
}




