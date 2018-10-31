import { fetchFn } from '../../util/fetch';
import { DOMAIN_OXT } from "../../global/global";
const GET_LIST_API = `${DOMAIN_OXT}/apiv2_/social/usersocial/insured-number/adviser-list`;


/** 获取列表
 * @param {Object} params 参数
 */
export const listGet = (params) => fetchFn(GET_LIST_API, params).then(data => data);

