import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import { DATA_SEARCH, dataReceived, isFetching, SEND_DATA_CONFIRM } from '../../action/financialManagement/customerCodeSyncAction';
import { getCustomerCodeList, confirmTransmitData } from '../../api/financialManagement/customerCodeSyncApi';
import { mapCurrentPageToStart } from '../../util/pagination'


function* incrementAsync(obj) {
  const { type, detailData } = obj;
  yield put(isFetching(true));
  switch (type) {
    case DATA_SEARCH: {
      let data = yield getCustomerCodeList(mapCurrentPageToStart(obj.params));
      data.buttJointStatus = obj.params.buttJointStatus
      data.dataType = obj.params.dataType
      data.cName = obj.params.cName
      data.currentPage = obj.params.currentPage;
      data.pageSize = obj.params.pageSize;
      if (data.errcode === 0 || data.status === 0) {
        yield put(dataReceived(data));
      }
      break;
    }
    case SEND_DATA_CONFIRM: {
      const { resolve, ...params } = obj.params
      console.log('请求参数', params)
      let data = yield confirmTransmitData(params)
      if(data.status == 0){//请求成功
        resolve('sucess')
      }else{
        resolve('error')
      }
      break;
    }
    default:
      return
  }
  yield put(isFetching(false));
}


export default function* watchCustomerCodeSerach() {
  yield takeEvery([
    DATA_SEARCH,
    SEND_DATA_CONFIRM
  ], incrementAsync)
}