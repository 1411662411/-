import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';


const ENTRY_API = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/addOrUpdateInfo`;

/**
 * 编辑 get 
 * @param params {Object} 参数
 */
export const entry = (params) => fetchFn(ENTRY_API, params, {
    headers: {
        'Content-Type': 'application/json',
    }
}).then(data => data);



