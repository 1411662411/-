import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

/**
 * 信息录入详情
 */
export const CHAPTERINFOENTER_DETAIL_API = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/listInfoByCsId`;


/**
 * 信息录入详情
 * @param params {Object} 请求参数
 */
export const getDetail = (params) => fetchFn(CHAPTERINFOENTER_DETAIL_API, params, {
    headers: {
      'Content-Type': 'application/json',
    }
  }).then(data => data);



