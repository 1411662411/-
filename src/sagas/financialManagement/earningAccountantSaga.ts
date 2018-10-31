import {
    takeEvery,
} from 'redux-saga';
import {
    put,
} from 'redux-saga/effects';
import {
    message
} from 'antd';
import {
    getEivableSubsidiaryList,
    getSingleEivableSubsidiaryList,
    getMemberFeeList,
    outPutRecord,
    getProgress,
} from '../../api/financialManagement/earningAccountantApi';
import {
    EARNING_ACCOUNTANT_SAGA,
    OUT_PUT_RECORD_SAGA,
    earningAccountantReceived,
    isFetching,
    outPutRecordReceived,
    updataProgress,
} from '../../action/financialManagement/earningAccountantAction';
import * as _ from 'lodash';


/** 
 * 到款明细列表
 */
function* getEivableSubsidiaryListGenerator(params) {
    try {
        return yield getEivableSubsidiaryList(params);
    }
    catch(error) {
        message.error(error.toString(), 3);
    }
}

/** 
 * 单笔到款明细列表
 */
function* getSingleEivableSubsidiaryListGenerator(params) {
    try {
        return yield getSingleEivableSubsidiaryList(params);
    }
    catch(error) {
        message.error(error.toString(), 3);
    }
}
/** 
 * 会员费到款列表
 */
function* getMemberFeeListGenerator(params) {
    try {
        return yield getMemberFeeList(params);
    }
    catch(error) {
        message.error(error.toString(), 3);
    }
}


/**
 * 导出查询结果
 */
const getOutPutRecord = (params) => {
    try {
        return outPutRecord(params);
    }   
    catch (error) {
        message.error(error.toString());
    }
}


function* getProgressGenerator (params) {
    try {
        let data  = yield getProgress(params);
        if(Number(data.errcode) !== 0) {
            yield put(updataProgress({
                message: data.errmsg || '导出失败',
                status: 'exception',
                visible: true,
                buttonDisabled: false,
            }));
            return data;
        }
        else if(data.data.process === 100) {
            yield put(updataProgress({
                message: '导出成功',
                percent: data.data.process,
                url: data.data.url,
                visible: true,
                status: 'success',
                buttonDisabled: false,
            }));
            return data;
        }
        else {
            yield put(updataProgress({
                percent: data.data.process,
                visible: true,
            }));
            return yield getProgressGenerator(params);
        }
    }
    catch(error) {
        message.error(error.toString());
    }
}

function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    const {
        index,
        pageSize,
        currentPage,
        startTime,
        endTime,
        bankAccount,
        customerName,
        orderType,
        minAmount,
        maxAmount,
    } = params;
    switch (type) {
        case EARNING_ACCOUNTANT_SAGA : {
            let data;
            yield put(isFetching({
                isFetching: true,
            }));
    
            /* 到款明细列表 */
            if (index === 1) {
                
                data = yield getEivableSubsidiaryListGenerator(params);
                data = _.assign(data, {pageSize, currentPage, index, startTime, endTime, bankAccount, customerName, minAmount, maxAmount,orderType});
            }

            /* 单笔到款明细列表 */
            else if (index === 2) {
                data = yield getSingleEivableSubsidiaryListGenerator(params);
                data = _.assign(data, {pageSize, currentPage, index, startTime, endTime, bankAccount,});
            }
            /* 会员费到款列表 */
            else if (index === 3) {
                data = yield getMemberFeeListGenerator(params);
                data = _.assign(data, {pageSize, currentPage, index, startTime, endTime, customerName});
            }
            yield put(earningAccountantReceived(data));

            yield put(isFetching({
                isFetching: false,
            }));
            break;
        }
        case OUT_PUT_RECORD_SAGA : {
            yield put(isFetching({
                isFetching: true,
            }));
            let data = yield getOutPutRecord(params);
            let processData;
            if(data.errcode === 0) {
                processData = yield getProgressGenerator(params);
                yield put(outPutRecordReceived(processData));
            }
            else {
                 message.error(data.errmsg || '导出失败');
            }
            
            
            yield put(isFetching({
                isFetching: false,
            }));

        }
            
    }

}


export default function* watchEarningAccountant() {
    yield takeEvery([
        EARNING_ACCOUNTANT_SAGA,
        OUT_PUT_RECORD_SAGA,
    ], incrementAsync)
}
