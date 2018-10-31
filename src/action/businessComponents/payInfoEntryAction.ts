export const BASEFETCHING = 'PAYINFOENTRY_BASEFETCHING';

/**
 * 请款单详情 get
 */
export const PAYINFOENTRY_SAGA = 'PAYINFOENTRY_SAGA';

/**
 * 请款单详情 set
 */
export const PAYINFOENTRY_DATA_RECEIVED = 'PAYINFOENTRY_DATA_RECEIVED';

/**
 * 付款清单（客户维度）get 
 */
export const PAYINFOENTRY_PAYMENTSCHEDULE_SAGA = 'PAYINFOENTRY_PAYMENTSCHEDULE_SAGA';


/**
 * 付款清单（客户维度）set
 */
export const PAYINFOENTRY_PAYMENTSCHEDULE_DATA_RECEIVE = 'PAYINFOENTRY_PAYMENTSCHEDULE_DATA_RECEIVE';

/**
 * 垫款明细 get 
 */
export const PAYINFOENTRY_ADVANCEDETAILS_SAGA = 'PAYINFOENTRY_ADVANCEDETAILS_SAGA';


/**
 * 垫款明细 set
 */
export const PAYINFOENTRY_ADVANCEDETAILS_DATA_RECEIVE = 'PAYINFOENTRY_ADVANCEDETAILS_RECEIVE';

/**
 * 付款账单（人月次维度明细表） get 
 */
export const PAYINFOENTRY_PAYMENTBILL_SAGA = 'PAYINFOENTRY_PAYMENTBILL_SAGA';


/**
 * 付款账单（人月次维度明细表） set
 */
export const PAYINFOENTRY_PAYMENTBILL_DATA_RECEIVE = 'PAYINFOENTRY_PAYMENTBILL_RECEIVE';


/**
 * 请款记录 get 
 */
export const PAYINFOENTRY_RECORDS_SAGA = 'PAYINFOENTRY_RECORDS_SAGA';


/**
 * 请款记录 set
 */
export const PAYINFOENTRY_RECORDS_DATA_RECEIVE = 'PAYINFOENTRY_RECORDS_DATA_RECEIVE';

/**
 * 重置数据
 */
export const PAYINFOENTRY_RESET = 'PAYINFOENTRY_RESET';



/**
 * 提交
 */
export const PAYINFOENTRY_SUBMIT_SAGA = 'PAYINFOENTRY_SUBMIT_SAGA';
/**
 * 取消
 */
export const PAYINFOENTRY_REMOVE_SAGA = 'PAYINFOENTRY_REMOVE_SAGA';
/**
 * 提交loading
 */
export const SUBMITFETCHING = 'PAYINFOENTRY_SUBMITFETCHING';
export const REMOVEFETCHING = 'PAYINFOENTRY_REMOVEFETCHING';

/**
 * 订单异常的弹窗
 */
 export const EXCEPTION_MODAL = 'PAYINFOENTRY_EXCEPTION_MODAL';

/**
 * loading
 * @param params {Object} 参数
 */
export const baseFetching = (params) => ({
    type: BASEFETCHING,
    params,
});


/**
 * 获取请款单详情
 * @param params {Object} 参数
 */
export const getPayinfoentry = (params) => ({
    type: PAYINFOENTRY_SAGA,
    params,
});


/**
 * 设置请款单详情
 * @param params {Object} 参数
 */
export const setPayinfoentry = (params) => ({
    type: PAYINFOENTRY_DATA_RECEIVED,
    params,
});


/**
 * 获取付款清单（客户维度）
 * @param params {Object} 参数
 */
export const getPaymentschedule = (params) => ({
    type: PAYINFOENTRY_PAYMENTSCHEDULE_SAGA,
    params,
});


/**
 * 设置付款清单（客户维度）
 * @param params {Object} 获取到的数据
 */
export const setPaymentschedule = (params) => ({
    type: PAYINFOENTRY_PAYMENTSCHEDULE_DATA_RECEIVE,
    params,
});

/**
 * 获取垫款明细
 * @param params {Object} 参数
 */
export const getAdvancedetails = (params) => ({
    type: PAYINFOENTRY_ADVANCEDETAILS_SAGA,
    params,
});


/**
 * 设置垫款明细
 * @param params {Object} 获取到的数据
 */
export const setAdvancedetails = (params) => ({
    type: PAYINFOENTRY_ADVANCEDETAILS_DATA_RECEIVE,
    params,
});


/**
 * 获取付款账单（人月次维度明细表）
 * @param params {Object} 参数
 */
export const getPaymentbill = (params) => ({
    type: PAYINFOENTRY_PAYMENTBILL_SAGA,
    params,
});


/**
 * 设置付款账单（人月次维度明细表）
 * @param params {Object} 获取到的数据
 */
export const setPaymentbill = (params) => ({
    type: PAYINFOENTRY_PAYMENTBILL_DATA_RECEIVE,
    params,
});



/**
 * 获取请款记录
 * @param params {Object} 参数
 */
export const getRecords = (params) => ({
    type: PAYINFOENTRY_RECORDS_SAGA,
    params,
});


/**
 * 设置请款记录
 * @param params {Object} 获取到的数据
 */
export const setRecords = (params) => ({
    type: PAYINFOENTRY_RECORDS_DATA_RECEIVE,
    params,
});


/**
 * 重置state
 */
export const resetState = () => ({
    type: PAYINFOENTRY_RESET,
});






/**
 * 提交
 * @param params {Object} 获取到的数据
 */
export const submit = (params: { approvalStatus: number, params: Object }) => ({
    type: PAYINFOENTRY_SUBMIT_SAGA,
    params,
});
/**
 * 取消
 */
export const remove = (params: { approvalStatus: number, params: Object }) => ({
    type: PAYINFOENTRY_REMOVE_SAGA,
    params,
});
/**
 * 提交loading
 * @param params {Object} 获取到的数据
 */
export const submitfetching = (params) => ({
    type: SUBMITFETCHING,
    params,
});

export const removefetching = (params) => ({
    type: REMOVEFETCHING,
    params,
});
/**
 * 订单异常弹窗
 * @param params {Boolean} 参数
 */
export const exceptionModal = (params) => ({
    type: EXCEPTION_MODAL,
    params,
});
