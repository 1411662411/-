import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

const ENABLE_SWITCH_API = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/info/enable-status`;

/**
 * 停用启用 get 
 * @param params {Object} 参数
 */
export const enableSwitch = (params) => fetchFn(ENABLE_SWITCH_API, params).then(data => data);



