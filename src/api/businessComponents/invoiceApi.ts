import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const INVOICE_BASE_INFO_SUBMIT_API = `${DOMAIN_OXT}/apiv2_/order/invoice/getdefaultinvoice`;
const INVOICE_BASE_INFO_DETAIL_API = `${DOMAIN_OXT}/apiv2_/order/invoice/detail`;
const INVOICE_EXPRESS_INFO_API = `${DOMAIN_OXT}/apiv2_/account/address/list`;
const INVOICE_WHITE_EXISTS_API = `${DOMAIN_OXT}/apiv2_/order/invoice/white/exists`;

/**
 * 发票基础信息 get (提交页面)
 * @param params {Object} 参数
 */
export const getInvoiceBaseInfoSubmit = (params) => fetchFn(INVOICE_BASE_INFO_SUBMIT_API, params).then(data => data);

/**
 * 判断是否存在白名单
 * @param params {Object} 参数
 */
export const getInvoiceWhiteExists = (params) => fetchFn(INVOICE_WHITE_EXISTS_API, params).then(data => data);


/**
 * 发票基础信息 get (修正页面 | 查看页面)
 * @param params {Object} 参数
 */
export const getInvoiceBaseInfoDetail = (params) => fetchFn(INVOICE_BASE_INFO_DETAIL_API, params).then(data => data);


/**
 * 发票基础信息 get (提交页面)
 * @param params {Object} 参数
 */
export const getExpressInfo = (params) => fetchFn(INVOICE_EXPRESS_INFO_API, params).then(data => data);