import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

/* 付款清单（客户维度）API */
export const PAYMENTSCHEDULE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillCustomer/listByCode`;

/* 垫款明细 API */
export const ADVANCEDETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpAdvancedBillDetail/listByCode`;

/* 付款账单（人月次维度明细表）API */
export const PAYMENTBILL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillManMonth/listByCode`;

/* 请款基础信息 API */
export const CASHOUTORDER_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/detail/single`;


/* 提交审核 通过 API */
const CASHOUTORDER_SUBMIT_PASS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFundVerifyRecord/pass`;

/* 提交审核 驳回 API */
const CASHOUTORDER_SUBMIT_REJECT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFundVerifyRecord/reject`;

/**
 * 获取用户详情api
 */
const GETPERSONINFO_API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getUserInfo`;


/**
 * 批量获取用户相关信息
 */
const GETPERSONINFO_BATCH__API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpUser/getUserInfoById`;


/* 提交审批人 API */
const APPROVED_LIST = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/getSubmitterInfo`;

/**
 * 付款清单（客户维度）数据源
 */
export const getPaymentschedule = (data) => {
    return fetchFn(PAYMENTSCHEDULE_API, data).then(data => data);
}

/**
 * 垫款明细
 * @param data {Object} 参数
 */
export const getAdvancedetails = (data) => fetchFn(ADVANCEDETAILS_API, data).then(data => data);

/**
 * 款账单（人月次维度明细表）
 * @param data {Object} 参数
 */
export const getPaymentbill = (data) => fetchFn(PAYMENTBILL_API, data).then(data => data);

/**
 * 请款基础信息
 */
export const getCashoutDetail = (data) => fetchFn(CASHOUTORDER_API, data).then(data => data);



/**
 * 提交审核
 */

export const submit = (data) => {
    const {
        approvalStatus,
        params,
    } = data;
    let API;
    if (approvalStatus === 1) {
        API = CASHOUTORDER_SUBMIT_PASS_API;
    }
    if (approvalStatus === 2) {
        API = CASHOUTORDER_SUBMIT_REJECT_API;
    }
    return fetchFn(API, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(data => data);
}


/**
 * 获取用户数据
 * @param data {Object} 参数
 */
export const getPersonInfo = (data) => fetchFn(GETPERSONINFO_API, data).then(data => data);


/**
 * 批量获取用户数据
 * @param data {Object} 参数
 */
export const getPersonInfoBatch = (data) => fetchFn(GETPERSONINFO_BATCH__API, data, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);

/**
 * 提交审批人source
 * @param data {Object} 参数
 */
export const getApproved = (data) => fetchFn(APPROVED_LIST, data).then(data => data);