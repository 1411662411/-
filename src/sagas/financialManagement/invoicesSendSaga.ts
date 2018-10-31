import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    INVOICES_SEND_LIST_SAGA,
    invoicesSendListReducers,
    INVOICES_EXPORTDATACOUNT_SAGA,
    invoicesExportdatacountReducers,
    fetching,
} from '../../action/financialManagement/invoicesSendAction';

import { 
    invoicesSendListApi,
    invoicesExportdatacountApi,
   
} from '../../api/financialManagement/invoicesSendApi';
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
        case INVOICES_SEND_LIST_SAGA: {
            let data = yield invoicesSendListApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                debugger
                 yield put(invoicesSendListReducers(data));
            }
            break;
        }
        case INVOICES_EXPORTDATACOUNT_SAGA: {
            let data = yield invoicesExportdatacountApi(newParams);

           
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                 yield put(invoicesExportdatacountReducers(data));
            }
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
export default  function* watchInvoicesSendSaga() {
    yield takeEvery([INVOICES_SEND_LIST_SAGA,INVOICES_EXPORTDATACOUNT_SAGA], incrementAsync)
}
