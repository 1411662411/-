import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    BLACKLISTMANAGEMENT_SAGA,
    blacklistReducers,
    BLACKLISTMANAGEMENT_EDIT_SAGA,
    blacklistEditReducers,
    fetching,
} from '../../action/socialManagement/blacklistManagementAction';

import { 
    blacklistApi,
    blacklistEditApi
} from '../../api/socialManagement/blacklistManagementApi';
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
        case BLACKLISTMANAGEMENT_SAGA: {
            
            let data = yield blacklistApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                
                yield put(blacklistReducers(data));
            }
            break;
        }
        case BLACKLISTMANAGEMENT_EDIT_SAGA: {
            let data = yield blacklistEditApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                
                if(params.id){  
                    if(params.isValid===0){
                        message.success('删除成功！')
                    }else{
                        message.success('编辑成功！')
                    }
                }else{
                    message.success('添加成功！')
                }
                params.callback && params.callback();
                
                
            }else{
                // 报错文案
                const text = data.msg 
                if(text){
                    // message.error(text.toString())
                    params.closeLoading && params.closeLoading();
                }
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
export default  function* watchBlacklistManagement() {
    yield takeEvery([BLACKLISTMANAGEMENT_SAGA,BLACKLISTMANAGEMENT_EDIT_SAGA], incrementAsync)
}
