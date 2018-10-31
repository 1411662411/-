export const DATA_SEARCH = 'CUSTOMER_CODE_SYNC_SEARCH';
export const DATA_RECEIVED = 'CUSTOMER_CODE_SYNC_DATA_RECEIVED';
export const ISFETCHING = 'CUSTOMER_CODE_SYNC_ISFETCHING';
export const SEND_DATA_CONFIRM = 'CUSTOMER_CODE_SYNC_SEND_DATA_CONFIRM'
export const RECEIVE_DATA_CONFIRM = 'CUSTOMER_CODE_SYNC_RECEIVE_DATA_CONFIRM'
export const UPDATE_ID = 'CUSTOMER_CODE_SYNC_UPDATE_ID'
export const UPDATE_IDS = 'CUSTOMER_CODE_SYNC_UPDATE_IDS'

interface action {
    (params): {
        type: string;
        params: any;
    }
}
/**
 * 请求table数据
 * @param params {Object} 参数 
 */
export const getSearchData:action = (params) => {
    return {
        type: DATA_SEARCH,
        params,
    }
};

/**
 * 接受table数据
 * @param params {Object} 参数
 */
export const dataReceived:action = (params) => {
    return {
        type: DATA_RECEIVED,
        params,
    }
}

/**
 * 是否请求中
 * @param params {Object} 参数
 */
export const isFetching:action = (params) => {
    return {
        type: ISFETCHING,
        params,
    }
}

//发送确认
export const sendDataConfirm:action = (params) => {
    return {
        type: SEND_DATA_CONFIRM,
        params
    }
}

//接收确认
export const receiveDataConfirm:action = (params) => {
    return {
        type: RECEIVE_DATA_CONFIRM,
        params
    }
}

//更新id
export const updateId: action = (params) => {
    return {
        type: UPDATE_ID,
        params
    }
}

//更新ids
export const updateIds: action = (params) => {
    return {
        type: UPDATE_IDS,
        params
    }
}


