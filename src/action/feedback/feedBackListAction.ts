/** 列表数据 get */
export const LIST_SAGA = 'feedback/feedBackList/LIST_SAGA';

/** 列表数据 set */
export const LIST_SET = 'feedback/feedBackList/LIST_SET';

/** 点赞 get */
export const LIKE_SAGA = 'feedback/feedBackList/LIKE_SAGA';

/** 回复 */
export const REPLY_SAGA = 'feedback/feedBackList/REPLY_SAGA';

/** fetching */
export const LIST_FETCHING = 'feedback/feedBackList/LIST_FETCHING';

/** reply fetching */
export const REPLY_FETCHING = 'feedback/feedBackList/REPLY_FETCHING';

/**
 * 回复历史列表
 */
export const REPLY_LIST_SAGA = 'feedback/feedBackList/REPLY_LIST_SAGA';

/**
 * 回复历史列表 set
 */
export const REPLY_LIST_SET = 'feedback/feedBackList/REPLY_LIST_SET';

/**
 * 回复历史列表 fetching
 */
export const REPLY_LIST_FETCHING = 'feedback/feedBackList/REPLY_LIST_FETCHING';

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


/**
 * 回复 fetching
 * @param params {Boolean} 参数
 */
export const replyFetching = (params) => ({
    type: REPLY_FETCHING,
    params,
});



/**
 * 点赞
 * @param params {Boolean} 参数
 */
export const like = (params, callback?) => ({
    type: LIKE_SAGA,
    params,
    callback,
});

/**
 * 回复
 * @param params {Boolean} 参数
 */
export const reply= (params, callback?) => ({
    type: REPLY_SAGA,
    params,
    callback,
});



/**
 * 回复列表
 * @param params {Boolean} 参数
 */
export const replylist= (params, callback?) => ({
    type: REPLY_LIST_SAGA,
    params,
    callback,
});

/**
 * 回复列表
 * @param params {Boolean} 参数
 */
export const replylistSet= (params, callback?) => ({
    type: REPLY_LIST_SET,
    params,
    callback,
});

/**
 * 回复列表 fetching
 * @param params {Boolean} 参数
 */
export const replylistFetching = (params) => ({
    type: REPLY_LIST_FETCHING,
    params,
});










