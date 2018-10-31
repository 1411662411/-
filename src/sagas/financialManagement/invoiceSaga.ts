import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd';
import { mapCurrentPageToStart } from '../../util/pagination'; 
import {
    getInvoiceDataSource,
    fetching,
    INVOICING_SAGA,
    invoicingLoading,
    setInvoiceModal,
    INVOICE_SAGA,
} from '../../action/financialManagement/invoiceAction';
import { invoiceSearchData, invoiceUpdate } from '../../api/financialManagement/invoiceAPI';



function* getInvoiceResult(obj) {
    yield put(fetching(true));
    switch (obj.type) {
        case INVOICE_SAGA : {
            let data = yield invoiceSearchData(mapCurrentPageToStart(obj.params));
            data.currentPage = obj.params.currentPage;
            data.pageSize = obj.params.pageSize;
            yield put(getInvoiceDataSource(data));
            break;
        } 
        case INVOICING_SAGA : {
            const callBack = obj.params.callBack;
            delete obj.params.callBack;
            let data = yield invoiceUpdate(obj.params);
            if(data && data.status === 0) {
                message.success('操作成功');
                callBack();
                yield put(setInvoiceModal(false));
            }
            break;
        }
        default:
            throw ('error: noMatch in invoiceSaga')
    }
    yield put(fetching(false));
}

export default function* watchInvoiceSaga() {
    yield takeEvery([INVOICE_SAGA, INVOICING_SAGA], getInvoiceResult)
}