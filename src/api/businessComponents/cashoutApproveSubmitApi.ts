import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

/* 导入文件上传地址 */
export const UPLOAD_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/getDetial`;

/* 收款方名称数据源 分公司 API */
export const RECIPIENTSELECTSOURCE_BRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/getBranchList`;
/* 收款方名称数据源 服务商 API */
export const RECIPIENTSELECTSOURCE_SERVIVE_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/servicer/queryServicerByPageView
`;

/* 付款清单（客户维度）API */
// export const PAYMENTSCHEDULE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillCustomer/list`;
export const PAYMENTSCHEDULE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillCustomer/allList`;
/* 付款清单 （详情） （客户维度）API */
export const PAYMENTSCHEDULE_DETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillCustomer/listByCode`;

/* 垫款明细 API */
export const ADVANCEDETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpAdvancedBillDetail/list`;

/* 垫款明细（详情） API */
export const ADVANCEDETAILS_DETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpAdvancedBillDetail/listByCode`;

/* 付款账单（人月次维度明细表）API */
// export const PAYMENTBILL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillManMonth/list`;
export const PAYMENTBILL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillManMonth/allList`;

/* 付款账单（详情）（人月次维度明细表）API */
export const PAYMENTBILL_DETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillManMonth/listByCode`;


/* 提交审批人 API */
const APPROVED_LIST = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/getSubmitterInfo`;

/* 提交审批 API */
const SUBMIT_APPROVE_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/submit`;

/* 提交审批 （详情） API */
const SUBMIT_APPROVE_DETAILS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/update`;

/* 清除 付款清单（客户维度）*/
const DELETE_PAYMENTSCHEDULE = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillCustomer/logicDelete`;

/* 清除 垫款明细*/
const DELETE_ADVANCEDETAILS = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpAdvancedBillDetail/logicDelete`;

/* 清除 付款账单（人月次维度）*/
const DELETE_PAYMENTBILL = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpPaymentBillManMonth/logicDelete`;


/**
 * 获取用户详情api
 */
const GETPERSONINFO_API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getUserInfo`;

/**
 * 请款单初始化
 */
const INIT_PAYMENT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpRequestFund/init`;

/**
 * 请款单中出款单列表
 */
const GET_PAYMENT_LIST_OF_REQUEST_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jyPaymentInfo/getPaymentListOfRequest`;

/**
 * 保存出款单
 */
const SAVE_PAYMENT_LIST_OF_REQUEST_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jyPaymentInfo/savePaymentOfRequest`;


/**
 * 收款方名称数据源
 */
export const getRecipientSelectsource = (data) => {
    data.start = 0;
    data.length = 9999;
    if (data.recipientSelectType === 'two') {
        return fetchFn(RECIPIENTSELECTSOURCE_BRANCH_API, data).then(data => data);
    }
    return fetchFn(RECIPIENTSELECTSOURCE_SERVIVE_API, data).then(data => data);
}


/**
 * 付款清单（客户维度）数据源
 */
export const getPaymentschedule = (data) => {
    if (data.code) {
        return fetchFn(PAYMENTSCHEDULE_DETAILS_API, data).then(data => data);
    }
    return fetchFn(PAYMENTSCHEDULE_API, data).then(data => data);
}

/**
 * 垫款明细
 * @param data {Object} 参数
 */
export const getAdvancedetails = (data) => {
    if (data.code) {
        return fetchFn(ADVANCEDETAILS_DETAILS_API, data).then(data => data);
    }
    return fetchFn(ADVANCEDETAILS_API, data).then(data => data);
}

/**
 * 款账单（人月次维度明细表）
 * @param data {Object} 参数
 */
export const getPaymentbill = (data) => {
    if (data.code) {
        return fetchFn(PAYMENTBILL_DETAILS_API, data).then(data => data);
    }
    return fetchFn(PAYMENTBILL_API, data).then(data => data);
}


/**
 * 提交审批人source
 * @param data {Object} 参数
 */
export const getApproved = (data) => fetchFn(APPROVED_LIST, data).then(data => data);


/**
 * 提交审批
 * @param data {Object} 参数
 */
export const submitApprove = (data) => {
    const code = data.code;
    if (code) {
        return fetchFn(SUBMIT_APPROVE_DETAILS_API, data).then(data => { data['code'] = code; return data; });
    }
    return fetchFn(SUBMIT_APPROVE_API, data).then(data => data);
}


/**
 * 清除数据
 * @param data {Object} 参数
 */
export const deleteUploadRecord = (data) => {
    let api;
    switch (data.type) {
        case 1:
            api = DELETE_PAYMENTSCHEDULE;
            break;
        case 2:
            api = DELETE_ADVANCEDETAILS;
            break;
        case 3:
            api = DELETE_PAYMENTBILL;
            break;
        default:
            throw new Error('no "index" param at deleteUploadRecord Function');
    }
    return fetchFn(api, data).then(data => data);
}


/**
 * 获取用户数据
 * @param data {Object} 参数
 */
export const getPersonInfo = (data) => fetchFn(GETPERSONINFO_API, data).then(data => data);

/**
 * 请款单 初始化
 */
export const initPaymentApi = (data) => fetchFn(INIT_PAYMENT_API, data).then(data => data);
/**
 * 获取请款单页面 收款方i洗脑洗中出款单列表
 */
export const getPaymentListOfRequest = (data) => fetchFn(GET_PAYMENT_LIST_OF_REQUEST_API, data).then(data => data);

/**
 * 提交出款单
 * @param data {Object} 参数
 */
export const savePaymentOfRequest = (data) => {
    
    return fetchFn(SAVE_PAYMENT_LIST_OF_REQUEST_API, data).then(data => data);
}