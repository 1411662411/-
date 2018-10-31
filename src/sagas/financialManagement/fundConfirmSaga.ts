import { takeEvery } from 'redux-saga';
import { put, all } from 'redux-saga/effects';
import {
    GET_TABLE_DATA_SAGA,
    fetching,
    receivedTableData,
    SWITCH_CHANGE_SAGA,
    switchChangeSet,
} from '../../action/financialManagement/fundConfirmAction';

import { 
    getTableData,
    getSwitchData, 
    setSwitchData,
    getBadge,
} from '../../api/financialManagement/fundConfirmApi';
import { mapCurrentPageToStart } from '../../util/pagination'; 


function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    yield put(fetching(true));
    switch (type) {
        case GET_TABLE_DATA_SAGA: {
            let params = mapCurrentPageToStart(obj.params);
           
            let [data, switchData, badge] = yield all([
                getTableData(params),
                getSwitchData(),
                getBadge({}),
            ]);
            if(switchData.status === 0) {
                data.switchStatus = switchData.data;
            }
            if(badge.status === 0) {
                data.badge = badge.data;
            }
            data.currentPage = obj.params.currentPage;
            data.pageSize = obj.params.pageSize;
            yield put(receivedTableData(data));
            break;
        }
        case SWITCH_CHANGE_SAGA: {
            const data = yield setSwitchData(params);
            /**
             * 成功
             */
            
            if(data.status === 0) {
                yield put(switchChangeSet(params.claimStatus))
            }
            /**
             * 失败
             */
            else {
                yield put(switchChangeSet(params.claimStatus === 1 ? 0 : 1))
            }
        }
    }
    yield put(fetching(false));
}

// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default  function* watchFundConfirm() {
    yield takeEvery([
        GET_TABLE_DATA_SAGA,
        SWITCH_CHANGE_SAGA,
    ], incrementAsync)
}
