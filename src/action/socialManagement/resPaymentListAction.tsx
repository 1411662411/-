export const RES_PAYMENTLIST_SAGA = 'RES_PAYMENTLIST_SAGA';
export const START_MERGE_PAYMENT_SAGA = 'START_MERGE_PAYMENT_SAGA';
export const GET_PAYMENT_DATEIL_SAGA = 'GET_PAYMENT_DATEIL_SAGA';  

export const RES_PAYMENTLIST_REDUCERS = 'RES_PAYMENTLIST_REDUCERS'
export const FETCHING = 'FETCHING';

//saga action
export const resPaymentlistSaga = (params) => {  // 第二步action创建函数返回一个action
    return {
        type: RES_PAYMENTLIST_SAGA,
        params,
    }
};
export const startMergePaymentSaga = (params) => {  // 第二步action创建函数返回一个action
    return {
        type: START_MERGE_PAYMENT_SAGA,
        params,
    }
};
export const getPaymentDetailSaga = (params) => {  // 第二步action创建函数返回一个action
    return {
        type: GET_PAYMENT_DATEIL_SAGA,
        params,
    }
};




//reducer
export const resPaymentListReducers = (params) => { 
    return {
        type: RES_PAYMENTLIST_REDUCERS,
        params,
    }
};

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}
// export const updateSearchParams = (params) => {
//     return {
//         type: UPDATE_SEARCH_PARAMS,
//         params,
//     }
// }

