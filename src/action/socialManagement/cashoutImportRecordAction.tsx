export const CASHOUT_IMPORT_RECORD_SAGA = 'CASHOUT_IMPORT_RECORD_SAGA';
export const CASHOUT_IMPORT_RECORD_REDUCERS = 'CASHOUT_IMPORT_RECORD_REDUCERS';
export const FETCHING = 'CASHOUT_IMPORT_RECORD_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'CASHOUT_IMPORT_RECORD_UPDATE_SEARCH_PARAMS';

export const cashoutImportRecordSaga = (params) => {
    return {
        type: CASHOUT_IMPORT_RECORD_SAGA,
        params,
    }
};
export const cashoutImportRecordReducers = (params) => {
    return {
        type: CASHOUT_IMPORT_RECORD_REDUCERS,
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

