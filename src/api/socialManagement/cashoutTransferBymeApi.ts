import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';

// POST /v1/sppay/splist/bu/alreadyProcessed/
// 我转移的审批列表（业务方）
const GET_CASHOUT_TRANSFER_API_BU = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/bu/alreadyProcessed`;
// const GET_CASHOUT_TRANSFER_API_BU = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/bu/approve`;
// POST /v1/sppay/splist/finance/alreadyProcessed/
// 我转移的审批列表（财务）
const GET_CASHOUT_TRANSFER_API_FINANCE = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/alreadyProcessed`;
// POST /v1/sppay/splist/ceo/alreadyProcessed/
// 我转移的审批列表（ceo）
const GET_CASHOUT_TRANSFER_API_CEO = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/ceo/alreadyProcessed`;
// /v1/sppay/splist/my
// 我的请款单列表（提交人）
const GET_CASHOUT_TRANSFER_API_MY = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/my`;
// SP请款付款
const GET_SPTABLEDATA_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/waitFroPay`;

// 组织结构
const USER_BY_ORGANIZATIONS_API = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`;
// 驳回原因
const GET_CASHOUT_REJECTREASON_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/detail/single`;
// 员工信息map
const USER_MAP_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpUser/getUserInfoById`;
// 取消请款 
const GET_CASHOUT_CANCEL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/cancel`;

/**
 * 打款图片 api
 */
const GET_PROVE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPayDetail/findByCode`;
// 修改打款信息
const PAYENTRYINFO_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPayDetail/update`;
const GET_COUNT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/waitFroPay/count`;

export const getCountApi = (data)=>{
    return fetchFn(GET_COUNT_API, data).then(data => data);
}

export const getCashoutTransferApi = (data) => {
   
    // 角色 0 业务方 1 财务  2 ceo 3我的提交
    switch (data.role) {
        case 0: {
            return fetchFn(GET_CASHOUT_TRANSFER_API_BU, data).then(data => data);
        }
        case 1: {
            return fetchFn(GET_CASHOUT_TRANSFER_API_FINANCE, data).then(data => data);
        }
        case 2: {
            return fetchFn(GET_CASHOUT_TRANSFER_API_CEO, data).then(data => data);
        }
        case 3: {
            return fetchFn(GET_CASHOUT_TRANSFER_API_MY, data).then(data => data);

        }
        case 4: {
            return fetchFn(GET_SPTABLEDATA_API, data).then(data => data);

        }

        default:
        // return fetchFn(GET_CASHOUT_TRANSFER_API_CEO, data).then(data => data);
    }
}
export const userByOrganizationsApi = (data) => {
    return fetchFn(USER_BY_ORGANIZATIONS_API, data).then(data => data);
}
export const getCashoutRejectReasonApi = (data) => {
   
    return fetchFn(GET_CASHOUT_REJECTREASON_API, data).then(data => data);
}
export const cashoutCancelApi = (data) => {


    return fetchFn(GET_CASHOUT_CANCEL_API, data).then(data => data);
}
export const userMapApi = (data) => {
   
    return fetchFn(USER_MAP_API, [], {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data);
}

export const payentryinfoApi = (data) => fetchFn(PAYENTRYINFO_API, data, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);
/**
 * 打款证明图片 fetch
 * @param data {Object} 参数
 */
export const getProve = (data) => fetchFn(GET_PROVE_API, data).then(data => data);
