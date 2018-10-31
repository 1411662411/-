export const INVOICEWHITELIST_SAGA = 'INVOICEWHITELIST_SAGA';
export const INVOICEWHITELIST_REDUCERS = 'INVOICEWHITELIST_REDUCERS';

export const INVOICEWHITELIST_EDIT_SAGA = 'INVOICEWHITELIST_EDIT_SAGA';
export const INVOICEWHITELIST_EDIT_REDUCERS = 'INVOICEWHITELIST_EDIT_REDUCERS';

export const INVOICEWHITELIST_DELETE_SAGA = 'INVOICEWHITELIST_DELETE_SAGA';



export const FETCHING = 'INVOICEWHITELIST_FETCHING';

export const invoiceWhitelistSaga = (params) => {
    return {
        type: INVOICEWHITELIST_SAGA,
        params,
    }
};
export const invoiceWhitelistReducers = (params) => {
    return {
        type: INVOICEWHITELIST_REDUCERS,
        params,
    }
};
export const invoiceWhitelistEditSaga = (params) => {
    return {
        type: INVOICEWHITELIST_EDIT_SAGA,
        params,
    }
};
export const invoiceWhitelistEditReducers = (params) => {
    return {
        type: INVOICEWHITELIST_EDIT_REDUCERS,
        params,
    }
};
export const invoiceWhitelistDeleteSaga = (params) => {
    return {
        type: INVOICEWHITELIST_DELETE_SAGA,
        params,
    }
};

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


