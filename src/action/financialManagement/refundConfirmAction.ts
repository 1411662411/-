export const DATA_GET = 'financialManagement/refundConfirmAction/DATA_GET';
export const DATA_SET = 'financialManagement/refundConfirmAction/DATA_SET';
export const FETCHING = 'financialManagement/refundConfirmAction/FETCHING';


/**
 * 获取列表数据
 * @params {Object} params 参数
 * @returns {Object}
 */
export const listGet = (params) => ({
    type: DATA_GET,
    params,
});


/**
 * 设置列表数据
 * @params {Object} params 参数
 * @returns {Object}
 */
export const listSet = (params) => ({
    type: DATA_SET,
    params,
});


/**
 * 请求loading
 * @params {Object} params 参数
 * @returns {Object}
 */
export const fetching = (params) => ({
    type: FETCHING,
    params,
})


