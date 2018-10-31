import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router';
import {
    getOrderInfoAPI,
    getOrderTableAPI,
    confirmOrderSearch,
    confirmOrder,
    rejectOrder,
} from '../../api/financialManagement/fundConfirmInfoApi';
import {
    getOrderInfoAction,
    getOrderTableAction,
    confirmOrderSearchDataReceived,
    confirmOrderDataReceived,
    GET_ORDER_INFO_SAGA,
    CONFIRM_INFO_ORDER_TABLE_SAGA,
    CONFIRM_ORDER_SEARCH_SAGA,
    CONFIRM_ORDER_SAGA,
    REJECT_ORDER_SAGA,
    isFetching,
    rejectOrderDataReceived,
} from '../../action/financialManagement/fundConfirmInfoAction';

function* getOrderInfo(param) {
    try {
        return yield getOrderInfoAPI(param);
    } catch (error) {
        message.error(error.toString());
    }
}

function* getOrderTable(param) {
    try {
        return yield getOrderTableAPI(param);
    } catch (error) {
        message.error(error.toString())
    }
}

function* confirmOrderSearchGenerator(params) {
    try {
        return yield confirmOrderSearch(params);
    }
    catch (error) {
        message.error(error.toString());
    }
}

function* confirmOrderGenerator(params) {
    try {
        return yield confirmOrder(params);
    }
    catch (error) {
        message.error(error.toString());
    }
}

function* rejectOrderGenerator(params) {
    try {
        return yield rejectOrder(params);
    } catch (error) {
        message.error(error.toString());
    }
}


export function* getResultAsync(arg) {
    yield put(isFetching({
        isFetching: true,
    }));
    switch (arg.type) {
        case GET_ORDER_INFO_SAGA: {
            let data = yield getOrderInfo(arg.param);
            if (data.status === 0) {
                yield put(getOrderInfoAction(data))
            }
            break;
        }
        case CONFIRM_INFO_ORDER_TABLE_SAGA: {
            let data = yield getOrderTable(arg.param);
            if (data.status === 0) {
                yield put(getOrderTableAction(data, arg.param));
            }
            break;
        }
        case CONFIRM_ORDER_SAGA: {
            let data = yield confirmOrderGenerator(arg.params);
            if (data.errcode === 0) {
                yield put(confirmOrderDataReceived(data));
                message.success('确认成功', 3, () => {
                    browserHistory.go(-1);
                });
            }
            // else {
            //     message.error(data.msg || '确认到款失败');
            // }
            break;
        }
        case CONFIRM_ORDER_SEARCH_SAGA: {
            let data = yield confirmOrderSearch(arg.params);
            if (data.errcode === 0) {
                yield put(confirmOrderSearchDataReceived(data));
            }
            // else {
            //     message.error(data.msg || '获取确认到款数据失败');
            // }
            break;
        }
        case REJECT_ORDER_SAGA: {
            let data = yield rejectOrderGenerator(arg.params);
            if (data.errcode === 0) {
                yield put(rejectOrderDataReceived(data));
                message.success('驳回成功', 3, () => {
                    browserHistory.go(-1);
                });
            }
            // else {
            //     message.error(data.msg || '驳回失败');
            // }
            break;
        }
        default:
            throw ('arg.type error from fundConfirmInfoSaga')
    }
    yield put(isFetching({
        isFetching: false,
    }));
}

export default function* watchFundConfirmInfo() {
    yield takeEvery([
        GET_ORDER_INFO_SAGA,
        CONFIRM_INFO_ORDER_TABLE_SAGA,
        CONFIRM_ORDER_SEARCH_SAGA,
        CONFIRM_ORDER_SAGA,
        REJECT_ORDER_SAGA,
    ], getResultAsync)
}