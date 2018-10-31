/** 信息详情 get */
export const CHAPTER_INFO_DETAIL_SAGA = 'businessComponents/chapter/CHAPTER_INFO_DETAIL_SAGA';

/** 信息详情 set */
export const CHAPTER_INFO_DETAIL_SET = 'businessComponents/chapter/CHAPTER_INFO_DETAIL_SET';

/** FETCHING */
export const FETCHING = 'businessComponents/chapter/CHAPTER_INFO_FETCHING';

/**
 * 信息详情 get
 * @param params {Object} 参数
 */
export const chapterInfoDetail = (params) => ({
    type: CHAPTER_INFO_DETAIL_SAGA,
    params,
})

/**
 * 信息详情 set
 * @param params {Object} 参数
 */
export const chapterInfoDetailSet = (params) => ({
    type: CHAPTER_INFO_DETAIL_SET,
    params,
});

/**
 * 加载中 
 * @param params {Object} 参数
 */
export const fetching = (params) => ({
    type: FETCHING,
    params,
});










