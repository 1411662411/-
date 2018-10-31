/**
 * 请款单修正基本数据 get
 */
export const ORDER_INFO_SAGA  = 'CASHOUTAPPROVERESUBMIT_ORDER_INFO_SAGA';

/**
 * 请款单修正基本数据 set
 */
export const ORDER_INFO_DATA_RECEIVE = 'CASHOUTAPPROVERESUBMIT_ORDER_INFO_DATA_RECEIVE';

/**
 * 请款单修正基本数据 loading
 */
export const FETCHING = 'CASHOUTAPPROVERESUBMIT_ORDER_INFO_FEVTING';


/**
 * 请款单修正 get
 * @param params {Object} 参数
 */
export const getOrderInfo = (params) => ({
    type: ORDER_INFO_SAGA,
    params,
});


/**
 * 请款单修正 set
 * @param params {Object} 参数
 */
export const setOrderInfo = (params) => ({
    type: ORDER_INFO_DATA_RECEIVE,
    params,
});


export const fetching  = (params) => ({
    type: FETCHING,
    params,
});

