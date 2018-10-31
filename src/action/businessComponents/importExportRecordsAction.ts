/**
 * 导入导出历史记录 saga
 */
export const IMPORT_EXPORT_RECORDS_SAGA = 'IMPORT_EXPORT_RECORDS_BUSINESS_COMPONENTS_SAGA';
export const PAT_INFO_RECORDS_SAGA = 'PAT_INFO_RECORDS_BUSINESS_COMPONENTS_SAGA';
/**
 * 导入导出历史记录 fetching
 */
export const IMPORT_EXPORT_RECORDS_FETCHING = 'IMPORT_EXPORT_RECORDS_BUSINESS_COMPONENTS_FETCHING';

/**
 * 导入导出历史记录 set
 */
export const IMPORT_EXPORT_RECORDS_SET = 'IMPORT_EXPORT_RECORDS_BUSINESS_COMPONENTS_SET';


/**
 * 导入导出历史记录 get
 * @param params {Object} 请求参数
 */
export const getImportExportRecords = (params) => ({
    type: IMPORT_EXPORT_RECORDS_SAGA,
    params,
});
export const getPayInfoImportExportRecords = (params) => ({
    type: PAT_INFO_RECORDS_SAGA,
    params,
});
/**
 * 导入导出历史记录 fetching
 * @param params {Object} 请求参数
 */
export const getImportExportRecordsFetching = (params) => ({
    type: IMPORT_EXPORT_RECORDS_FETCHING,
    params,
});

/**
 * 导入导出历史记录 set
 * @param params {Object} 请求参数
 */
export const setImportExportRecords = (params) => ({
    type: IMPORT_EXPORT_RECORDS_SET,
    params,
});

