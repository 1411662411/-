export const INVOICES_SEND_LIST_SAGA = 'INVOICES_SEND_LIST_SAGA';
export const INVOICES_SEND_LIST_REDUCERS = 'INVOICES_SEND_LIST_REDUCERS';
export const FETCHING = 'INVOICES_SEND_LIST_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'INVOICES_SEND_LIST_UPDATE_SEARCH_PARAMS';
export const INVOICES_EXPORTDATACOUNT_SAGA = 'INVOICES_EXPORTDATACOUNT_SAGA';
export const INVOICES_EXPORTDATACOUNT_REDUCERS = 'INVOICES_EXPORTDATACOUNT_REDUCERS';


export const invoicesSendListSaga = (params) => {
    return {
        type: INVOICES_SEND_LIST_SAGA,
        params,
    }
};
export const invoicesSendListReducers = (params) => {
    return {
        type: INVOICES_SEND_LIST_REDUCERS,
        params,
    }
};
export const invoicesExportdatacountSaga = (params) => {
    return {
        type: INVOICES_EXPORTDATACOUNT_SAGA,
        params,
    }
};
export const invoicesExportdatacountReducers = (params) => {
    return {
        type: INVOICES_EXPORTDATACOUNT_REDUCERS,
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

