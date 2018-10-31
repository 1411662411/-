export const UPLOADING = 'CASHOUTAPPROVESUBMIT_UPLOADING';
export const RECIPIENTCARDLOADING = 'CASHOUTAPPROVESUBMIT_RECIPIENTCARDLOADING';


/**
 * 收款方名称 get
 */
export const RECIPIENTSELECTSOURCE_SAGA = 'CASHOUTAPPROVESUBMIT_RECIPIENTSELECTSOURCE_SAGA';



/**
 * 收款方名称 set
 */
export const RECIPIENTSELECTSOURCE_DATA_RECEIVED = 'CASHOUTAPPROVESUBMIT_RECIPIENTSELECTSOURCE_DATA_RECEIVED';

export const RECIPIENTSOURCELOADING = 'CASHOUTAPPROVESUBMIT_RECIPIENTSOURCELOADING';


/**
 * 付款清单（客户维度） loading 
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_FETCHING = 'CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_FETCHING';

/**
 * 付款清单（客户维度）get 
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA = 'CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA';


/**
 * 付款清单（客户维度）set
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_DATA_RECEIVE = 'CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_DATA_RECEIVE';

/**
 * 垫款明细 loading 
 */
export const CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_FETCHING = 'CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_FETCHING';

/**
 * 垫款明细 get 
 */
export const CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA = 'CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA';


/**
 * 垫款明细 set
 */
export const CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_DATA_RECEIVE = 'CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_RECEIVE';

/**
 * 付款账单（人月次维度明细表） get 
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA = 'CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA';

/**
 * 付款账单（人月次维度明细表） loading 
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTBILL_FETCHING = 'CASHOUTAPPROVESUBMIT_PAYMENTBILL_FETCHING';

/**
 * 付款账单（人月次维度明细表） set
 */
export const CASHOUTAPPROVESUBMIT_PAYMENTBILL_DATA_RECEIVE = 'CASHOUTAPPROVESUBMIT_PAYMENTBILL_RECEIVE';

/**
 * 提交审批人 get
 */
export const GET_APPROVED_SAGA = 'CASHOUTAPPROVESUBMIT_APPROVED_SAGA';

/**
 * 提交审批人 set
 */
export const SET_APPROVED = 'CASHOUTAPPROVESUBMIT_APPROVED_DATA_RECEIVE';


/**
 * 提交审批 set
 */
export const SUBMIT_APPROVE = 'CASHOUTAPPROVESUBMIT_APPROVED_SUBMIT_APPROVE';


/**
 * 清除数据
 */
export const DELETE_UPLOAD_RECORD_SAGA = 'CASHOUTAPPROVESUBMIT_APPROVED_DELETE_UPLOAD_RECORD';



/**
 * 提交loading
 */
export const SUBMITFETCHING = 'CASHOUTAPPROVESUBMIT_APPROVED_SUBMITFETCHING';


/**
 * 订单异常的弹窗
 */
 export const EXCEPTION_MODAL = 'CASHOUTAPPROVESUBMIT_APPROVED_EXCEPTION_MODAL';

/**
 * 收款方出款单列表
 */

 export const GET_PAYMENT_LIST_OF_REQUEST = '/socialManagement/GET_PAYMENT_LIST_OF_REQUEST';

/***
 * 初始化请款单信息
 */

 export const INIT_PAYMENT = '/socialManagement/init_payment';
/***
 * 初始化请款单信息
 */

 export const UPDATE_CAS_PAYMENT_ID = '/socialManagement/updateCasPaymentId';

 /**
 * 出款单
 */
export const CASHOUTAPPROVESUBMIT_SET_PAYMENT_LIST = '/socialManagement/setPaymentList';


/**
 * 更新上传状态
 * @param params {Object} 参数
 */
export const uploading = (params) => ({
    type: UPLOADING,
    params,
});






/**
 * 获取收款方名称source
 * @param params {Object} 参数
 */
export const getRecipientSelectSource = (params) => ({
    type: RECIPIENTSELECTSOURCE_SAGA,
    params,
});


/**
 * 设置收款方名称source
 * @param params {Object} 参数
 */
export const setRecipientSelectSource = (params) => ({
    type: RECIPIENTSELECTSOURCE_DATA_RECEIVED,
    params,
});


/**
 * 收款方名称source loading
 * @param params {Boolean} 参数
 */
export const recipientsourceloading = (params) => ({
    type: RECIPIENTSOURCELOADING,
    params,
});

/**
 * 获取付款清单（客户维度） loading
 * @param params {Object} 参数
 */
export const paymentscheduleFetching = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_FETCHING,
    params,
});

/**
 * 获取付款清单（客户维度）
 * @param params {Object} 参数
 */
export const getPaymentschedule = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_SAGA,
    params,
});


/**
 * 设置付款清单（客户维度）
 * @param params {Object} 获取到的数据
 */
export const setPaymentschedule = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTSCHEDULE_DATA_RECEIVE,
    params,
});

/**
 * 获取垫款明细 loading
 * @param params {Object} 参数
 */
export const advancedetailsFetching = (params) => ({
    type: CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_FETCHING,
    params,
});

/**
 * 获取垫款明细
 * @param params {Object} 参数
 */
export const getAdvancedetails = (params) => ({
    type: CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_SAGA,
    params,
});


/**
 * 设置垫款明细
 * @param params {Object} 获取到的数据
 */
export const setAdvancedetails = (params) => ({
    type: CASHOUTAPPROVESUBMIT_ADVANCEDETAILS_DATA_RECEIVE,
    params,
});

/**
 * 获取付款账单（人月次维度明细表） loading
 * @param params {Object} 参数
 */
export const paymentbillFetching = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTBILL_FETCHING,
    params,
});

/**
 * 获取付款账单（人月次维度明细表）
 * @param params {Object} 参数
 */
export const getPaymentbill = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTBILL_SAGA,
    params,
});


/**
 * 设置付款账单（人月次维度明细表）
 * @param params {Object} 获取到的数据
 */
export const setPaymentbill = (params) => ({
    type: CASHOUTAPPROVESUBMIT_PAYMENTBILL_DATA_RECEIVE,
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
 * 提交审批
 * @param params {Object} 参数
 */
export const submitApprove = (params) => ({
    type: SUBMIT_APPROVE,
    params,
});


/**
 * 清除上传的数据
 * @param params {Object} 参数
 */
export const deleteUploadRecord = (params) => ({
    type: DELETE_UPLOAD_RECORD_SAGA,
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



/**
 * 订单异常弹窗
 * @param params {Boolean} 参数
 */
export const exceptionModal = (params) => ({
    type: EXCEPTION_MODAL,
    params,
});

/**
 * *初始化获取请款单信息
 */

 export const initPayment = (platform) => {
     return ({
        type: INIT_PAYMENT,
        params:{platform},
     })
 }

/**
 * *获取收款方信息中出款单列表
 */

 export const getPaymentListOfRequest = (params) => ({
     type: GET_PAYMENT_LIST_OF_REQUEST,
     params,
 })

/**
 * *更新请款单id
 */

 export const updateCasPaymentId = (params) => ({
     type: UPDATE_CAS_PAYMENT_ID,
     params,
 })

 /**
 * 设置出款单列表
 * @param params {Object} 获取到的数据
 */
export const setPaymentList = (params) => ({
    type: CASHOUTAPPROVESUBMIT_SET_PAYMENT_LIST,
    params,
});
