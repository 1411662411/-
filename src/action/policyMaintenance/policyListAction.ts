export const GET_POLICY_LIST_SAGA = 'GET_POLICY_LIST_SAGA'; // 获取 政策包管理材料列表 table 数据
export const RECEIVE_POLICY_LIST_SAGA = 'RECEIVE_POLICY_LIST_SAGA'; // 获取 政策包管理材料列表 table 数据
export const DISPATCH_POLICY_SAGA = 'DISPATCH_POLICY_SAGA'
export const RESET_INFO_SEARCH_DISPATCH = 'RESET_INFO_SEARCH_DISPATCH'
export const RESET_INFO_SEARCH_SAGA = 'RESET_INFO_SEARCH_SAGA'
export const RESET_INFO_SEARCH_REDUCER = 'RESET_INFO_SEARCH_REDUCER';
export const DISPATCH_POLICY_SAGA_FETCHING = 'policyMaintenance/policyListAction/DISPATCH_POLICY_SAGA_FETCHING'


export const getPolicyMenergeDispatch = (params) => {
    return {
        type: RESET_INFO_SEARCH_DISPATCH,
        params
    }
}

export const getPolicyMenergeSaga = (params) => {
    return {
        type: RESET_INFO_SEARCH_SAGA,
        params
    }
}
export const getPolicyMenergeReducer = (params) => {
    return {
        type: RESET_INFO_SEARCH_REDUCER,
        params
    }
}

/**
 * search fetching
 */
export const getPolicyFetching = (params) => {
    return {
        type: DISPATCH_POLICY_SAGA_FETCHING,
        params
    }
}




export const getPolicyMenergeList = (params) => {
    return {
        type: GET_POLICY_LIST_SAGA,
        params
    }
}
export const RecievedPolicyMenergeList = (params) => {
    return {
        type: RECEIVE_POLICY_LIST_SAGA,
        params
    }
}
export const dispatchPolicyMenergeList = (params) => {
    return {
        type: DISPATCH_POLICY_SAGA,
        params
    }
}