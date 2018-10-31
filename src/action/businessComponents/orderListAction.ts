export const ORDER_LIST_SAGA = 'ORDER_LIST_SAGA';
export const ORDER_LIST_REDUCERS = 'ORDER_LIST_REDUCERS';

export const ORDER_DISMISSREASON_SAGA = 'ORDER_DISMISSREASON_SAGA';
export const ORDER_DISMISSREASON_REDUCERS = 'ORDER_DISMISSREASON_REDUCERS';

export const ORDER_REPEAL_SAGA = 'ORDER_REPEAL_SAGA';
export const ORDER_REPEAL_REDUCERS = 'ORDER_REPEAL_REDUCERS';

export const FETCHING = 'ORDER_LIST_FETCHING';

export const orderListSaga = (params) => {
    return {
        type: ORDER_LIST_SAGA,
        params,
    }
};
export const orderListReducers = (params) => {
    return {
        type: ORDER_LIST_REDUCERS,
        params,
    }
};
export const orderDismissreasonSaga = (params) => {
    return {
        type: ORDER_DISMISSREASON_SAGA,
        params,
    }
};
export const orderDismissreasonReducers = (params) => {
    return {
        type: ORDER_DISMISSREASON_REDUCERS,
        params,
    }
};
export const orderRepealSaga = (params) => {
    return {
        type: ORDER_REPEAL_SAGA,
        params,
    }
};
export const orderRepealReducers = (params) => {
    return {
        type: ORDER_REPEAL_REDUCERS,
        params,
    }
};


export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


