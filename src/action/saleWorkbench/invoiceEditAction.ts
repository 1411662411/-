export const INVOICE_EDIT_SUBMIT_SAGA = 'BUSINESS_COMPONENT_INVOICE_EDIT_SUBMIT_SAGA';
export const INVOICE_EDIT_SUBMIT_FETCHING = 'INVOICE_EDIT_SUBMIT_FETCHING';
export const INVOICE_EDIT_RESET_STATE = 'INVOICE_EDIT_RESET_STATE';
/**
 * 发票的基础相关信息 （提交页面） get
 * @param params {Object} params
 */
export const invoiceEditSubmit = (params) => {
    return {
        type: INVOICE_EDIT_SUBMIT_SAGA,
        params,
    }
};


/**
 * 发票的基础相关信息 fetching
 * @param params {Object} params
 */
export const invoiceEditSubmitFetching = (params) => {
    return {
        type: INVOICE_EDIT_SUBMIT_FETCHING,
        params,
    }
};


