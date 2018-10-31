/**
 * Created by caozheng on 2017/2/22.
 */
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import { DOMAIN_OXT } from '../../global/global';
import {
    getDetail,
    getTableDataAPI,
    setAuditFinance,
    getAccountListApi,
    emitSubmitApi,
    addPrepayments,
} from '../../api/financialManagement/cashOutDetailApi';
import {
    getCashOutDetailData,
    getCashOutTableData,
    setLoadingState,
    getAccountListData,
    CASH_OUT_ADDPREPAYMENTS_SAGA,
    CASH_OUT_DETAIL_TABLE_SAGA,
} from '../../action/financialManagement/cashOutDetailAction';
import { message } from 'antd';
import { formatDateTime } from '../../util/timeFormat';
import { mapCurrentPageToStart } from '../../util/pagination';

function* getCashOutDetail(param) {
    try {
        return yield getDetail(param)
    } catch (error) {
        message.error(error.toString(), 3)
    }
}

function* getTableData(param) {
    try {
        return yield getTableDataAPI(param)
    } catch (error) {
        message.error(error.toString(), 3)
    }
}

function* getAccountList() {
    try {
        return yield getAccountListApi();
    } catch (error) {
        message.error(error.toString(), 3)
    }
}

function* emitSubmit(param) {
    try {
        return yield emitSubmitApi(param);
    } catch (error) {
        message.error(error.toString(), 3)
    }
}

function* getCashOutAsync(action) {
    yield put(setLoadingState(true));
    // const newParams:any = mapCurrentPageToStart(action.param);
    switch (action.type) {
        case 'CASH_OUT_DETAIL_SAGA': {
            const newParams:any = mapCurrentPageToStart(action.param);
            let detailData = yield getCashOutDetail(newParams);
            let {
                orderNum,
                company,
                requestNature,
                month,
                city,
                length,
                start,
            } = newParams;
            yield put(getCashOutDetailData(detailData.data || {}));
            let data = detailData.data;
            let tableParam: any;
            if (orderNum) {
                tableParam = {
                    length,
                    start,
                    policyId: data.areaPolicyId,
                    insuranceFeesMonth: formatDateTime(data.insuranceFeesMonth, 'merge'),
                    financeType: data.businessType,
                    isCommit: 1,
                    serviceName: data.branchName,
                    qOrderId: orderNum,
                    isCost: data.payStatus || 0,
                    // city: detailData.data.areaPolicyId,
                    // type: 14, // 这个需要动态判定
                };
            }
            else {
                tableParam = {
                    length,
                    start,
                    policyId: city,
                    insuranceFeesMonth: month,
                    financeType: requestNature,
                    isCommit: 0,
                    serviceName: company,
                    isCost: 0,
                    // city: detailData.data.areaPolicyId,
                    // type: 14, // 这个需要动态判定
                };
            }
           
            let tableData = yield getTableData(tableParam);
            yield put(getCashOutTableData({ tableData, businessType: tableParam.financeType }));
        } break;
        case 'CASH_OUT_DETAIL_TABLE_SAGA': {
            const newParams:any = mapCurrentPageToStart(action.param);
         
            const orderNum = newParams.orderNum;
            if(orderNum) {
                newParams.qOrderId = orderNum;
                newParams.isCommit = 1;
            }else {
                newParams.isCommit = 0;
            }
            let tableData = yield getTableData(newParams);

            yield put(getCashOutTableData({ tableData, businessType: newParams.financeType }));
        }
        break;
        case 'CASH_OUT_AUDIT_FINANCE_SAGA': {
            let data = yield setAuditFinance(action.param);
            if (data.status === 0) {
                message.success('操作成功', 1.5, () => {
                    browserHistory.goBack();
                    //browserHistory.push(`${DOMAIN_OXT}/newadmin/financial/social/approve`);
                });
            }
        } break;
        case 'CASH_OUT_ACCOUNT_LIST_SAGA': {
            const accountList = yield getAccountList();
            yield put(getAccountListData(accountList.data));
        } break;
        case 'CASH_OUT_EMIT_SUBMIT_SAGA': {
            const data = yield emitSubmit(action.param);
            if (data.status === 0) {
                message.success('操作成功', 1.5, () => {
                    browserHistory.go(-1);
                });
            }
            break;
        }
        case CASH_OUT_ADDPREPAYMENTS_SAGA: {
            
            const data = yield addPrepayments(action.params);
            if (data.status === 0) {
                
                message.success('操作成功', 1.5, () => {
                    if(action.callback && typeof action.callback === 'function') {
                        action.callback();
                    }
                    else {
                        browserHistory.go(-1);
                    }
                    
                });
            }
            break
        }
        default:
            throw ('error from cashOutDetailSaga, action type')
    }
    yield put(setLoadingState(false));
}


export default function* watchCashOutDetail() {
    yield takeEvery([
        'CASH_OUT_DETAIL_SAGA',
        'CASH_OUT_AUDIT_FINANCE_SAGA',
        'CASH_OUT_EMIT_SUBMIT_SAGA',
        'CASH_OUT_ACCOUNT_LIST_SAGA',
        'CASH_OUT_DETAIL_TABLE_SAGA',
        CASH_OUT_ADDPREPAYMENTS_SAGA,
    ], getCashOutAsync);
}