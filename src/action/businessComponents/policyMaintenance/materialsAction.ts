export const GET_POLICYPACKAGE_DATA = 'businessComponents/policyMaintenance/materialsAction/GET_POLICYPACKAGE_DATA';
export const SET_POLICYPACKAGE_DATA = 'businessComponents/policyMaintenance/materialsAction/SET_POLICYPACKAGE_DATA';
export const POLICYPACKAGE_FETCHING = 'businessComponents/policyMaintenance/materialsAction/POLICYPACKAGE_FETCHING';

export const SUBMIT_POLICYPACKAGE =  'businessComponents/policyMaintenance/materialsAction/SUBMIT_POLICYPACKAGE'; 

export const SUBMIT_POLICYPACKAGE_FETCHING = 'businessComponents/policyMaintenance/materialsAction/SUBMIT_POLICYPACKAGE_FETCHING';

export const APPROVE_POLICYPACKAGE =  'businessComponents/policyMaintenance/materialsAction/APPROVE_POLICYPACKAGE';
export const APPROVE_POLICYPACKAGE_FETCHING = 'businessComponents/policyMaintenance/materialsAction/APPROVE_POLICYPACKAGE_FETCHING';

/**
 * 材料相关信息 get
 * @param params {Object} 参数
 */
export const getPolicyPackageData = (params, callback) => ({
    type: GET_POLICYPACKAGE_DATA,
    params,
    callback,
});

/**
 * 材料相关信息 set
 * @param params {Object} 参数
 */
export const setPolicyPackageData = (params, callback?) => ({
    type: SET_POLICYPACKAGE_DATA,
    params,
    callback,
});

/**
 * 材料相关loading 
 * @param params {Object} 参数
 */
export const policyPackageFetching = (params) => ({
    type: POLICYPACKAGE_FETCHING,
    params,
});


/**
 * 材料提交 set
 * @param params {Object} 参数
 */
export const submitPolicyPackage = (params, callback) => ({
    type: SUBMIT_POLICYPACKAGE,
    params,
    callback,
});

/**
 * 材料提交 loading 
 * @param params {Object} 参数
 */
export const submitPolicyPackageFetching = (params) => ({
    type: SUBMIT_POLICYPACKAGE_FETCHING,
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