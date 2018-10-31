import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';

import {
    chapterList,
    personSource,
    transfer,
    chapterInfoSave,
} from '../../api/businessComponents/chapterListApi';
import {
    CHAPTERLIST_SAGA,
    chapterListSet,
    PERSONSOURCE_SAGA,
    personSourceSet,
    compareDataSourceSet,
    chapterListGet,
    fetching,
    TRANSFER_SAGA,
    total,
    CHAPTERLIST_CHAPTERINFO_SAVE_SAGA,
} from '../../action/businessComponents/chapterListActions';
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
        case CHAPTERLIST_SAGA: {
            //yield put(getImportExportRecordsFetching(true));
            const responeData = yield chapterList(mapCurrentPageToStart(params));
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(chapterListSet(fromJS(responeData.data.rows)));
                yield put(total(responeData.data.totalCount))
                yield put(compareDataSourceSet(fromJS(responeData.data.rows)))
            }
            //yield put(getImportExportRecordsFetching(false));
            // if (Number(data.error) === 0 || Number(data.status) === 0) {

            // }
            break;
        }
        case PERSONSOURCE_SAGA: {
            const responeData = yield personSource(params);
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(personSourceSet(fromJS(responeData.data.records)));
            }
            break;
        }
        case CHAPTERLIST_CHAPTERINFO_SAVE_SAGA: {
            const responeData = yield chapterInfoSave(params);
            if (responeData.status === 0 || responeData.error === 0) {
                message.success('保存成功');
                typeof callback === 'function' && callback();
            }
            break;
        }
        case TRANSFER_SAGA: {
            const responeData = yield transfer({info: params.info});
            if (responeData.status === 0 || responeData.error === 0) {
                message.success('转移成功');
                typeof callback === 'function' && callback();
                delete params.info;
                yield put(chapterListGet(params));
            }
            break;
        }
    }
    yield put(fetching(false));
}

export default function* watchChapterList() {
    yield takeEvery([
        CHAPTERLIST_SAGA,
        PERSONSOURCE_SAGA,
        TRANSFER_SAGA,
        CHAPTERLIST_CHAPTERINFO_SAVE_SAGA,
    ], incrementAsync);
}