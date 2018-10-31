import { ROUTER_PATH } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const SOCIAL_IMPORT_EXPORT_RECORDS_API =`${ROUTER_PATH}/apiv2_/finance/finance/v1/prepayments/history/list`
/**
 * 导入导出历史记录 get 
 * @param params {Object} 参数
 */

export const socialImportExportRecords = (params) => fetchFn(SOCIAL_IMPORT_EXPORT_RECORDS_API, params).then(data => data);