import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    ROUTER_PATH,
} from '../../global/global';
import {
    message,
} from 'antd';
import {
    DATA_GET,
    listSet,
    fetching,
} from '../../action/socialManagement/importSocialNumberAction';
import {
    listGet,
} from '../../api/socialManagement/importSocialNumberApi';
import {
    mapCurrentPageToStart,
} from '../../util/pagination';



function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case DATA_GET: {
            yield put(fetching(true))
            const responeData = yield listGet(mapCurrentPageToStart(params));
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                yield put(listSet(responeData));
            }
            yield put(fetching(false))
            break;
        }
    }
}

export default function* watchImportSocialNumber() {
    yield takeEvery([
        DATA_GET,
    ], incrementAsync);
}

