import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

/**
 * 列表 api
 */
export const LIST_API = `${DOMAIN_OXT}/apiv2_/permission/v1/feedbackReply/contentList`;


/**
 * 点赞 api
 */
export const LIKE_API = `${DOMAIN_OXT}/apiv2_/permission/v1/feedbackReply/updatePraise`;


/**
 * 回复 api
 */
export const REPLY_API = `${DOMAIN_OXT}/apiv2_/permission/v1/feedbackReply/addReply`;


/**
 * 回复列表 api
 */
export const REPLY_LIST_API = `${DOMAIN_OXT}/apiv2_/permission/v1/feedbackReply/replyList`;


/**
 * 列表
 * @param params {Object} 请求参数
 */
export const getList = (params) => fetchFn(LIST_API, params).then(data => data);


/**
 * 点赞
 * @param params {Object} 请求参数
 */
export const like = (params) => fetchFn(LIKE_API, params).then(data => data);

/**
 * 回复
 * @param params {Object} 请求参数
 */
export const reply = (params) => fetchFn(REPLY_API, params).then(data => data);


/**
 * 回复列表
 * @param params {Object} 请求参数
 */
export const replylist = (params) => fetchFn(REPLY_LIST_API, params).then(data => data);


