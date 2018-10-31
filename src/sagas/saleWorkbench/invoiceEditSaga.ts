import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import {
    message
} from 'antd';
import { browserHistory } from 'react-router';
import {
    INVOICE_EDIT_SUBMIT_SAGA,
    invoiceEditSubmitFetching,
} from '../../action/saleWorkbench/invoiceEditAction';

import { 
    invoiceEditSubmit,
} from '../../api/saleWorkbench/invoiceEditApi';
import { mapCurrentPageToStart } from '../../util/pagination'; 



export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    
    yield put(invoiceEditSubmitFetching(true));
    switch (type) {
        case INVOICE_EDIT_SUBMIT_SAGA: {
            let data = yield invoiceEditSubmit(params);
            
            if (data.errcode === 0 || data.status === 0) {
                message.success('提交成功', 1.5, () => {
                    if(history.length > 1) {
                        history.go(-1);
                    }
                    else if(document.referrer !== undefined) {
                        location.href = document.referrer;
                    }
                });
            }
            break;
        }
    }
    yield put(invoiceEditSubmitFetching(false));
}

export default  function* invoiceEditSaga() {
    yield takeEvery([
        INVOICE_EDIT_SUBMIT_SAGA
    ], incrementAsync)
}
