import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    DUODUO_ORDER_DETAIL_DIS,
    duoduoOrderDetailSaga,
    DUODUO_LIST_DETAIL_DIS,
    duoduoListDetailSaga,
    DUODUO_EXPORT_DETAIL_DIS,
    duoduoExportDetailSaga,
    DUODUO_UPLOAD_DETAIL_DIS,
    duoduoUploadDetailSaga,
    DUODUO_UPLOAD_STATUS_DIS,
    
    duoduoUploadStatusSaga    
} from '../../action/socialManagement/importBillReviewAction';
import { DOMAIN_OXT } from "../../global/global";
import {
    orderDetailApi,
    orderListDetailApi,
    orderExportDetailApi,
    orderUploadDetailApi,
    orderUpdateDetailApi
} from '../../api/socialManagement/importBillReviewApi';

import { mapCurrentPageToStart } from '../../util/pagination'; 
export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    /**去除为空的参数给后台 */

  const  downloadFile=(url)=>{
        try {
            var elemIF = document.createElement("iframe");
            elemIF.src = url;
            elemIF.style.display = "none";
            document.body.appendChild(elemIF);
            message.success("下载成功！");
        } catch (e) {
            message.error("下载异常！");
        }
    }
    const newParams = mapCurrentPageToStart(removeEmpty(params));
    switch (type) {
        case DUODUO_ORDER_DETAIL_DIS: {

            let data = yield orderDetailApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                // 后台接口太多，前端自己组合数据
                yield put(duoduoOrderDetailSaga(data));
               
                }
               
                break;
            }
        case DUODUO_LIST_DETAIL_DIS: {

            let data = yield orderListDetailApi(newParams);
         
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                // 后台接口太多，前端自己组合数据
                yield put(duoduoListDetailSaga(data));
               
            }
            
            break;
        } 
        case DUODUO_EXPORT_DETAIL_DIS: {

            let data = yield orderExportDetailApi(newParams);
            
            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                downloadFile(`${DOMAIN_OXT}/apiv4_/v1/sppayu/download/download?fileName=${data.data}&type=EXCEL`)
            }
            break;
        } 
        case DUODUO_UPLOAD_DETAIL_DIS: {

            let data = yield orderUploadDetailApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                
                if (obj.calback){
                    yield orderUpdateDetailApi(obj.calback)
                }
                // 后台接口太多，前端自己组合数据
                yield put(duoduoUploadDetailSaga(data));
                message.success("操作成功");
                window.location.href = `${DOMAIN_OXT}/newadmin/social/salarymanagement/orderlist/`

            }

            break;
        } 
        case DUODUO_UPLOAD_STATUS_DIS: {

            let data = yield orderUpdateDetailApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                message.success("操作成功");
                window.location.href = `${DOMAIN_OXT}/newadmin/social/salarymanagement/orderlist/`
            }

            break;
        } 
        }
        



    }
    

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
export default function* watchDuoduoSocialOrderDetail() {
    yield takeEvery([
        DUODUO_ORDER_DETAIL_DIS,
        DUODUO_LIST_DETAIL_DIS,
        DUODUO_EXPORT_DETAIL_DIS,
        DUODUO_UPLOAD_DETAIL_DIS,
        DUODUO_UPLOAD_STATUS_DIS
    ], incrementAsync)
}
