import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const CASH_CLAIM_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/transaction/list`;
const CASH_CLAIM_CBSLIST_API = `${DOMAIN_OXT}/apiv2_/finance/finance/cbs/list`;
const TRANSACTION_HIS_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/transaction/his`;
const IFNEEDOPENINVOICE_API = `${DOMAIN_OXT}/apiv2_/order/order/ifneedinvoice`;

const CASH_CLAIM_ORDER_CHECK_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/transaction/check`;
const CASH_CLAIM_ORDER_COMMIT_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/transaction/save`;
// const CASH_CLAIM_ORDER_COMMIT_API = `http://172.16.14.125:8080/finance/v1/transaction/save`;
// const CASH_CLAIM_ORDER_COMMIT_API = `http://127.0.0.1:3000`;

//  transactionList: '/admin/apiv2_/finance/finance/v1/transaction/list', //获取列表
//     transactionInfo: '/admin/apiv2_/finance/finance/v1/transaction/his', //获取详情
//     cbsList: '/admin/apiv2_/finance/finance/cbs/list',
//     transactionCheck: '/admin/apiv2_/finance/finance/v1/transaction/check', //验证
//     transactionSave: '/admin/apiv2_/finance/finance/v1/transaction/save', //保存

// 到款认领列表
export const cashClaimApi = (data) => {
    return fetchFn(CASH_CLAIM_API, data).then(data => data);
}
export const cashClaimCbsApi = (data) => {
    return fetchFn(CASH_CLAIM_CBSLIST_API, data).then(data => data);
}
// 到款认领列表历史
export const transactionHisApi = (data) => {
    return fetchFn(TRANSACTION_HIS_API, data).then(data => data);
}
// 是否需要开发票
export const ifNeedOpenInvoiceApi = (data) => {
    return fetchFn(IFNEEDOPENINVOICE_API, data).then(data => data);
}
export const cashClaimCheckApi = (data) => {
    return fetchFn(CASH_CLAIM_ORDER_CHECK_API, data).then(data => data);
}
// 
export const cashClaimCommitApi = (data) => {
    return fetchFn(CASH_CLAIM_ORDER_COMMIT_API, data).then(data => data);
}
