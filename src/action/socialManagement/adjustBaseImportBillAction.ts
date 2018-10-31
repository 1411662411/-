export const GET_LIST_DATA = 'socialManagement/adjustBaseImportBillAction/GET_LIST_DATA';
export const SET_LIST_DATA = 'socialManagement/adjustBaseImportBillAction/SET_LIST_DATA';
export const LIST_FETCHING = 'socialManagement/adjustBaseImportBillAction/LIST_FETCHING';

export const SET_COMPANY_NAME = 'socialManagement/adjustBaseImportBillAction/SET_COMPANY_NAME';
export const COMPANY_FETCHING = 'socialManagement/adjustBaseImportBillAction/COMPANY_FETCHING';


export const SUBMIT_POLICYPACKAGE =  'socialManagement/adjustBaseImportBillAction/SUBMIT_POLICYPACKAGE'; 

export const SUBMIT_POLICYPACKAGE_FETCHING = 'socialManagement/adjustBaseImportBillAction/SUBMIT_POLICYPACKAGE_FETCHING';

export const APPROVE_POLICYPACKAGE =  'socialManagement/adjustBaseImportBillAction/APPROVE_POLICYPACKAGE';
export const APPROVE_POLICYPACKAGE_FETCHING = 'socialManagement/adjustBaseImportBillAction/APPROVE_POLICYPACKAGE_FETCHING';


/**
 * 回传列表 get
 * @param params {Object} 参数
 */
export const getListData = (params, callback?) => ({
    type: GET_LIST_DATA,
    params,
    callback,
});

/**
 * 回传列表 set
 * @param params {Object} 参数
 */
export const setListData = (params, callback?) => ({
    type: SET_LIST_DATA,
    params,
    callback,
});

/**
 * 回传列表loading 
 * @param params {Object} 参数
 */
export const listFetching = (params) => ({
    type: LIST_FETCHING,
    params,
});


/**
 * 修改公司名称 set
 * @param params {Object} 参数
 */
export const setCompanyName = (params, callback) => ({
    type: SET_COMPANY_NAME,
    params,
    callback,
});

/**
 * 修改公司名称 loading 
 * @param params {Object} 参数
 */
export const companyFetching = (params) => ({
    type: COMPANY_FETCHING,
    params,
});


/**
 * 材料审核 set
 */
export const approvePolicyPackage = (params, callback?) => ({
    type: APPROVE_POLICYPACKAGE,
    params,
    callback,
});

/**
 * 材料审核 loading 
 * @param params {Object} 参数
 */
export const approvePolicyPackageFetching = (params) => ({
    type: APPROVE_POLICYPACKAGE_FETCHING,
    params,
});