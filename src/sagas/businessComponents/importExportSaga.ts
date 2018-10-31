import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    getImportExportRecords,
} from '../../api/businessComponents/importExportApi';
import {
    IMPORT_EXPORT_RECORDS_SAGA,
    setImportExportRecords,
    getImportExportRecordsFetching,
} from '../../action/businessComponents/importExportRecordsAction';
import {
    mapCurrentPageToStart,
} from '../../util/pagination';




function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case IMPORT_EXPORT_RECORDS_SAGA: {
            yield put(getImportExportRecordsFetching(true));
            const responeData = yield getImportExportRecords(mapCurrentPageToStart(params));
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(setImportExportRecords(responeData));
            }
            //yield put(getImportExportRecordsFetching(false));
            // if (Number(data.error) === 0 || Number(data.status) === 0) {

            // }
            break;
        }
    }
}

export default function* watchImportExport() {
    yield takeEvery([
        IMPORT_EXPORT_RECORDS_SAGA,
    ], incrementAsync);
}