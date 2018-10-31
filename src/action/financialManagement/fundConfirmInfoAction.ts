
// 获取orderInfo
export const GET_ORDER_INFO = 'FUND_CONFIRM_INFO_GET_ORDER_INFO';
export const GET_ORDER_INFO_SAGA = 'FUND_CONFIRM_INFO_GET_ORDER_INFO_SAGA';
export const CONFIRM_INFO_ORDER_TABLE_SAGA = 'FUND_CONFIRM_INFO_ORDER_TABLE_SAGA';
export const CONFIRM_INFO_ORDER_TABLE_ACTION = 'FUND_CONFIRM_INFO_ORDER_TABLE_ACTION';
// 当前点击页
export const CONFIRM_INFO_ORDER_CURRENT = 'FUND_CONFIRM_INFO_ORDER_CURRENT';
export const IS_FETCHING = 'FUND_CONFIRM_INFO_IS_FETCHING';
export const HIDE_MODAL = 'FUND_CONFIRM_INFO_HIDE_MODAL';

/**
 * 确认到款
 */
export const CONFIRM_ORDER_SEARCH_SAGA = 'FUND_CONFIRM_INFO_CONFIRM_ORDER_SEARCH_SAGA';
export const CONFIRM_ORDER_SEARCH_DATA_RECEIVED = 'FUND_CONFIRM_INFO_CONFIRM_ORDER_SEARCH_DATA_RECEIVED';
export const CONFIRM_ORDER_SAGA  = 'FUND_CONFIRM_INFO_CONFIRM_ORDER_SAGA';
export const CONFIRM_ORDER_DATA_RECEIVED = 'FUND_CONFIRM_INFO_CONFIRM_ORDER_DATA_RECEIVED';

/**
 * 驳回
 */
export const REJECT_ORDER = 'FUND_CONFIRM_INFO_REJECT_ORDER';
export const REJECT_ORDER_SAGA = 'FUND_CONFIRM_INFO_REJECT_ORDER_SAGA';
export const REJECT_ORDER_DATA_RECEIVED = 'FUND_CONFIRM_INFO_REJECT_ORDER_DATA_RECEIVED';

export function getOrderInfoAction(data) {
    return {
        type: GET_ORDER_INFO,
        data
    }
}

export function getOrderInfoSaga(param) {
    return {
        type: GET_ORDER_INFO_SAGA,
        param
    }
}

export const getOrderTableSaga = (param) => {
    return {
        type: CONFIRM_INFO_ORDER_TABLE_SAGA,
        param
    }
};

export const getOrderTableAction = (data, pages) => {
    return {
        type: CONFIRM_INFO_ORDER_TABLE_ACTION,
        data,
        pages
    }
};

export const confirmOrderSearch = (params) => {
    return {
        type: CONFIRM_ORDER_SEARCH_SAGA,
        params,
    }
}

export const confirmOrderSearchDataReceived = (params) => {
    return {
        type: CONFIRM_ORDER_SEARCH_DATA_RECEIVED,
        params,
    }
}

export const isFetching = (params) => {
    return {
        type: IS_FETCHING,
        params,
    }
}

export const hideModal = (params) => {
    return {
        type: HIDE_MODAL,
        params,
    }
}

export const confirmOrderSaga = (params) => {
    return {
        type: CONFIRM_ORDER_SAGA,
        params,
    }
}

export const confirmOrderDataReceived = (params) => {
    return {
        type: CONFIRM_ORDER_DATA_RECEIVED,
        params,
    }
}

export const rejectOrder = (params) => {
    return {
        type: REJECT_ORDER,
        params,
    }
}


export const rejectOrderSaga = (params) => {
    return {
        type: REJECT_ORDER_SAGA,
        params,
    }
}


export const rejectOrderDataReceived = (params) => {
    return {
        type: REJECT_ORDER_DATA_RECEIVED,
        params,
    }
}