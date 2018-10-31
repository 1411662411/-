export const SOCIAL_ORDER_BILL_SAGA = 'SOCIAL_ORDER_BILL_SAGA';
export const SOCIAL_ORDER_BILL_REDUCERS = 'SOCIAL_ORDER_BILL_REDUCERS';

export const SOCIAL_ORDER_SUBMIT_SAGA = 'SOCIAL_ORDER_SUBMIT_SAGA';
export const SOCIAL_ORDER_SUBMIT_REDUCERS = 'SOCIAL_ORDER_SUBMIT_REDUCERS';

export const FETCHING = 'SOCIAL_ORDER_SUBMIT_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'SOCIAL_ORDER_SUBMIT_UPDATE_SEARCH_PARAMS';


export const socialOrderBillSaga = (params) => {
    return {
        type: SOCIAL_ORDER_BILL_SAGA,
        params,
    }
};
export const socialOrderBillReducers = (params) => {
    return {
        type: SOCIAL_ORDER_BILL_REDUCERS,
        params,
    }
};
export const socialOrderSubmitSaga = (params) => {
    return {
        type: SOCIAL_ORDER_SUBMIT_SAGA,
        params,
    }
};
export const socialOrderSubmitReducers = (params) => {
    return {
        type: SOCIAL_ORDER_SUBMIT_REDUCERS,
        params,
    }
};



export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


