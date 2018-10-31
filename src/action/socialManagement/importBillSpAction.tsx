export const IMPORT_BILL_SP_SAGA = 'IMPORT_BILL_SP_SAGA';
export const IMPORT_BILL_SP_REDUCERS = 'IMPORT_BILL_SP_REDUCERS';
export const IMPORT_BILL_SP_SUMIT_SAGA = 'IMPORT_BILL_SP_SUMIT_SAGA';
export const IMPORT_BILL_SP_SUMIT_REDUCERS = 'IMPORT_BILL_SP_SUMIT_REDUCERS';
export const FETCHING = 'IMPORT_BILL_SP_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'IMPORT_BILL_SP_UPDATE_SEARCH_PARAMS';

export const importBillSpSaga = (params) => {
    return {
        type: IMPORT_BILL_SP_SAGA,
        params,
    }
};
export const importBillSpReducers = (params) => {
    return {
        type: IMPORT_BILL_SP_REDUCERS,
        params,
    }
};
export const importBillSpSubmitSaga = (params) => {
    return {
        type: IMPORT_BILL_SP_SUMIT_SAGA,
        params,
    }
};
export const importBillSpSubmitReducers = (params) => {
    return {
        type: IMPORT_BILL_SP_SUMIT_REDUCERS,
        params,
    }
};

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


