export const CASHOUT_MANAGEMENT_BILL_SAGA = 'CASHOUT_MANAGEMENT_BILL_SAGA';
export const CASHOUT_MANAGEMENT_BILL_REDUCERS = 'CASHOUT_MANAGEMENT_BILL_REDUCERS';
export const FETCHING = 'CASHOUT_MANAGEMENT_BILL_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'CASHOUT_MANAGEMENT_BILL_UPDATE_SEARCH_PARAMS';

export const cashoutManagementBillSaga = (params) => {
    return {
        type: CASHOUT_MANAGEMENT_BILL_SAGA,
        params,
    }
};
export const cashoutManagementBillReducers = (params) => {
    return {
        type: CASHOUT_MANAGEMENT_BILL_REDUCERS,
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

