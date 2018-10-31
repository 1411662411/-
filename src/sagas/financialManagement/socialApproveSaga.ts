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
    getSocialApproveList
} from '../../api/financialManagement/socialApproveApi';
import {
    SOCIAL_APPROVE_SAGA,
    isFetching,
    socialApproveReceived,
} from '../../action/financialManagement/socialApproveAction';


function* getSocialApproveListGenerator(params) {

    try {
        yield put(isFetching({ listIsFetching: true }));
        return yield getSocialApproveList(params);
    }
    catch(error) {
        yield put(isFetching({ listIsFetching: false }));
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
        approvalStatus,
        receivablesName,
        createUserName,
        pageSize,
        currentPage,
    } = params;
    switch (type) {
        case SOCIAL_APPROVE_SAGA: {
            let data = yield getSocialApproveListGenerator(params);
            if( Number(data.status) === 0 || Number(data.errcode === 0)) {
                data = _.assign(data, {
                    operStatus,
                    paymentType, 
                    approvalStatus,
                    receivablesName,
                    createUserName,
                    currentPage,
                    pageSize,
                });
                yield put(socialApproveReceived(data));
            }
            yield put(isFetching({ listIsFetching: false }));
            break;
        }
    }
}

export default function* watchSocialApprove() {
    yield takeEvery([
        SOCIAL_APPROVE_SAGA,  
    ], incrementAsync)
}