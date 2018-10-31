import { DOMAIN_OXT } from '../../global/global'
import { fetchFn } from '../../util/fetch';

/**
 * 回传信息
 */
export const GET_LIST_DATA_API = `${DOMAIN_OXT}/apiv2_/social/adjust/upload-info/list`;
export const getListData = (params) => fetchFn(GET_LIST_DATA_API, params).then(data => data);


/**
 * 修改公司名称
 */
export const SET_COMPANY_NAME_API = `${DOMAIN_OXT}/apiv2_/social/adjust/update/upload-info/c-name`;
export const setCompanyName = (params) => fetchFn(SET_COMPANY_NAME_API, params).then(data => data);

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





