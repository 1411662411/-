import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const INVOICE_EDIT_SUBMIT_API = `${DOMAIN_OXT}/apiv2_/order/invoice/updateinvoice`;

/**
 * 修正发票信息 get 
 * @param params {Object} 参数
 */
export const invoiceEditSubmit = (params) => fetchFn(INVOICE_EDIT_SUBMIT_API, params).then(data => data);

