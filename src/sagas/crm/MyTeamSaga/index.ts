import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { CRM_MY_TEAM_GET_DATA, dataReceived, isFetching } from '../../../action/crm/MyTeamAction/';
import {
  CRM_MY_TEAM_SET_DATA,
  CRM_MY_TEAM_ISFETCHING,
} from '../../../action/crm/MyTeamAction/'
import { getMyTeamList } from '../../../api/crm/MyTeamApi/';
import { mapCurrentPageToStart } from '../../../util/pagination'


function* incrementAsync(obj) {
  const { type } = obj;
  yield put(isFetching(true));
  switch (type) {
    case CRM_MY_TEAM_GET_DATA: {
      let data = yield getMyTeamList(mapCurrentPageToStart(obj.params));
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


export default function* watchCrmMyTeamList() {
  yield takeEvery([
    CRM_MY_TEAM_GET_DATA
  ], incrementAsync)
}