import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    CASHOUT_MANAGEMENT_BILL_SAGA,
    cashoutManagementBillReducers,
    fetching,
} from '../../action/socialManagement/cashoutManagementBillAction';

import { 
    cashoutManagementBillApi, 
   
} from '../../api/socialManagement/cashoutManagementBillApi';
import { mapCurrentPageToStart } from '../../util/pagination'; 



export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    /**去除为空的参数给后台 */
    
    yield put(fetching(true));
    const newParams = mapCurrentPageToStart(removeEmpty(params));
    switch (type) {
        case CASHOUT_MANAGEMENT_BILL_SAGA: {
            
            let data = yield cashoutManagementBillApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                 yield put(cashoutManagementBillReducers(data));
            }
            // yield put(cashoutTransferBymeReducers(data));
            break;
        }
        
        
        
    }
    yield put(fetching(false));
}
const removeEmpty = (obj:any) => {
    let newObj ={};
    for (var key in obj) {
        if (obj[key]!=='') {
            newObj[key] = obj[key];
            
        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default  function* watchCashoutManagementBill() {
    yield takeEvery([CASHOUT_MANAGEMENT_BILL_SAGA], incrementAsync)
}
