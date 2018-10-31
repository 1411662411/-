import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message} from 'antd'

import { mapCurrentPageToStart } from '../../util/pagination'; 
import {
    getPolicyListFetch,
    getPolicyListSearch
} from '../../api/policyMaintenance/policyListApi';

import {
    GET_POLICY_LIST_SAGA,
    getPolicyMenergeList,
    RecievedPolicyMenergeList,
    RECEIVE_POLICY_LIST_SAGA,
    DISPATCH_POLICY_SAGA,
    RESET_INFO_SEARCH_DISPATCH,
    getPolicyMenergeSaga,
    getPolicyFetching,
} from '../../action/policyMaintenance/policyListAction';
function* incrementAsync(action) {
    let data
    switch(action.type){
        case DISPATCH_POLICY_SAGA :   
            yield put(getPolicyFetching(true))
             data = yield getPolicyListFetch(action.params)
            yield put(getPolicyFetching(false))
            return yield put(getPolicyMenergeList(data));
        case  RESET_INFO_SEARCH_DISPATCH:
            yield put(getPolicyFetching(true))
            data = yield getPolicyListSearch(action.params)
            action.params.callback()
            yield put(getPolicyFetching(false))
            return yield put(getPolicyMenergeSaga(data))
        default:
            throw ('error from cashOutDetailSaga, action type')
    }
}
export default function* watchPolicyListDetail() {
    
    yield takeEvery([
        DISPATCH_POLICY_SAGA,
        RESET_INFO_SEARCH_DISPATCH
    ], incrementAsync);
}
