import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    INVOICEINFO_SAGA,
    fetching,
    invoiceinfoDataReceived,
} from '../../action/financialManagement/invoiceInfoAction';
import { invoiceInfo } from '../../api/financialManagement/invoiceInfoApi';



function* incrementAsync(obj) {
    yield put(fetching(true));
    switch (obj.type) {
        case INVOICEINFO_SAGA : {
            let data = yield invoiceInfo(obj.params)
            yield put(invoiceinfoDataReceived(data));
            break;
        }
        default:
            throw ('error: noMatch in invoiceSaga')
    }
    yield put(fetching(false));
}

export default function* watchInvoiceInfoSaga() {
    yield takeEvery([INVOICEINFO_SAGA], incrementAsync)
}