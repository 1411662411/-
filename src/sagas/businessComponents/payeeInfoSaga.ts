import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    getSecondCashoutInfo,
    getSecondCashoutNameSource,
} from '../../api/businessComponents/payeeInfoApi';
import {
    SECONDCASHOUTNAMESOURCE_SAGA,
    SECONDCASHOUTINFO_SAGA,
    setSecondCashoutNameSource,
    setSecondCashoutInfo,
    secondCashoutInfoFetching,
} from '../../action/businessComponents/payeeInfoAction';





function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case SECONDCASHOUTNAMESOURCE_SAGA: {
            const data = yield getSecondCashoutNameSource(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setSecondCashoutNameSource(data.data));
            }
            break;
        }
        case SECONDCASHOUTINFO_SAGA : {
            yield put(secondCashoutInfoFetching(true));
            const data = yield getSecondCashoutInfo(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                const {
                    remark,
                    depositAccount,
                    depositName,
                    id
                } = data.data
                const secondCashoutInfo = {
                   secondCashoutRemark: remark,
                   secondCashoutPayeeId: id,
                   secondCashoutAccount: depositAccount,
                   secondCashoutOpenBank: depositName,
                }
                yield put(setSecondCashoutInfo(secondCashoutInfo));
            }
            yield put(secondCashoutInfoFetching(false));
            break;
        }
    }
}

export default function* watchPayeeInfo() {
    yield takeEvery([
        SECONDCASHOUTNAMESOURCE_SAGA,
        SECONDCASHOUTINFO_SAGA,
    ], incrementAsync);
}