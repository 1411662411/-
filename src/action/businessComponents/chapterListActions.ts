/** 列表数据 get */
export const CHAPTERLIST_SAGA = 'businessComponents/CHAPTERLIST_SAGA';

/** 列表数据 set */
export const CHAPTERLIST_SET = 'businessComponents/CHAPTERLIST_SET';

/**保管人员 get */
export const PERSONSOURCE_SAGA =  'businessComponents/CHAPTERLIST_PERSONSOURCE_SAGA';

/**保管人员 get */
export const PERSONSOURCE_SET =  'businessComponents/CHAPTERLIST_PERSONSOURCE_SET';

/**列表数据对比数据 set */
export const CHAPTERLIST_COMPARE_DATASOURCE_SET =  'businessComponents/CHAPTERLIST_COMPARE_DATASOURCE_SET';


/** 转移开办人 get */
export const TRANSFER_SAGA = 'businessComponents/CHAPTERLIST_TRANSFER_SAGA';

/** 转移开办人 get */
export const FETCHING = 'businessComponents/CHAPTERLIST_FETCHING';

export const TOTAL = 'businessComponents/CHAPTERLIST_TOTAL';

/**
 * 录入信息 save
 */
export const CHAPTERLIST_CHAPTERINFO_SAVE_SAGA =  'businessComponents/CHAPTERLIST_CHAPTERINFO_SAVE_SAGA';

/**
 * 列表数据 get
 * @param params {Object} 参数
 */
export const chapterListGet = (params) => ({
    type: CHAPTERLIST_SAGA,
    params,
})

/**
 * 列表数据 set
 * @param params {Object} 参数
 */
export const chapterListSet = (params) => ({
    type: CHAPTERLIST_SET,
    params,
})


/**
 * 保管人数据 get
 * @param params {Object} 参数
 */
export const personSourceGet = (params) => ({
    type: PERSONSOURCE_SAGA,
    params,
})

/**
 * 保管人数据 set
 * @param params {Object} 参数
 */
export const personSourceSet = (params) => ({
    type: PERSONSOURCE_SET,
    params,
})

/**
 * 保管人数据对比数据 get
 * @param params {Object} 参数
 */
export const compareDataSourceSet = (params) => ({
    type: CHAPTERLIST_COMPARE_DATASOURCE_SET,
    params,
})

/**
 * 转移开办人 get
 * @param params {Object} 参数
 */
export const transfer = (params, callback) => ({
    type: TRANSFER_SAGA,
    params,
    callback,
})


/**
 * 加载中 
 * @param params {Object} 参数
 */
export const fetching = (params) => ({
    type: FETCHING,
    params,
})

/**
 * 总数
 * @param params {Object} 参数
 */
export const total = (params) => ({
    type: TOTAL,
    params,
})

/**
 * 信息录入save
 * @param params {Object} 参数
 */
export const chapterInfoEnterSave = (params, callback) => ({
    type: CHAPTERLIST_CHAPTERINFO_SAVE_SAGA,
    params,
    callback,
});









