import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import { ROUTER_PATH, WSS, DOMAIN_OXT } from '../../global/global';
import {
    IMPORT_BILL_SP_SAGA,
    importBillSpReducers,
    IMPORT_BILL_SP_SUMIT_SAGA,
    importBillSpSubmitReducers,
    fetching,
} from '../../action/socialManagement/importBillSpAction';
import { 
    importBillSpDetailApi,
    importBillSpSubmitApi,
    copyinvoicefromspApi,
    getUserListByOrgNameApi,
   
} from '../../api/socialManagement/importBillSpApi';
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
        case IMPORT_BILL_SP_SAGA: {
            
            let data = yield importBillSpDetailApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                let temp ={...data.data,}
                let approvalUser = yield getUserListByOrgNameApi({name:'薪酬服务部'})
                if (Number(approvalUser.error) === 0 || Number(approvalUser.status) === 0) {
              
                    temp.approvalUser = approvalUser.data;
                }
                
                yield put(importBillSpReducers(temp));
                
            }
            break;
        }
        case IMPORT_BILL_SP_SUMIT_SAGA: {
            
            
            const {
                type,
                cId,
                companyName,
                paymentDeadLine,
                excelDataKey,
                remark
            } = params;
  
            
        
            let data = yield importBillSpSubmitApi(newParams);

            
            params.setSubmitLoading && params.setSubmitLoading()
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                const {
                    
                } = params;

                message.success('提交成功',2,()=>{
                    const submitParams = {
                        cId,
                        companyName,
                        paymentDeadLine,
                        remark,
                        ...params,
                        // 单独添加标识给提交页面
                        status: 'done', 
                        detailIds: type ===5?data.data.detailIds:excelDataKey
                    }
                    sessionStorage.setItem('IMPORT_BILL_SUMIT_PARAMS', JSON.stringify(submitParams));
                    browserHistory.push(`${ROUTER_PATH}/newadmin/company/adviser/socialordersubmit`);
                })
                
                // yield put(importBillSpSubmitReducers(data));
            }
            if(type === 5){
                // java 需要同步发票信息单独发的请求
                yield copyinvoicefromspApi({cId:params.cId});
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
export default  function* watchImportBillSp() {
    yield takeEvery([IMPORT_BILL_SP_SAGA,IMPORT_BILL_SP_SUMIT_SAGA], incrementAsync)
}
