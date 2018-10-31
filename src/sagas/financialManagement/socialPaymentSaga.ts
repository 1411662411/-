import {
    takeEvery,
} from 'redux-saga';
import {
    put,
} from 'redux-saga/effects';
import {
    message,
} from 'antd';
import * as _ from 'lodash';
import {
    getSocialPaymentList,
    getSocailMentCountNumber,
} from '../../api/financialManagement/socialPaymentApi';
import {
    SOCIAL_PAYMENT_SAGA,
    isFetching,
    socialPaymentReceived,
    GET_COUNT_NUMBER_SAGA,
    getCountNumberReceived
} from '../../action/financialManagement/socialPaymentAction';


function* getSocialPaymentListGenerator(params) {

    try {
        yield put(isFetching({ listIsFetching: true }));
        return yield getSocialPaymentList(params);
    }
    catch(error) {
        yield put(isFetching({ listIsFetching: false }));
        message.error(error.toString(), 3);
    }
}
function* getSocailMentCountNumberGenerator(params){
    try {
        return yield getSocailMentCountNumber(params);
    }
    catch (error) {
        message.error(error.toString(), 3);
    }
   
}
function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    const {
        operStatus,
        paymentType, 
        payStatus,
        receivablesName,
        prepaymentsCode,
        createUserName,
        pageSize,
        currentPage,
        financePlanPayTime,
    } = params;
    switch (type) {
        
        case SOCIAL_PAYMENT_SAGA: {
            let data = yield getSocialPaymentListGenerator(params);
            if( Number(data.status) === 0 || Number(data.errcode === 0)) {
                data = _.assign(data, {
                    operStatus,
                    paymentType, 
                    payStatus,
                    receivablesName,
                    prepaymentsCode,
                    createUserName,
                    currentPage,
                    pageSize,
                    financePlanPayTime,
                });
                yield put(socialPaymentReceived(data));
            }
            yield put(isFetching({ listIsFetching: false }));
            break;
        }
        case GET_COUNT_NUMBER_SAGA:{
            let data = yield getSocailMentCountNumberGenerator(params);
            if (Number(data.status) === 0 || Number(data.errcode === 0)) {
                data = data.data
                yield put(getCountNumberReceived(data));
            }
            
            break;
        }
    }
}

export default function* watchSocialPayment() {
    yield takeEvery([
        SOCIAL_PAYMENT_SAGA,  
        GET_COUNT_NUMBER_SAGA,
    ], incrementAsync)
}