import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
const GET_IMPORT_EXPORT_RECORDS_API = `${DOMAIN_OXT}/apiv2_/order/invoice/exceliohistory`;
// const GET_IMPORT_EXPORT_RECORDS_API = `${DOMAIN_OXT}/apiv2_/order/invoice/exceliohistory`;

/**
 * 导入导出历史记录 get 
 * @param params {Object} 参数
 */
export const getImportExportRecords = (params) => fetchFn(GET_IMPORT_EXPORT_RECORDS_API, params).then(data => data);
