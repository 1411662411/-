import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    paygetImportExportRecords,
} from '../../api/businessComponents/getPayInfoRecordsApi';
import {
    PAT_INFO_RECORDS_SAGA,
    getPayImportExportRecordsFetching,
    setPayImportExportRecords,
} from '../../action/businessComponents/payGetInfoRecordsAction';
import {
    mapCurrentPageToStart,
} from '../../util/pagination';




function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case PAT_INFO_RECORDS_SAGA: {
            yield put(getPayImportExportRecordsFetching(true));
            const responeData = yield paygetImportExportRecords(mapCurrentPageToStart(params));
           
            if (responeData.status === 0 || responeData.error === 0) {
                yield put(setPayImportExportRecords(responeData));
            }
            //yield put(getImportExportRecordsFetching(false));
            // if (Number(data.error) === 0 || Number(data.status) === 0) {

            // }
            break;
        }
    }
}

export default function* watchPayImportExport() {
    yield takeEvery([
        PAT_INFO_RECORDS_SAGA,
    ], incrementAsync);
}