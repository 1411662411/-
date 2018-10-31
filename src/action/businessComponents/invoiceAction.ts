export const INVOICE_BASE_INFO_SUBMIT_SAGA = 'BUSINESS_COMPONENT_INVOICE_BASE_INFO_SUBMIT_SAGA';
export const INVOICE_BASE_INFO_DETAIL_SAGA = 'BUSINESS_COMPONENT_INVOICE_BASE_INFO_DETAIL_SAGA';
export const INVOICE_BASE_INFO_SET = 'INVOICE_BASE_INFO_SET';
export const INVOICE_BASE_FETCHING = 'INVOICE_BASE_FETCHING';

/**
 * 发票的基础相关信息 （提交页面） get
 * @param params {Object} params
 */
export const getInvoiceBaseInfoSubmit = (params) => {
    return {
        type: INVOICE_BASE_INFO_SUBMIT_SAGA,
        params,
    }
};

/**
 * 发票的基础相关信息 （修正页面 | 查看） get
 * @param params {Object} params
 */
export const getInvoiceBaseInfoDetail = (params) => {
    return {
        type: INVOICE_BASE_INFO_DETAIL_SAGA,
        params,
    }
};




/**
 * 发票的基础相关信息 set
 * @param params {Object} params
 */
export const setInvoiceBaseInfo = (params) => {
    return {
        type: INVOICE_BASE_INFO_SET,
        params,
    }
};


/**
 * 发票的基础相关信息 fetching
 * @param params {Object} params
 */
export const invoiceBaseInfoFetching = (params) => {
    return {
        type: INVOICE_BASE_FETCHING,
        params,
    }
};


