export const CASH_CLAIM_SAGA = 'CASH_CLAIM_SAGA';
export const CASH_CLAIM_REDUCERS = 'CASH_CLAIM_REDUCERS';
export const CASH_CLAIM_CBS_REDUCERS = 'CASH_CLAIM_CBS_REDUCERS';

export const TRANSACTION_HIS_SAGA = 'CASH_CLAIM_TRANSACTION_HIS_SAGA';
export const TRANSACTION_HIS_REDUCERS = 'CASH_CLAIM_TRANSACTION_HIS_REDUCERS';

export const IFNEEDOPENINVOICE_SAGA = 'CASH_CLAIM_IFNEEDOPENINVOICE_SAGA';
export const IFNEEDOPENINVOICE_REDUCERS = 'CASH_CLAIM_IFNEEDOPENINVOICE_REDUCERS';

export const CASH_CLAIM_COMMIT_SAGA = 'CASH_CLAIM_COMMIT_SAGA';
export const CASH_CLAIM_COMMIT_REDUCERS = 'CASH_CLAIM_COMMIT_REDUCERS';

export const CASH_CLAIM_CHECK_SAGA = 'CASH_CLAIM_CHECK_SAGA';
export const CASH_CLAIM_CHECK_REDUCERS = 'CASH_CLAIM_CHECK_REDUCERS';

export const FETCHING = 'CASH_CLAIM_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'CASH_CLAIM_UPDATE_SEARCH_PARAMS';

export const transactionHisSaga = (params) => {
    return {
        type: TRANSACTION_HIS_SAGA,
        params,
    }
};
export const transactionHisReducers = (params) => {
    return {
        type: TRANSACTION_HIS_REDUCERS,
        params,
    }
};
export const ifneedopeninvoiceSaga = (params) => {
    return {
        type: IFNEEDOPENINVOICE_SAGA,
        params,
    }
};
export const ifneedopeninvoiceReducers = (params) => {
    return {
        type: IFNEEDOPENINVOICE_REDUCERS,
        params,
    }
};
export const cashClaimCommitSaga = (params) => {
    return {
        type: CASH_CLAIM_COMMIT_SAGA,
        params,
    }
};
export const cashClaimCommitReducers = (params) => {
    return {
        type: CASH_CLAIM_COMMIT_REDUCERS,
        params,
    }
};
export const cashClaimCheckSaga = (params) => {
    return {
        type: CASH_CLAIM_CHECK_SAGA,
        params,
    }
};
export const cashClaimCheckReducers = (params) => {
    return {
        type: CASH_CLAIM_CHECK_REDUCERS,
        params,
    }
};
export const cashClaimSaga = (params) => {
    return {
        type: CASH_CLAIM_SAGA,
        params,
    }
};
export const cashClaimReducers = (params) => {
    return {
        type: CASH_CLAIM_REDUCERS,
        params,
    }
};
export const cashClaimCbsReducers = (params) => {
    return {
        type: CASH_CLAIM_CBS_REDUCERS,
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

