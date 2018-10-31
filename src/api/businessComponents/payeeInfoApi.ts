import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

/**
 * 二次请款方姓名列表
 */
export const SECONDCASHOUTNAME_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/sbjbjg/list`;

/**
 * 二次请款方信息
 */
export const SECONDCASHOUTINFO_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/getInfo`;


/**
 * 二次请款方姓名列表
 * @param params {Object} 请求参数
 */
export const getSecondCashoutNameSource = (params) => fetchFn(SECONDCASHOUTNAME_API, params).then(data => data);


/**
 * 二次请款方信息
 * @param params {Object} 请求参数
 */
export const getSecondCashoutInfo = (params) => fetchFn(SECONDCASHOUTINFO_API, params).then(data => data);

