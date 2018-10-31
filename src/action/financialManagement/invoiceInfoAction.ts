export const INVOICEINFO_SAGA = 'INVOICEINFO_SAGA';
export const INVOICEINFO_DATA_RECEIVED = 'INVOICEINFO_RDATA_ECEIVED';
export const INVOICEINFO_FETCHING = 'INVOICEINFO_FETCHING';
export const invoiceinfoDataReceived = (params) => {
    return {
        type: INVOICEINFO_DATA_RECEIVED,
        params,
    }
}

export const invoiceinfoSaga = (params) => {
    return {
        type: INVOICEINFO_SAGA,
        params,
    }
}

export const fetching = (params) => {
    return {
        type: INVOICEINFO_FETCHING,
        params,
    }
};

export const invoiceinfoDataClear = (params) => {
    return {
        type: INVOICEINFO_DATA_RECEIVED,
        params,
    }
}