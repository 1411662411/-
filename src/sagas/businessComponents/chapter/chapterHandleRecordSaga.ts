import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    ROUTER_PATH,
} from '../../../global/global';
import {
    message,
    Modal,
} from 'antd';
import {
    LIST_SAGA,
    listFetching,
    listSet,
} from '../../../action/businessComponents/chapter/chapterHandleRecordAction';
import {
    getList,
} from '../../../api/businessComponents/chapter/chapterHandleRecordApi'




function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    switch (type) {
        case LIST_SAGA: {
            yield put(listFetching(true))
            const responeData = yield getList(params);
            if (responeData.status === 0) {
                yield put(listSet(responeData));
            }
            yield put(listFetching(false))
            break;
        }
    }
}

export default function* watch() {
    yield takeEvery([
        LIST_SAGA,
    ], incrementAsync);
}

