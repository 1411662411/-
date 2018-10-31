export const SOCIAL_ORDER_DETAIL_SAGA = 'SOCIAL_ORDER_DETAIL_SAGA';
export const SOCIAL_ORDER_DETAIL_REDUCERS = 'SOCIAL_ORDER_DETAIL_REDUCERS';

export const FETCHING = 'SOCIAL_ORDER_DETAIL_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'SOCIAL_ORDER_DETAIL_UPDATE_SEARCH_PARAMS';
export const UPDATE_ORDER_REMARK_SAGA = 'SOCIAL_ORDER_UPDATE_ORDER_REMARK_SAGA';

export const socialOrderDetailSaga = (params) => {
    return {
        type: SOCIAL_ORDER_DETAIL_SAGA,
        params,
    }
};
export const socialOrderDetailReducers = (params) => {
    return {
        type: SOCIAL_ORDER_DETAIL_REDUCERS,
        params,
    }
};
export const updateOrderRemarkSaga = (params) => {
    return {
        type: UPDATE_ORDER_REMARK_SAGA,
        params,
    }
};


export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


