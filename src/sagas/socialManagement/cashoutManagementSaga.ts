import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    CASHOUT_MANAGEMENT_SAGA,
    cashoutManagementReducers,
    fetching,
} from '../../action/socialManagement/cashoutManagementAction';
import * as moment from 'moment';
import { 
    cashoutManagementApi, 
   
} from '../../api/socialManagement/cashoutManagementApi';
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
        case CASHOUT_MANAGEMENT_SAGA: {  // 第三步 action被传入redux（saga）中间件处理，产生新的action，并将新的action传入reducer中
            
            const startTime = newParams['factplanPayTimeStart'];
            if(startTime){
                newParams['factplanPayTimeStart'] = moment(startTime+' 00:00:00').valueOf()/1000;
            }
            const endTime = newParams['factplanPayTimeEnd'];
            if(endTime){
                newParams['factplanPayTimeEnd'] = moment(endTime+' 23:59:59').valueOf()/1000;
            }
            let data = yield cashoutManagementApi(newParams); //这里是ajax请求回来的内容
            console.log(data);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                 yield put(cashoutManagementReducers(data)); //  dispatch一个action到reducer， data是请求返回的数据   这是产生新的action，并将新的action传入reducer中
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
export default  function* watchcashoutManagement() {
    yield takeEvery([CASHOUT_MANAGEMENT_SAGA], incrementAsync)
}
