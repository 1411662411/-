/**
 * 二次请款方姓名列表 get
 */
export const SECONDCASHOUTNAMESOURCE_SAGA = 'PAYEEINFO_SECONDCASHOUTNAMESOURCE_SAGA';
/**
 * 二次请款方姓名列表 fetching
 */
export const SECONDCASHOUTNAMESOURCE_FETCHING = 'PAYEEINFO_SECONDCASHOUTNAMESOURCE_FETCHING';

/**
 * 二次请款方姓名列表 set
 */
export const SECONDCASHOUTNAMESOURCE_SET = 'PAYEEINFO_SECONDCASHOUTNAMESOURCE_GET';

/**
 * 二次请款方详细信息 get
 */
export const SECONDCASHOUTINFO_SAGA = 'PAYEEINFO_SECONDCASHOUTINFO_SAGA';

/**
 * 二次请款方详细信息 fetching
 */
export const SECONDCASHOUTINFO_FETCHING = 'PAYEEINFO_SECONDCASHOUTINFO_FETCHING';

/**
 * 二次请款方详细信息 set
 */
export const SECONDCASHOUTINFO_SET = 'PAYEEINFO_SECONDCASHOUTINFO_GET';


/**
 * 二次请款方姓名列表 get
 * @param params {Object} 请求参数
 */
export const getSecondCashoutNameSource  = (params) => ({
        type: SECONDCASHOUTNAMESOURCE_SAGA,
        params,
});


/**
 * 二次请款方姓名列表 set
 * @param params {Object} 参数
 */
export const setSecondCashoutNameSource  = (params) => ({
        type: SECONDCASHOUTNAMESOURCE_SET,
        params,
});

/**
 * 二次请款方姓名列表 fetching
 * @param params {Object} 参数
 */
export const secondCashoutNameSourceFetching  = (params) => ({
        type: SECONDCASHOUTNAMESOURCE_FETCHING,
        params,
});



/**
 * 二次请款方相信信息 get
 * @param params {Object} 请求参数
 */
export const getSecondCashoutInfo  = (params) => ({
        type: SECONDCASHOUTINFO_SAGA,
        params,
});


/**
 * 二次请款方相信信息 set
 * @param params {Object} 参数
 */
export const setSecondCashoutInfo  = (params) => ({
        type: SECONDCASHOUTINFO_SET,
        params,
});

/**
 * 二次请款方相信信息 fetching
 * @param params {Object} 参数
 */
export const secondCashoutInfoFetching  = (params) => ({
        type: SECONDCASHOUTINFO_FETCHING,
        params,
});

