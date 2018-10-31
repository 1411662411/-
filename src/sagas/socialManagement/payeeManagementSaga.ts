import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { DOMAIN_OXT } from '../../global/global';
import {
    message
} from 'antd';
import {
    PAYEEMANAGEMENT_SAGA,
    payeeManagementReducers,
    PAYEESOURCE_SAGA,
    payeesourceReducers,
    fetching,

} from '../../action/socialManagement/payeeManagementAction';
import {
   payeeManagementApi,
   payeesourceApi,

} from '../../api/socialManagement/payeeManagementApi';
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
        case PAYEEMANAGEMENT_SAGA: {
            const data = yield payeeManagementApi(newParams);
            if (data.errcode === 0 || data.status === 0) {
                
                data.type = params.type;
                yield put(payeeManagementReducers(data));
                
           
                if(params.type ==='save'){
                    message.success('新增成功');
                }
                if(params.type ==='edit'){
                    message.success('修改成功');
                }
                if(params.callback){
                    params.callback();
                }
                
            }
            break;
        }
        case PAYEESOURCE_SAGA: {
            const data = yield payeesourceApi();
            if (data.errcode === 0 || data.status === 0) {
                
                yield put(payeesourceReducers(data));
                
            }
            break;
        }
        
    }
    yield put(fetching(false));
}
/**
 * 去除空值对象给后台
 * @param obj{any} 对象
 * @return 
 */
const removeEmpty = (obj: any) => {
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];

        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default function* watchPayeeManagement() {
    yield takeEvery([
        PAYEEMANAGEMENT_SAGA,
        PAYEESOURCE_SAGA,
    ], incrementAsync)
}