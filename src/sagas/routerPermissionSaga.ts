/**
 * Created by caozheng on 2017/2/22.
 */
import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { browserHistory } from 'react-router';
import {
    getRouterPermission,
    getRouterMenus,
    getMessageCount,
} from '../api/routerPermissionApi';
import {
    isFetching,
    routerPermissionDataReceived,
    ROUTER_PERMISSION_SAGA,
} from '../action/routerPermissionAction';
import { message } from 'antd';



function* getRouterPermissionGenerator(params) {
    try {
        return yield getRouterPermission(params);
    }
    catch (error) {
        message.error(error.toString(), 3);
    }
}
function* getRouterMenusGenerator(params) {
    try {
        return yield getRouterMenus(params);
    }
    catch (error) {
        message.error(error.toString(), 3);
    }
}

function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    yield put(isFetching({ listIsFetching: true }));
    switch (type) {
        case ROUTER_PERMISSION_SAGA: {
            let [menus,data,messageCount] = yield [
                getRouterMenusGenerator(params),
                getRouterPermissionGenerator(params),
                getMessageCount()
            ];
            if (Number(data.status) === 0 || Number(data.errcode === 0)) {
                yield put(routerPermissionDataReceived({data:menus, old:data, messageCount,}));
            }
            yield put(isFetching({ listIsFetching: false }));
            break;
        }
    }
    yield put(isFetching({ listIsFetching: false }));
}

export default function* watchRouterPermission() {
    yield takeEvery([
        ROUTER_PERMISSION_SAGA,
    ], incrementAsync);
}