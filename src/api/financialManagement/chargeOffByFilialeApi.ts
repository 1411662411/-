import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

const LIST_API = `${DOMAIN_OXT}/apiv2_/finance/finance/prepayment-receipt-verify-his/list-verify`;
const UPDATE_API = `${DOMAIN_OXT}/apiv2_/finance/finance/prepayment-receipt-verify-his/finance-verify`;





/**
 * 分公司请款核销列表 get 
 * @param params {Object} 参数
 */
export const list = (params) => fetchFn(LIST_API, params).then(data => data);

/**
 * 驳回 get
 * @param {Object} params 参数
 */
export const reject = (params) => fetchFn(UPDATE_API, params).then(data => data);

