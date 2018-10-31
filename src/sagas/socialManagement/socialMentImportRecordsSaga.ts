import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    socialImportExportRecords,
} from '../../api/socialManagement/socialMentRecordsSagaApi';
import {
    SOCIAL_RECORDS_SAGA,
    setSocalImportExportRecords,
    getSocalImportExportRecordsFetching,
} from '../../action/socialManagement/socialMentImportRecordsAction';
import {
    mapCurrentPageToStart,
} from '../../util/pagination';




function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case SOCIAL_RECORDS_SAGA: {
            yield put(getSocalImportExportRecordsFetching(true));
            const responeData = yield socialImportExportRecords(mapCurrentPageToStart(params));
            console.log(responeData)
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(setSocalImportExportRecords(responeData));
            }
            //yield put(getImportExportRecordsFetching(false));
            // if (Number(data.error) === 0 || Number(data.status) === 0) {

            // }
            break;
        }
    }
}

export default function* watchSocialImportExport() {
    yield takeEvery([
        SOCIAL_RECORDS_SAGA,
    ], incrementAsync);
}