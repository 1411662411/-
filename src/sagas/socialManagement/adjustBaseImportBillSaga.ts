import { takeEvery } from 'redux-saga';
import { browserHistory } from 'react-router';
import { put } from 'redux-saga/effects';
import {
    message,
} from 'antd';
import {
    listFetching,
    LIST_FETCHING,
    GET_LIST_DATA,
    setListData,
    SET_COMPANY_NAME,
    companyFetching,
} from '../../action/socialManagement/adjustBaseImportBillAction';
import { mapCurrentPageToStart } from '../../util/pagination';
import {
    getListData,
    setCompanyName,
} from '../../api/socialManagement/adjustBaseImportBillApi';

function* incrementAsync(obj) {
    const {
        type,
        params,
        callback,
    } = obj;
    switch (type) {
        case GET_LIST_DATA: {
            yield put(listFetching(true))
            let responeData = yield getListData(mapCurrentPageToStart(params));
            if (Number(responeData.status) === 0) {
                yield put(setListData(responeData, callback));
            }
            yield put(listFetching(false))
            break;
        }
        case SET_COMPANY_NAME: {
            let responeData = yield setCompanyName(params);
            if (Number(responeData.status) === 0) {
                if(callback && typeof callback.resolve === 'function') {
                    message.success('操作成功');
                    callback.resolve(true);
                }
                if(callback && typeof callback.callback === 'function') {
                    callback.callback();
                }
            }
            else {
                if(callback && typeof callback.reject === 'function') {
                    callback.reject(false);
                }
            }
            
            break;
        }
    }
}

export default function* watchAdjustBaseImportBillSaga() {
    yield takeEvery([
        GET_LIST_DATA,
        SET_COMPANY_NAME,
    ], incrementAsync);
}

