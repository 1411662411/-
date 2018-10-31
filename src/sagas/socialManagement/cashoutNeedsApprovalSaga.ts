import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import * as moment from 'moment';
import {
    cashoutNeedsApprovalSaga,
    cashoutNeedsApprovalData,
    USER_BY_ORGANIZATIONS_SAGA,
    userByOrganizationsData,
    CASHOUT_NEEDS_APPROVAL_SAGA,
    CASHOUT_BATCH_EXPORT_PAYMENT_SAGA,
    batchExportPaymentData,
    CASHOUT_MASTER_APPROVE_SAGA,
    masterApproveData,
    USER_MAP_SAGA,
    userMapData,
    
    fetching,
} from '../../action/socialManagement/cashoutNeedsApprovalAction';


import { 
    getCashoutApprovalApi,
    userByOrganizationsApi,
    batchExportPaymentApi,
    masterApproveApi, 
} from '../../api/socialManagement/cashoutNeedsApprovalApi';
import { 
    userMapApi,
} from '../../api/socialManagement/cashoutTransferBymeApi';
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
        case CASHOUT_NEEDS_APPROVAL_SAGA: {
            
            // 时间格式后台要毫秒数
            const planPayTime = newParams['planTime'];
            if(planPayTime){
                newParams['planPayTime'] = moment(planPayTime).valueOf()/1000;
            }
            
            let data = yield getCashoutApprovalApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                data.currentPage = params.currentPage;
                data.pageSize = params.pageSize;
                
                yield put(cashoutNeedsApprovalData(data));
                
            }
            
            break;
        }
        case USER_BY_ORGANIZATIONS_SAGA: {
            let data = yield userByOrganizationsApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(userByOrganizationsData(data));
            }
            
            break;
        }
        case USER_MAP_SAGA: {
            let data = yield userMapApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                 yield put(userMapData(data));
            }
           
            break;
        }
        case CASHOUT_BATCH_EXPORT_PAYMENT_SAGA: {
            // let params = mapCurrentPageToStart(obj.params);
            let data = yield batchExportPaymentApi(newParams);
            
           if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(batchExportPaymentData(data));
            }
            
            break;
        }
        case CASHOUT_MASTER_APPROVE_SAGA: {
            let data = yield masterApproveApi(newParams);
            
            // params.approveOpinion==1
            
            params.fetching && params.fetching();
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(masterApproveData(data));
                const errmsg = params.updateTime?'设置成功':'审批成功';
                message.success(data.errmsg || errmsg,2,()=>{
                    params.callback();
                })
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
export default  function* watchCashoutNeedsApproval() {
    yield takeEvery([
        CASHOUT_NEEDS_APPROVAL_SAGA,
        CASHOUT_BATCH_EXPORT_PAYMENT_SAGA,
        CASHOUT_MASTER_APPROVE_SAGA,
        USER_BY_ORGANIZATIONS_SAGA,
        USER_MAP_SAGA,
        ], incrementAsync)
}
