import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    SOCIAL_ORDER_DETAIL_SAGA,
    socialOrderDetailReducers,
    UPDATE_ORDER_REMARK_SAGA,
    fetching,
} from '../../action/socialManagement/socialOrderDetailAction';

import { 
    orderDetailApi,
    invoiceDetailApi,
    socialOrderDetailApi,
    invoiceExpressDetailApi,
    updateOrderRemarkApi
   
} from '../../api/socialManagement/socialOrderDetailApi';
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
        case SOCIAL_ORDER_DETAIL_SAGA: {
            
            let data = yield orderDetailApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                // 后台接口太多，前端自己组合数据
                let assemblyData = {
                    orderData:{},
                    invoiceData:{},
                    expressData:[],
                    socialData:{}
                }
                let records = data.data.records;
                
                if(records && records.length>0){
                    const orderDetail = records[0];
                    const orderId = orderDetail.id;
                    const orderCode = orderDetail.order_code;
                    const invoiceId = orderDetail.invoice_id;
                    const orderType = orderDetail.order_type;

                    assemblyData.orderData = orderDetail;
                    if(invoiceId){
                        // 获取发票详情
                        const invoiceData = yield invoiceDetailApi({orderId,less:1});
                        if (Number(invoiceData.error) === 0 || Number(invoiceData.status) === 0) {
                            assemblyData.invoiceData = invoiceData.data;
                        }
                        // 获取快递详情
                        const expressData = yield invoiceExpressDetailApi({invoiceId});
                        if (Number(expressData.error) === 0 || Number(invoiceData.status) === 0) {
                            assemblyData.expressData = expressData.data;
                        }

                    }
                    
                    // 1 会员订单 2 社保订单 3商保订单 4补差订单 5sp订单 6多多订单
                    if(orderType === 2 || orderType === 4 || orderType === 5 || orderType === 6){
                        // 获取社保详情
                        const socialData = yield socialOrderDetailApi({orderId,orderType,orderCode});
                        if (Number(socialData.error) === 0 || Number(socialData.status) === 0) {
                            assemblyData.socialData = socialData.data;
                            if(orderType === 6){
                                const billData ={
                                    list:socialData.data.list||[],
                                    total:socialData.data.jdWagesBillDto|| {},
                                }
                                assemblyData.socialData = billData;
                            }
                            
                        }
                    }
                }
                yield put(socialOrderDetailReducers(assemblyData));
            }
            break;
        }
        case UPDATE_ORDER_REMARK_SAGA: {
            let data = yield updateOrderRemarkApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                message.success('备注修改成功！')
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
export default  function* watchSocialOrderDetail() {
    yield takeEvery([SOCIAL_ORDER_DETAIL_SAGA,UPDATE_ORDER_REMARK_SAGA], incrementAsync)
}
