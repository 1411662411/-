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
    CHAPTER_INFO_DETAIL_SAGA,
    chapterInfoDetailSet,
    fetching,
} from '../../../action/businessComponents/chapter/chapterInfoEnterAction';
import {
    getDetail,
} from '../../../api/businessComponents/chapter/chapterInfoEnterApi';




function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case CHAPTER_INFO_DETAIL_SAGA: {
            const {
                recipientSelectType,
            } = params;
            yield put(fetching(true))
            const responeData = yield getDetail(params);
            if (Number(responeData.error) === 0 || Number(responeData.status) === 0) {
                yield put(chapterInfoDetailSet(responeData));
            }
            yield put(fetching(false))
            break;
        }
    }
}

export default function* watchChapterInfoEnter() {
    yield takeEvery([
        CHAPTER_INFO_DETAIL_SAGA,
    ], incrementAsync);
}

