import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd';
import { mapCurrentPageToStart } from '../../util/pagination'; 
import {
    ORDER_LIST_SAGA,
    orderListReducers,
    ORDER_DISMISSREASON_SAGA,
    orderDismissreasonReducers,
    ORDER_REPEAL_SAGA,
    orderRepealReducers,
    fetching,
    
} from '../../action/businessComponents/orderListAction';
    
import { orderListApi, dismissReasonApi,orderRepealApi} from '../../api/businessComponents/orderListApi';



function* getOrderList(obj) {
    const {
        type,
        params,
    } = obj;
    yield put(fetching(true));
    switch (obj.type) {
        case ORDER_LIST_SAGA : {
            
            let data = yield orderListApi(mapCurrentPageToStart(removeEmpty(obj.params)));
            data.currentPage = obj.params.currentPage;
            data.pageSize = obj.params.pageSize;
            const records = data.data;
            const dismissOrderId:any = [];
            // 遍历被驳回的id
            records && records.length > 0 && records.map((item) => {
                if( item.orderStaus == 150 ){
                    dismissOrderId.push(item.orderCode)
                }
            })
            if(dismissOrderId.length>0){
                let dismissData = yield dismissReasonApi({codes:dismissOrderId.toString()});
                if(dismissData){
                    // 挂载驳回原因

                    data.dismissData = dismissData.data;
                }
                
            }
            yield put(orderListReducers(data));
            
            
           
            break;
        }
        case ORDER_DISMISSREASON_SAGA : {
            let data = yield dismissReasonApi(obj.params);
           
            yield put(orderDismissreasonReducers(data));
            break;
        } 
        case ORDER_REPEAL_SAGA : {
            let data = yield orderRepealApi(obj.params);
            if (data.status === 0 || data.error === 0) {
                message.success('撤销成功',2,()=>{
                    params.callback && params.callback()
                })
            }
            yield put(orderRepealReducers(data));
            break;
        }
        default:
            throw ('error: noMatch in invoiceSaga')
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
export default function* watchOrderListSaga() {
    yield takeEvery([ORDER_LIST_SAGA,ORDER_DISMISSREASON_SAGA,ORDER_REPEAL_SAGA], getOrderList)
}