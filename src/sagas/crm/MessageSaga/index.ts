import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { CRM_WORKBENCH_MESSAGE_GET_DATA, dataReceived, isFetching } from '../../../action/crm/MessageAction/';
import {
    CRM_WORKBENCH_MESSAGE_SET_DATA,
    CRM_WORKBENCH_MESSAGE_ISFETCHING,
} from '../../../action/crm/MessageAction/'
import { getMessageList } from '../../../api/crm/MessageApi/';
import { mapCurrentPageToStart } from '../../../util/pagination'


function* incrementAsync(obj) {
  const { type } = obj;
  yield put(isFetching(true));
  switch (type) {
    case CRM_WORKBENCH_MESSAGE_GET_DATA: {
      let data = yield getMessageList(mapCurrentPageToStart(obj.params));
      if (data.errcode === 0 || data.status === 0) {
        yield put(dataReceived(data.data));
      }
      break;
    }
    default:
      return
  }
  yield put(isFetching(false));
}


export default function* watchWorkbenchMessageList() {
  yield takeEvery([
    CRM_WORKBENCH_MESSAGE_GET_DATA
  ], incrementAsync)
}