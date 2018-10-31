import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    mapCurrentPageToStart
} from '../../util/pagination';
import {
    GET_INVOICE_INFO_SAGA,
    setInvoiceInfo,
    fetching,
    setButtonNumbers,
} from '../../action/businessManagement/invoiceInfoAction';
import {
    getInvoiceInfo,
    getButtonNumbers,
} from '../../api/businessManagement/invoiceInfoApi';

function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    yield put(fetching(true));
    switch (type) {
        case GET_INVOICE_INFO_SAGA:
            const {
                init
            } = params;
            if(init) {
                const data = yield getButtonNumbers();
                if(data.status !== 0) {
                    return;
                }
                yield put(setButtonNumbers(data))
            }
            const data = yield getInvoiceInfo(mapCurrentPageToStart(params));
            if(data.status === 0) {
                yield put(setInvoiceInfo(data))
            }
            break;
    }
    yield put(fetching(false));
    
}
export default function* watchInvoiceInfoSaga() {
    yield takeEvery([
        GET_INVOICE_INFO_SAGA
    ], incrementAsync)
}