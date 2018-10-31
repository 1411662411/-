import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { DOMAIN_OXT } from '../../global/global';
import {
    message
} from 'antd';
import {
    MAILSET_SAGA,
    mailsetReducers,
    USER_BY_ORGANIZATIONS_SAGA,
    userByOrganizationsReducers,
    fetching,

} from '../../action/financialManagement/mailsetAction';
import {
   mailreminderSettingsApi,
   queryorganizationinfoApi,
   userByOrganizationsApi,

} from '../../api/financialManagement/mailsetApi';
import { mapCurrentPageToStart } from '../../util/pagination';
export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    /**去除为空的参数给后台 */

    yield put(fetching(true));
    const newParams = mapCurrentPageToStart(removeEmpty(params));
    switch (type) {
        case MAILSET_SAGA: {
            const data = yield mailreminderSettingsApi(newParams);
            if (data.errcode === 0 || data.status === 0) {
                
                data.type = params.type;
                yield put(mailsetReducers(data));
                
                if(params.callback){
                    params.callback();
                }
            }
            break;
        }
        case USER_BY_ORGANIZATIONS_SAGA: {
            // 获取财务列表 先通过名称查询id
            const data = yield queryorganizationinfoApi({name:'财务部'});
            if (data.errcode === 0 || data.status === 0) {
                const financeId = data.data[0].id;
                const financeData = yield userByOrganizationsApi({organizationIds:financeId||''});
                if (data.errcode === 0 || data.status === 0) {
                    yield put(userByOrganizationsReducers(financeData.data));
                }
                
            }
            break;
        }
    }
    yield put(fetching(false));
}
/**
 * 去除空值对象给后台
 * @param obj{any} 对象
 * @return 
 */
const removeEmpty = (obj: any) => {
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];

        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default function* watchMailset() {
    yield takeEvery([
        MAILSET_SAGA,
        USER_BY_ORGANIZATIONS_SAGA,
    ], incrementAsync)
}