import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

/**
 * 发票信息
 */
export const INVOICE_INFO_API = `${DOMAIN_OXT}/apiv2_/order/invoice/searchexamineinvoice`;

/**
 * 搜索选项
 */
export const SEARCH_BUTTON_API = `${DOMAIN_OXT}/apiv2_/order/invoice/getexaminestatus`;



/**
 * 信息录入详情
 * @param params {Object} 请求参数
 */
export const getInvoiceInfo = (params) => fetchFn(INVOICE_INFO_API, params).then(data => data);

/**
 * 获取审核状态
 * @param params {Object}
 */
export const getButtonNumbers = (params?) => fetchFn(SEARCH_BUTTON_API, params).then(data => data)


