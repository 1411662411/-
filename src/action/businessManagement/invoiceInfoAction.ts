export const GET_INVOICE_INFO_SAGA = 'businessManagement/invoiceAction/getInvoiceInfo';

export const SET_INVOICE_INFO = 'businessManagement/invoiceActions/setInvoiceInfo';

export const SET_BUTTON_NUMBER = 'businessManagement/invoiceActions/setButtonNumber';

export const FETCHING = 'businessManagement/invoiceAction/feching';

/**
 * 获取发票信息
 * @param params {Object} 参数
 */
export const getInvoiceInfo = (params) => ({
    type: GET_INVOICE_INFO_SAGA,
    params,
});

/** 设置发票信息
 * @param params {Object} 参数
 */
export const setInvoiceInfo = (params) => ({
    type: SET_INVOICE_INFO,
    params, 
});

export const setButtonNumbers = (params) => ({
    type: SET_BUTTON_NUMBER,
    params,
});

/**
 * 请求loading
 * 
 */
export const fetching = (params: boolean) => ({
    type: FETCHING,
    params,
});

