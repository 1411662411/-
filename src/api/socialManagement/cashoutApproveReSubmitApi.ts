import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';


/**
 * 请款单修正基本信息API 
 */
export const ORDER_INFO_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/detail/single`;

/**
 * 请款单修正基本信息
 */
export const getOrderInfo = (data) => {
    return fetchFn(ORDER_INFO_API, data).then(data => data);
}

/**
 * 批量获取用户相关信息
 */
const GETPERSONINFO_BATCH__API = `${DOMAIN_OXT}/apiv3_/v1/sppay/jsSpUser/getUserInfoById`;

/**
 * 批量获取用户数据
 * @param data {Object} 参数
 */
export const getPersonInfoBatch = (data) => fetchFn(GETPERSONINFO_BATCH__API, data, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);

