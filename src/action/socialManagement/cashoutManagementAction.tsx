export const CASHOUT_MANAGEMENT_SAGA = 'CASHOUT_MANAGEMENT_SAGA';
export const CASHOUT_MANAGEMENT_REDUCERS = 'CASHOUT_MANAGEMENT_REDUCERS';
export const FETCHING = 'CASHOUT_MANAGEMENT_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'CASHOUT_MANAGEMENT_UPDATE_SEARCH_PARAMS';

export const cashoutManagementSaga = (params) => {
    return {
        type: CASHOUT_MANAGEMENT_SAGA,
        params,
    }
};
export const cashoutManagementReducers = (params) => {  // 第二步action创建函数返回一个action
    return {
        type: CASHOUT_MANAGEMENT_REDUCERS,
        params,
    }
};

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}
export const updateSearchParams = (params) => {
    return {
        type: UPDATE_SEARCH_PARAMS,
        params,
    }
}

