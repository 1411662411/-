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
    getGatheringInfoList,
} from '../../api/financialManagement/gatheringInfoApi';
import {
    GATHERING_INFO_ENTRY_SAGA,
    isFetching,
    gatheringInfoReceived,
} from '../../action/financialManagement/gatheringInfoAction';

function* getGatheringInfoListGenerator(params) {

    try {
        yield put(isFetching({ listIsFetching: true }));
        return yield getGatheringInfoList(params);
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
        pageSize,
        currentPage,
    } = params;
    switch (type) {
        case GATHERING_INFO_ENTRY_SAGA: {
            let data = yield getGatheringInfoListGenerator(params);
            if( Number(data.status) === 0 || Number(data.errcode === 0)) {
                data = _.assign(data, {
                    currentPage,
                    pageSize,
                });
                yield put(gatheringInfoReceived(data));
            }
            yield put(isFetching({ listIsFetching: false }));
            break;
        }
    }
}

export default function* watchGatheringInfoSagaAsync() {
    yield takeEvery([
        GATHERING_INFO_ENTRY_SAGA, 
        ], incrementAsync);
}



