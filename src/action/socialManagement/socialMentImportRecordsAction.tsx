/**
 * 导入导出历史记录 saga
 */
export const SOCIAL_RECORDS_SAGA = 'SOCIAL_RECORDS_BUSINESS_COMPONENTS_SAGA';
/**
 * 导入导出历史记录 fetching
 */
export const SOCIAL_IMPORT_EXPORT_RECORDS_FETCHING = 'SOCIAL_IMPORT_EXPORT_RECORDS_BUSINESS_COMPONENTS_FETCHING';

/**
 * 导入导出历史记录 set
 */
export const SOCIAL_IMPORT_EXPORT_RECORDS_SET = 'SOCIAL_IMPORT_EXPORT_RECORDS_BUSINESS_COMPONENTS_SET';


/**
 * 导入导出历史记录 get
 * @param params {Object} 请求参数
 */
export const getSocalImportExportRecords = (params) => ({
    type: SOCIAL_RECORDS_SAGA,
    params,
});
/**
 * 导入导出历史记录 fetching
 * @param params {Object} 请求参数
 */
export const getSocalImportExportRecordsFetching = (params) => ({
    type: SOCIAL_IMPORT_EXPORT_RECORDS_FETCHING,
    params,
});

/**
 * 导入导出历史记录 set
 * @param params {Object} 请求参数
 */
export const setSocalImportExportRecords = (params) => ({
    type: SOCIAL_IMPORT_EXPORT_RECORDS_SET,
    params,
});

