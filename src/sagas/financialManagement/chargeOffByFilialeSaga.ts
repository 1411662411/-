import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';

import {
    list,
    reject,
} from '../../api/financialManagement/chargeOffByFilialeApi';
import {
    fetching,
    CHARGEOFFBYFILIALE_SAGA,
    CHARGEOFFBYFILIALE_SET,
    UNRETRIEVE,
    RETRIEVE,
    REJECT,
    listSet,
    listGet,
} from '../../action/financialManagement/chargeOffByFilialeAction';
import {
    mapCurrentPageToStart,
} from '../../util/pagination';
import { fromJS } from 'immutable'



function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    yield put(fetching(true));
    switch (type) {
        case CHARGEOFFBYFILIALE_SAGA: {
            const responeData = yield list(mapCurrentPageToStart(params));
            let retrieveTotal = 0;
            if(params.verifyStatus !== 2) {
                const responeData2 = yield list({verifyStatus: 2});
                retrieveTotal = responeData2.recordsTotal
            }
            responeData.retrieveTotal = retrieveTotal;
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(listSet(responeData));
            }
            break;
        }
        case REJECT:
        case UNRETRIEVE:
        case RETRIEVE: {
            const responeData = yield reject(params.handleParams);
            if (responeData.status === 0 || responeData.error === 0) {
                typeof callback === 'function' && callback();
                message.success('操作成功')
                yield put(listGet(params.searchParams));
            }
        }
    }
    yield put(fetching(false));
}

export default function* watchChargeOffByFilialeSaga() {
    yield takeEvery([
        CHARGEOFFBYFILIALE_SAGA,
        REJECT,
        UNRETRIEVE,
        RETRIEVE,
    ], incrementAsync);
}