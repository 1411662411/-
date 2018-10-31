import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { ROUTER_PATH, WSS, DOMAIN_OXT, PHP_DOMAIN,PAGINATION_PARAMS} from '../../global/global';
import {
    message,
    Modal
} from 'antd';
const confirm = Modal.confirm;
import {
    CASH_CLAIM_SAGA,
    TRANSACTION_HIS_SAGA,
    IFNEEDOPENINVOICE_SAGA,
    CASH_CLAIM_CHECK_SAGA,
    CASH_CLAIM_COMMIT_SAGA,
    cashClaimReducers,
    cashClaimCbsReducers,
    transactionHisReducers,
    ifneedopeninvoiceReducers,
    cashClaimCheckReducers,
    cashClaimCommitReducers,
    fetching,
} from '../../action/saleWorkbench/cashClaimAction';

import {
    cashClaimApi,
    cashClaimCbsApi,
    transactionHisApi,
    ifNeedOpenInvoiceApi,
    cashClaimCheckApi,
    cashClaimCommitApi,

} from '../../api/saleWorkbench/cashClaimApi';
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
        case CASH_CLAIM_SAGA: {
            let data = yield cashClaimApi(newParams);

            data.currentPage = params.currentPage;
            data.pageSize = params.pageSize;
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(cashClaimReducers(data));
            }
            break;
        }
        case TRANSACTION_HIS_SAGA: {
            let data = yield transactionHisApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                if (data.data.rejectReason) {
                    let cbsData = yield cashClaimCbsApi(newParams);
                    if (Number(cbsData.error) === 0 || Number(cbsData.status) === 0) {
                        yield put(cashClaimCbsReducers(cbsData));
                    }
                }
                yield put(transactionHisReducers(data));
            }
            break;
        }
        case IFNEEDOPENINVOICE_SAGA: {

            let data = yield ifNeedOpenInvoiceApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(ifneedopeninvoiceReducers(data));
            }
            break;
        }

        case CASH_CLAIM_CHECK_SAGA: {
            let data = yield cashClaimCheckApi(newParams);

            if (Number(data.error) === 0 || Number(data.status) === 0) {
                const claimableType = data.data.claimable;
              
                // if(claimableType === 1){
                //     confirm({
                //         title: `<div></div>亲，该笔交易纪录已被<span class="my-dialog-red">${data.data.claimDetail}</span>认领，本认款无法继续进行，请确认收款方。如之前认领有误，请紧急联系财务人员。`,
                //         onOk() {
                //             params.callback();
                //         }
                    
                //     });
                // }
                if(claimableType !=1 && claimableType !=2 && claimableType !=4  && claimableType !=5){
                    params.callback && params.callback();
                }
                params.callSetState && params.callSetState();
                data.data.saveParam = newParams;
                yield put(cashClaimCheckReducers(data));
            }
            break;
        }
        case CASH_CLAIM_COMMIT_SAGA: {
            let data = yield cashClaimCommitApi(newParams);

            if (Number(data.error) === 0 || Number(data.status) === 0) {
                localStorage.cashclaimLocalSelectRows = '';
                localStorage.cashclaimLocalSelectKeys = '';
                delete localStorage.cashclaimLocalSelectRows;
                delete localStorage.cashclaimLocalSelectKeys;
                
                message.success('操作成功',2,function(){
                    if(document.referrer.indexOf('newadmin/singlepage/social/adviserOrderList')>0){
                        window.location.href = `${PHP_DOMAIN}/social/company/adviser/overviewpage?tabindex=2`
                    }else{
                        window.history.go(-1);
                    }
                    
                });
                // yield put(cashClaimCommitReducers(data));
            }
            break;
        }



    }
    yield put(fetching(false));
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
export default function* cashClaimSaga() {
    yield takeEvery([CASH_CLAIM_SAGA, TRANSACTION_HIS_SAGA, IFNEEDOPENINVOICE_SAGA,CASH_CLAIM_CHECK_SAGA, CASH_CLAIM_COMMIT_SAGA], incrementAsync)
}
