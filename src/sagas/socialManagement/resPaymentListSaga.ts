import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd';
import * as moment from 'moment';
import { mapCurrentPageToStart } from '../../util/pagination';
import { resPaymentListApi,
        startMergePaymentApi,
        getPaymentDetailApi,
} from '../../api/socialManagement/resPaymentListApi';
import {
    RES_PAYMENTLIST_SAGA,START_MERGE_PAYMENT_SAGA,GET_PAYMENT_DATEIL_SAGA,
    resPaymentListReducers,
    fetching,} 
from '../../action/socialManagement/resPaymentListAction';


export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    // console.log(params);
    /**去除为空的参数给后台 */
    
    yield put(fetching(true));
    const newParams = mapCurrentPageToStart(removeEmpty(params));
    switch (type) {
        case RES_PAYMENTLIST_SAGA: {  // 第三步 action被传入redux（saga）中间件处理，产生新的action，并将新的action传入reducer中
            let data = yield resPaymentListApi(newParams); //这里是ajax请求回来的内容
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.errcode) === 0 || Number(data.status) === 0) {
                 yield put(resPaymentListReducers(data)); //  dispatch一个action到reducer， data是请求返回的数据   这是产生新的action，并将新的action传入reducer中
            }
            // yield put(cashoutTransferBymeReducers(data));
            break;
        }
        case START_MERGE_PAYMENT_SAGA:{
            let data = yield startMergePaymentApi(newParams); //这里是ajax请求回来的内容
            break;
        }
        case GET_PAYMENT_DATEIL_SAGA:{
            let data = yield getPaymentDetailApi(newParams); //这里是ajax请求回来的内容
            console.log(data);
            break;
        }
        
        
        
    }
    // yield put(fetching(false));
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
export default  function* resPaymentlist() {
    yield takeEvery([RES_PAYMENTLIST_SAGA,START_MERGE_PAYMENT_SAGA,GET_PAYMENT_DATEIL_SAGA], incrementAsync)
}
