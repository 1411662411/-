import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

/**
 * 列表 api
 */
export const LIST_API = `${DOMAIN_OXT}/apiv2_/license/v1/operation-log/list`;

/**
 * 列表
 * @param params {Object} 请求参数
 */
export const getList = (params) => fetchFn(LIST_API, params).then(data => data);





