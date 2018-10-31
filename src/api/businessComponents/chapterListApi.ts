import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';

const CHAPTERLIST_ADMIN_API = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/listCsForAdmin`;

const CHAPTERLIST_API = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/listCs`;

const PERSONSOURCE_API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/listForLicense`;

const TRANSFER_API = `${DOMAIN_OXT}/apiv2_/license/v1/businesslicense/cs/transferCses
`;

const CHAPTER_INFO_ENTER_API = `${DOMAIN_OXT}/apiv3_/license/v1/businesslicense/info/addOrUpdateInfo
`;




/**
 * 章证照列表 get 
 * @param params {Object} 参数
 */
export const chapterList = (params) => {
  CHAPTERLIST_ADMIN_API
  if(params.role === 1) {
    return fetchFn(CHAPTERLIST_ADMIN_API, params).then(data => data);
  }
  else {
    return fetchFn(CHAPTERLIST_API, params).then(data => data);
  }
  
  
}
/**
 * 保管人列表 get 
 * @param params {Object} 参数
 */
export const personSource = (params) => fetchFn(PERSONSOURCE_API, params, {
  headers: {
    'Content-Type': 'application/json',
  }
}).then(data => data);


/**
 * 转移开办人 
 * @param params {Object} 参数
 */
export const transfer = (params) => fetchFn(TRANSFER_API, params, {
}).then(data => data);


export const chapterInfoSave = (params) => fetchFn(CHAPTER_INFO_ENTER_API, params, {
  headers: {
    'Content-Type': 'application/json',
  }
}).then(data => data);

