import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import {
    message
} from 'antd';
import {
    SOCIAL_ORDER_SUBMIT_SAGA,
    SOCIAL_ORDER_BILL_SAGA,
    socialOrderSubmitReducers,
    socialOrderBillReducers,
    fetching,
} from '../../action/socialManagement/socialOrderSubmitAction';
import { ROUTER_PATH, WSS, DOMAIN_OXT,PHP_DOMAIN } from '../../global/global';
import { 
    
    socialOrderSubmitApi,
    socialOrderBillApi
   
} from '../../api/socialManagement/socialOrderSubmitApi';
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
        
        case SOCIAL_ORDER_BILL_SAGA: {
            
            let data = yield socialOrderBillApi(newParams);
            data.type = params.type;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                 yield put(socialOrderBillReducers(data));
            }
            break;
        }
        case SOCIAL_ORDER_SUBMIT_SAGA: {
            
            
            let data = yield socialOrderSubmitApi(newParams);

           
            params.setSubmitLoading && params.setSubmitLoading();
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                const id = data.data;
                if(id){
                    message.success('提交成功',2,()=>{
                        params.callback && params.callback()
                    })
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
export default  function* watchSocialOrderSubmit() {
    yield takeEvery([SOCIAL_ORDER_SUBMIT_SAGA,SOCIAL_ORDER_BILL_SAGA], incrementAsync)
}
