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


/**
 * 批量获取用户相关信息
 */
const GETPERSONINFO_BATCH__API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpUser/getUserInfoById`;

const SUBMIT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPayDetail/add`;
const REMOVE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/financeCancel`;
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
export const getPayinfoentry = (data) => fetchFn(CASHOUTORDER_API, data).then(data => data);



/**
 * 提交审核
 */

export const submit = (data) => fetchFn(SUBMIT_API, data, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);

/**
 * 取消
 */
export const remove = (data) => fetchFn(REMOVE_API, data, {
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
}).then(data => data);
/**
 * 批量获取用户数据
 * @param data {Object} 参数
 */
export const getPersonInfoBatch = (data) => fetchFn(GETPERSONINFO_BATCH__API, data, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);


