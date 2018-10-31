import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';

import {
    WORKBENCH_GET_SALEKIT,
    setSaleKit,
    WORKBENCH_GET_TODAY_TODO_LIST,
    setSalesTodayTodoList,
    WORKBENCH_GET_WEEK_TODO_LIST,
    setSalesWeekTodoList,
    WORKBENCH_GET_WILL_AUDIT_LIST,
    setWillAuditList,
    WORKBENCH_GET_DID_AUDIT_LIST,
    setDidAuditList,
} from '../../../action/crm/Workbench';
import { getSaleKit, getSalesTodoList, getAuditList } from '../../../api/crm/Workbench';

import { message } from 'antd';

function formatData(data){
    return data ? data.data : [];
}

function* incrementAsync(obj) {
    const { type, params } = obj;
    switch (type) {
      case WORKBENCH_GET_SALEKIT: {
        try {
            let res = yield getSaleKit(params);
            if(Number(res.status) === 0 || Number(res.error) === 0){
                let { data } = res;
                yield put(setSaleKit(data));
            }
        }
        catch (error) {
            message.error(error.toString(), 3);
        }
        break;
      }
      case WORKBENCH_GET_TODAY_TODO_LIST: {
        try {
            let res = yield getSalesTodoList(params);
            if(Number(res.status) === 0 || Number(res.error) === 0){
                let { data } = res;
                yield put(setSalesTodayTodoList(formatData(data)));
            }
        }
        catch (error) {
            message.error(error.toString(), 3);
        }
        break;
      }
      case WORKBENCH_GET_WEEK_TODO_LIST: {
        try {
            let res = yield getSalesTodoList(params);
            if(Number(res.status) === 0 || Number(res.error) === 0){
                let { data } = res;
                yield put(setSalesWeekTodoList(formatData(data)));
            }
        }
        catch (error) {
            message.error(error.toString(), 3);
        }
        break;
      }
      case WORKBENCH_GET_WILL_AUDIT_LIST: {
        try {
            let res = yield getAuditList(params);
            if(Number(res.status) === 0 || Number(res.error) === 0){
                let { data } = res;
                yield put(setWillAuditList(data));
            }
        }
        catch (error) {
            message.error(error.toString(), 3);
        }
        break;
      }
      case WORKBENCH_GET_DID_AUDIT_LIST: {
        try {
            let res = yield getAuditList(params);
            if(Number(res.status) === 0 || Number(res.error) === 0){
                let { data } = res;
                yield put(setDidAuditList(data));
            }
        }
        catch (error) {
            message.error(error.toString(), 3);
        }
        break;
      }
      default:
        return
    }
}

export default function* watchCrmWorkBenchSaga() {
    yield takeEvery([
        WORKBENCH_GET_SALEKIT,
        WORKBENCH_GET_TODAY_TODO_LIST,
        WORKBENCH_GET_WEEK_TODO_LIST,
        WORKBENCH_GET_WILL_AUDIT_LIST,
        WORKBENCH_GET_DID_AUDIT_LIST,
    ], incrementAsync);
}