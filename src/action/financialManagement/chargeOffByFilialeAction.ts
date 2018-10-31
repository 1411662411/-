/** 列表数据 get */
export const CHARGEOFFBYFILIALE_SAGA = 'financialManagement/CHARGEOFFBYFILIALE_SAGA';

/** 列表数据 set */
export const CHARGEOFFBYFILIALE_SET = 'financialManagement/CHARGEOFFBYFILIALE_SET';


/** fetching */
export const FETCHING = 'financialManagement/CHARGEOFFBYFILIALE_FETCHING';

/**
 * 驳回
 */
export const REJECT = 'financialManagement/CHARGEOFFBYFILIALE_REJECT';

/**
 * 确认取回
 */
export const RETRIEVE = 'financialManagement/CHARGEOFFBYFILIALE_RETRIEVE';

/**
 * 取消取回
 */
export const UNRETRIEVE = 'financialManagement/CHARGEOFFBYFILIALE_UNRETRIEVE';

/**
 * 列表数据 get
 * @param params {Object} 参数
 */
export const listGet = (params) => ({
    type: CHARGEOFFBYFILIALE_SAGA,
    params,
})

/**
 * 列表数据 set
 * @param params {Object} 参数
 */
export const listSet = (params) => ({
    type: CHARGEOFFBYFILIALE_SET,
    params,
})



/**
 * 加载中 
 * @param params {Object} 参数
 */
export const fetching = (params) => ({
    type: FETCHING,
    params,
});

/**
 * 驳回
 * @param {Object} params 参数
 */
export const reject = (params, callback?: () => void) =>({
    type: REJECT,
    params,
    callback,
});

/**
 * 确认取回
 * @param {Object} params 参数
 */
export const retrieve = (params) =>({
    type: RETRIEVE,
    params,
});

/**
 * 取消取回
 * @param {Object} params 参数
 */
export const unretrieve = (params) =>({
    type: UNRETRIEVE,
    params,
});












