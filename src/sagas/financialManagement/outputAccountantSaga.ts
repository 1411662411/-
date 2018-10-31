import {
    takeEvery,
} from 'redux-saga';
import {
    put,
} from 'redux-saga/effects';
import {
    message
} from 'antd';
import * as moment from 'moment';
import {
    twgetPaymentDetailList,
    spgetPaymentDetailList,
    getSinglePaymentDetailList,
    
    outPutRecord,
    getProgress,
} from '../../api/financialManagement/outputAccountantApi';
import {
    OUTPUT_ACCOUNTANT_SAGA,
    OUT_PUT_RECORD_SAGA,
    outputAccountantReceived,
    isFetching,
    outPutRecordReceived,
    updataProgress,
} from '../../action/financialManagement/outputAccountantAction';
import * as _ from 'lodash';


/** 
 * 到款明细列表
 */
function* twgetPaymentDetailListGenerator(params) {
    try {
        return yield twgetPaymentDetailList(params);
    }
    catch(error) {
        message.error(error.toString(), 3);
    }
}
function* spgetPaymentDetailListGenerator(params) {
    try {
        return yield spgetPaymentDetailList(params);
    }
    catch(error) {
        message.error(error.toString(), 3);
    }
}

/** 
 * 单笔到款明细列表
 */
function* getSinglePaymentDetailListGenerator(params) {
    try {
        return yield getSinglePaymentDetailList(params);
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
        accountName,
        prepaymentsCode,
        cashoutMoney,
    } = params;
    
    switch (type) {
        case OUTPUT_ACCOUNTANT_SAGA : {
            let data;
            yield put(isFetching({
                isFetching: true,
            }));
            
            /* 天吴付款明细表 */
            if (index === 3) {
                // 时间格式后台要秒数
                const startTime = params['startTime'];
                if(startTime){
                    params['startTime'] = moment(startTime+' 00:00:00').valueOf()/1000;
                }
                const endTime = params['endTime'];
                if(endTime){
                    params['endTime'] = moment(endTime+' 23:59:59').valueOf()/1000;
                }
                data = yield spgetPaymentDetailListGenerator(removeEmpty(params));
                data = _.assign(data, { pageSize, currentPage, index, startTime, endTime, accountName ,prepaymentsCode,cashoutMoney,});
            }

            /*天吴付款明细表  */
            else if (index === 1) {
                data = yield twgetPaymentDetailListGenerator(params);
                data = _.assign(data, { pageSize, currentPage, index, startTime, endTime, accountName, prepaymentsCode,cashoutMoney,});
            }
            /* 单笔到款明细列表 */
            else if (index === 2) {
                data = yield getSinglePaymentDetailListGenerator(params);
                data = _.assign(data, { pageSize, currentPage, index, startTime, endTime, accountName, prepaymentsCode,cashoutMoney,});
            }
            yield put(outputAccountantReceived(data));

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

const removeEmpty = (obj:any) => {
    let newObj ={};
    for (var key in obj) {
        if (obj[key]!=='') {
            newObj[key] = obj[key];
            
        }
    }
    return newObj;
}
export default function* watchOutputAccountant() {
    yield takeEvery([
        OUTPUT_ACCOUNTANT_SAGA,
        OUT_PUT_RECORD_SAGA,
    ], incrementAsync)
}
