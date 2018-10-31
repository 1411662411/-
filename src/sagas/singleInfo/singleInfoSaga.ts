import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { message } from 'antd'

import {
    getSingleInfoListFetch,
    getSingleInfoEditor
} from '../../api/singleInfomation/singleinfoApi';

import {
    SINGLE_INFO_DISPACH,
    singleInfoSaga,
    singleInfoRecieved,
    SINGLE_INFO_EDITOR_DISPATCH,
    singleInfoEditorRecieved,
    fetchDispatch
} from '../../action/singleInfomation/singleInfoAction';
function* incrementAsync(action) {
    let data
    switch (action.type) {
        case SINGLE_INFO_DISPACH:
            data = yield getSingleInfoListFetch(action.params)
            if(data.status==0){
                return yield put(singleInfoRecieved(data));
            }else{
                return message.error(data.errmsg)
            }
           
        case SINGLE_INFO_EDITOR_DISPATCH:
            yield put(fetchDispatch(true))
            data = yield getSingleInfoEditor(action.params)
            if(data.status==0){
                action.params.callback();
                yield put(fetchDispatch(false))
                return yield put(singleInfoEditorRecieved(data))
            } else {
                return message.error(data.errmsg)
            }
            
        default:
            throw ('error from cashOutDetailSaga, action type')
    }
}
export default function* watchSingleInfoDetail() {
    yield takeEvery([
        SINGLE_INFO_DISPACH,
        SINGLE_INFO_EDITOR_DISPATCH,
    ], incrementAsync);
}