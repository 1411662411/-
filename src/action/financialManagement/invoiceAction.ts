
// 定义saga
export const INVOICE_SAGA = 'INVOICE_SAGA';
// 获取dataSource
export const INVOICE_GET_DATA = 'INVOICE_GET_DATA';
// 修改orderType
export const INVOICE_MODIFY_ORDER_TYPE = 'INVOICE_MODIFY_ORDER_TYPE';
// 修改invoiceStatus
export const INVOICE_MODIFY_INVOICE_STATUS = 'INVOICE_MODIFY_INVOICE_STATUS';
// trigger confirm
export const INVOICE_MODAL_VISIBLE = 'INVOICE_MODAL_VISIBLE';

export const INVOICE_FETCHING = 'INVOICE_FETCHING';
export const INVOICE_INVOICING = 'INVOICE_INVOICING';
export const INVOICING_SAGA = `INVOICING_SAGA`;
export const INVOICING_SAGA_RECEIVED = `INVOICING_SAGA_RECEIVED`;
export const INVOICE_INVOICING_LOADING = 'INVOICE_INVOICING_LOADING';
export const INVOICE_UPDATE_SEARCH_PARAMS = 'INVOICE_UPDATE_SEARCH_PARAMS';
export const INVOICE_UPDATE_CACHE_SEARCH_PARAMS = 'INVOICE_UPDATE_CACHE_SEARCH_PARAMS';

/**
 * 开发票弹窗
 * @param params 
 */
export const invoicing = (params) => {
    return {
        type: INVOICE_INVOICING,
        params,
    }
};

export const invoicingSaga = (params) => {
    return {
        type: INVOICING_SAGA,
        params,
    }
}

export const invoicingSagaReceived = (params) => {
    return {
        type: INVOICING_SAGA_RECEIVED,
        params,
    }
}

export const invoicingLoading = (params) => {
    return {
        type: INVOICE_INVOICING_LOADING,
        params,
    }
}


export const updateSearchParams = (params) => {
    return {
        type: INVOICE_UPDATE_SEARCH_PARAMS,
        params,
    }
}

export const updateCacheSearchParams = (params) => {
    return {
        type: INVOICE_UPDATE_CACHE_SEARCH_PARAMS,
        params,
    }
}




// 触发saga
export const triggerInvoiceSaga = (params) => {
    return {
        type: INVOICE_SAGA,
        params,
    }
};

export const getInvoiceDataSource = (params) => {
    return {
        type: INVOICE_GET_DATA,
        params,
    }
};

export const setOrderType = (orderType) => {
    return {
        type: INVOICE_MODIFY_ORDER_TYPE,
        orderType
    }
};

export const setInvoiceStatus = (invoiceStatus) => {
    return {
        type: INVOICE_MODIFY_INVOICE_STATUS,
        invoiceStatus
    }
};

export const setInvoiceModal = (visible) => {
    return {
        type: INVOICE_MODAL_VISIBLE,
        visible
    }
};

export const fetching = (params) => {
    return {
        type: INVOICE_FETCHING,
        params,
    }
};
