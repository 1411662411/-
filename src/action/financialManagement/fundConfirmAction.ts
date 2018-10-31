
// 获取table数据
export const GET_TABLE_DATA_SAGA = 'FUNDCONFIRM_GET_TABLE_DATA_SAGA';
export const DATA_RECEIVED = 'FUNDCONFIRM_DATA_RECEIVED';
// 订单到款确认状态
export const ORDER_CONFIRM_STATE = 'FUNDCONFIRM_ORDER_CONFIRM_STATE';
// 订单类型
export const ORDER_TYPE = 'FUNDCONFIRM_ORDER_TYPE';
// 截止时间状态
export const DEAD_LINE_STATE = 'FUNDCONFIRM_DEAD_LINE_STATE';
// 保存当前选择时间
export const TIME_RANGE = 'FUNDCONFIRM_TIME_RANGE';
// 获取默认orderCode
export const DEFAULT_ORDER_CODE = 'FUNDCONFIRM_DEFAULT_ORDER_CODE';
// 获取当前当前页
export const GET_CURRENT_PAGE = 'FUNDCONFIRM_GET_CURRENT_PAGE';
// 设置pageSize
export const SET_DEFAULT_PAGESIZE = 'FUNDCONFIRM_SET_DEFAULT_PAGESIZE';
// 设置loading
export const SET_LOADING = 'FUNDCONFIRM_SET_LOADING';
// 获取默认公司名称
export const GET_DEFAULT_C_NAME = 'FUNDCONFIRM_GET_DEFAULT_C_NAME';
export const FETCHING = 'FUNDCONFIRM_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'FUNDCONFIRM_UPDATE_SEARCH_PARAMS';
export const UPDATE_CACHE_SEARCH_PARAMS = 'FUNDCONFIRM_UPDATE_CACHE_SEARCH_PARAMS';

export const SWITCH_CHANGE_SAGA = 'FUNDCONFIRM_SWITCH_CHANGE_SAGA';
export const SWITCH_CHANGE_SET = 'FUNDCONFIRM_SWITCH_CHANGE_SET';

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}

export const getTableData = (params) => {
    return {
        type: GET_TABLE_DATA_SAGA,
        params,
    }
}
export const updateSearchParams = (params) => {
    return {
        type: UPDATE_SEARCH_PARAMS,
        params,
    }
}

export const updateCacheSearchParams = (params, callback?) => {
    return {
        type: UPDATE_CACHE_SEARCH_PARAMS,
        params,
        callback
    }
}

export const changeOrderState = (orderState) => {
    return {
        type: ORDER_CONFIRM_STATE,
        orderState
    }
}
export const receivedTableData = (params) => {
    return {
        type: DATA_RECEIVED,
        params,
    }
}

export const changeOrderType = (orderType) => {
    return {
        type: ORDER_TYPE,
        orderType
    }
}

export const changeDeadLine = (deadLine) => {
    return {
        type: DEAD_LINE_STATE,
        deadLine
    }
}

export const setDefaultTimeRange = (momentArr) => {
    return {
        type: TIME_RANGE,
        momentArr
    }
}

export const setDefaultOrderCode = (defaultOrderCode) => {
    return {
        type: DEFAULT_ORDER_CODE,
        defaultOrderCode
    }
}

export const setCurrentPage = (current) => {
    return {
        type: GET_CURRENT_PAGE,
        current
    }
}

export const setLoading = (loading) => {
    return {
        type: SET_LOADING,
        loading
    }
}

export const setDefaultCompanyName = (defaultCompanyName) => {
    return {
        type: GET_DEFAULT_C_NAME,
        defaultCompanyName
    }
}

export const setDefaultPageSize = (pageSize) => {
    return {
        type: SET_DEFAULT_PAGESIZE,
        pageSize
    }
}

/**
 * switch change get
 * @param params {Object} 参数
 */
export const switchChangeGet = (params) => ({
    type: SWITCH_CHANGE_SAGA,
    params,
})

/**
 * switch change set
 * @param params {Object} 参数
 */
export const switchChangeSet = (params) => ({
    type: SWITCH_CHANGE_SET,
    params,
})