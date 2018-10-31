import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

/**
 * 材料基本信息
 */
export const GET_POLICYPACKAGE_DATA_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/dict/getPolicypackageData`;
export const getPolicypackageData = (params) => fetchFn(GET_POLICYPACKAGE_DATA_API, params).then(data => data);



/**
 * 对应的policyId材料
 */
export const GET_MATERIAL_DATA_API =  `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/material-info`;
export const GET_MATERIALHISTORY_DATA_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/material-history`;
export const getMaterialData = (params) => {
    const API = (params.role === 0 || params.role === 1) ? GET_MATERIAL_DATA_API : GET_MATERIALHISTORY_DATA_API;
    return fetchFn(API, params).then(data => data);
} 




/**
 * 更新policyId材料
 */
export const UPDATE_MATERIAL_API =  `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/material-update`;
export const ADD_MATERIAL_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/material-add`;
export const updatePolicypackageData = (params) => {
    const API = params.role === 1 ? ADD_MATERIAL_API : UPDATE_MATERIAL_API;
    return fetchFn(API, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data);
} 


/**
 * 审核材料
 */
export const APPROVE_MATERIAL_API =  `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/material-update`;
export const approvePolicypackageData = (params) => fetchFn(APPROVE_MATERIAL_API, params).then(data => data);





