export const BASEFETCHING = 'CASHOUTORDERDETAILS_BASEFETCHING';

/**
 * 请款单详情 get
 */
export const CASHOUTORDERDETAILS_SAGA = 'CASHOUTORDERDETAILS_SAGA';

/**
 * 请款单详情 set
 */
export const CASHOUTORDERDETAILS_DATA_RECEIVED = 'CASHOUTORDERDETAILS_DATA_RECEIVED';

/**
 * 付款清单（客户维度）get 
 */
export const CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA = 'CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA';


/**
 * 付款清单（客户维度）set
 */
export const CASHOUTORDERDETAILS_PAYMENTSCHEDULE_DATA_RECEIVE = 'CASHOUTORDERDETAILS_PAYMENTSCHEDULE_DATA_RECEIVE';

/**
 * 垫款明细 get 
 */
export const CASHOUTORDERDETAILS_ADVANCEDETAILS_SAGA = 'CASHOUTORDERDETAILS_ADVANCEDETAILS_SAGA';


/**
 * 垫款明细 set
 */
export const CASHOUTORDERDETAILS_ADVANCEDETAILS_DATA_RECEIVE = 'CASHOUTORDERDETAILS_ADVANCEDETAILS_RECEIVE';

/**
 * 付款账单（人月次维度明细表） get 
 */
export const CASHOUTORDERDETAILS_PAYMENTBILL_SAGA = 'CASHOUTORDERDETAILS_PAYMENTBILL_SAGA';


/**
 * 付款账单（人月次维度明细表） set
 */
export const CASHOUTORDERDETAILS_PAYMENTBILL_DATA_RECEIVE = 'CASHOUTORDERDETAILS_PAYMENTBILL_RECEIVE';


/**
 * 提交审批人 get
 */
export const GET_APPROVED_SAGA = 'CASHOUTORDERDETAILS_APPROVED_SAGA';

/**
 * 提交审批人 set
 */
export const SET_APPROVED = 'CASHOUTORDERDETAILS_APPROVED_DATA_RECEIVE';

/**
 * 重置数据
 */
export const CASHOUTORDERDETAILS_RESET = 'CASHOUTORDERDETAILS_RESET';


/**
 * 提交审核
 */
export const CASHOUTORDERDETAILS_SUBMIT_SAGA = 'CASHOUTORDERDETAILS_SUBMIT_SAGA';


/**
 * 提交审核
 */
export const SUBMITFETCHING = 'CASHOUTORDERDETAILS_SUBMITFETCHING';

/**
 * 订单异常的弹窗
 */
 export const EXCEPTION_MODAL = 'CASHOUTORDERDETAILS_EXCEPTION_MODAL';

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
export const getCashoutorderdetails = (params) => ({
    type: CASHOUTORDERDETAILS_SAGA,
    params,
});


/**
 * 设置请款单详情
 * @param params {Object} 参数
 */
export const setCashoutorderdetails = (params) => ({
    type: CASHOUTORDERDETAILS_DATA_RECEIVED,
    params,
});


/**
 * 获取付款清单（客户维度）
 * @param params {Object} 参数
 */
export const getPaymentschedule = (params) => ({
    type: CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA,
    params,
});


/**
 * 设置付款清单（客户维度）
 * @param params {Object} 获取到的数据
 */
export const setPaymentschedule = (params) => ({
    type: CASHOUTORDERDETAILS_PAYMENTSCHEDULE_DATA_RECEIVE,
    params,
});

/**
 * 获取垫款明细
 * @param params {Object} 参数
 */
export const getAdvancedetails = (params) => ({
    type: CASHOUTORDERDETAILS_ADVANCEDETAILS_SAGA,
    params,
});


/**
 * 设置垫款明细
 * @param params {Object} 获取到的数据
 */
export const setAdvancedetails = (params) => ({
    type: CASHOUTORDERDETAILS_ADVANCEDETAILS_DATA_RECEIVE,
    params,
});


/**
 * 获取付款账单（人月次维度明细表）
 * @param params {Object} 参数
 */
export const getPaymentbill = (params) => ({
    type: CASHOUTORDERDETAILS_PAYMENTBILL_SAGA,
    params,
});


/**
 * 设置付款账单（人月次维度明细表）
 * @param params {Object} 获取到的数据
 */
export const setPaymentbill = (params) => ({
    type: CASHOUTORDERDETAILS_PAYMENTBILL_DATA_RECEIVE,
    params,
});



// /**
//  * 获取请款记录
//  * @param params {Object} 参数
//  */
// export const getRecords = (params) => ({
//     type: CASHOUTORDERDETAILS_RECORDS_SAGA,
//     params,
// });


// /**
//  * 设置请款记录
//  * @param params {Object} 获取到的数据
//  */
// export const setRecords = (params) => ({
//     type: CASHOUTORDERDETAILS_RECORDS_DATA_RECEIVE,
//     params,
// });


/**
 * 重置state
 */
export const resetState = () => ({
    type: CASHOUTORDERDETAILS_RESET,
});


/**
 * 提交审核
 * @param params {Object} 获取到的数据
 */
export const submit = (params: { approvalStatus: number, params: Object, role: number }) => ({
    type: CASHOUTORDERDETAILS_SUBMIT_SAGA,
    params,
});


/**
 * 提交审核loading
 * @param params {Object} 获取到的数据
 */
export const submitfetching = (params) => ({
    type: SUBMITFETCHING,
    params,
});




/**
 * 获取提交审批人
 * @param params {Object} 参数
 */
export const getApproved = (params) => ({
    type: GET_APPROVED_SAGA,
    params,
});


/**
 * 设置提交审批人
 * @param params {Object} 获取到的数据
 */
export const setApproved = (params) => ({
    type: SET_APPROVED,
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

