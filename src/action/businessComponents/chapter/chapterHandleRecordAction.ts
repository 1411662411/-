/** 列表数据 get */
export const LIST_SAGA = 'feedback/chapterHandleRecordAction/LIST_SAGA';

/** 列表数据 set */
export const LIST_SET = 'feedback/chapterHandleRecordAction/LIST_SET';



/** fetching */
export const LIST_FETCHING = 'feedback/chapterHandleRecordAction/LIST_FETCHING';



/**
 * 列表数据 get
 * @param params {Object} 参数
 */
export const listGet = (params) => ({
    type: LIST_SAGA,
    params,
});

/**
 * 列表数据 set
 * @param params {Object} 参数
 */
export const listSet = (params) => ({
    type: LIST_SET,
    params,
});

/**
 * 列表数据 fetching
 * @param params {Boolean} 参数
 */
export const listFetching = (params) => ({
    type: LIST_FETCHING,
    params,
});







