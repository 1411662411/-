import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const PAY_GET_IMPORT_EXPORT_RECORDS_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/input/wprecord`;

/**
 * 导入导出历史记录 get 
 * @param params {Object} 参数
 */
export const paygetImportExportRecords = (params) => fetchFn(PAY_GET_IMPORT_EXPORT_RECORDS_API, params).then(data => data);
