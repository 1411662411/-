import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

// 需要我审批的列表（业务方）
const CASHOUT_NEEDS_APPROVAL_API_BU = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/bu/approve`;
// 需要我审批的列表（财务）
const CASHOUT_NEEDS_APPROVAL_API_FINANCE = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/approve`;
// 需要我审批的列表（CEO）
const CASHOUT_NEEDS_APPROVAL_API_CEO = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/ceo/approve`;
// 组织结构
const USER_BY_ORGANIZATIONS_API = `${DOMAIN_OXT}/apiv2_/permission/v1/organization/queryOrganizationsAndUsers`;
// 财务批量审批
const BATCH_EXPORT_PAYMENT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/export/sppayment/bill/customer`;
// ceo审批
const MASTER_EXPORT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFundVerifyRecord/approveBatch`;
// ceo设置计划支付时间
const MASTER_SETTIME_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/updatePayTime`;



export const getCashoutApprovalApi = (data) => {
    // 角色 0 业务方 1 财务  2 ceo
    switch (data.role) {
        case 0:{
             return fetchFn(CASHOUT_NEEDS_APPROVAL_API_BU, data).then(data => data);
        }
        case 1:{
             return fetchFn(CASHOUT_NEEDS_APPROVAL_API_FINANCE, data).then(data => data);
        }
        case 2:{
             return fetchFn(CASHOUT_NEEDS_APPROVAL_API_CEO, data).then(data => data);
            // return fetchFn(CASHOUT_NEEDS_APPROVAL_API_BU, data).then(data => data);
        }
       
    }
    
}
export const userByOrganizationsApi = (data) => {
    return fetchFn(USER_BY_ORGANIZATIONS_API, data).then(data => data);
}
export const batchExportPaymentApi = (data) => {

    return 'tempData';//fetchFn(BATCH_EXPORT_PAYMENT_API, data).then(data => data);
}
export const masterApproveApi = (data) => {

    // 后台需要拆分两个接口
    if(data.updateTime){
        
        return fetchFn(MASTER_SETTIME_API, data).then(data => data);
    }else{
        return fetchFn(MASTER_EXPORT_API, data,{headers:{
            'Content-Type': 'application/json',
        }}).then(data => data);
    }
   
}