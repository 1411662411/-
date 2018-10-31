import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    PAYEEMANAGEMENT_REDUCERS,
    FETCHING,
    PAYEESOURCE_REDUCERS,

} from '../../action/socialManagement/payeeManagementAction';
/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    fetching: false,
    dataSource:[],
    setData:{},
    total:0,
    payeeSource:[],
})
export const payeeManagementReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case PAYEEMANAGEMENT_REDUCERS: {
            // 查询
            if(data.type == 'query'){
                // let dataSource:Array<any> = [];
                const records = data.data.records||[];
                // records.map(function (item) {
                //     dataSource.push({
                //         ...item,
                //         financeTypeData:{
                //             editable:false,
                //             value:item.financeType,
                //         },
                //         branchNameData:{
                //             editable:false,
                //             value:item.branchName,
                //         },
                //         cityData:{
                //             editable:false,
                //             value:item.cityName,
                //         },
                //         depositNameData:{
                //             editable:false,
                //             value:item.depositName,
                //         },
                //         depositAccountData:{
                //             editable:false,
                //             value:item.depositAccount,
                //         },
                //         remarkData:{
                //             editable:false,
                //             value:item.remark,
                //         }
                //     }
                        
                //     )
                // })
            
                return state.update('total', () => data.recordsTotal).update('dataSource', () => Immutable.fromJS(records));
            }else{
                
                return state.update('setData', () => Immutable.fromJS(data));
            }
            
        }
        case PAYEESOURCE_REDUCERS: {
            // 
            return state.update('payeeSource', () => Immutable.fromJS(data.data.records));
        }
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });

        }
        
        default: return state
    }
}