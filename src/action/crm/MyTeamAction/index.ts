export const CRM_MY_TEAM_GET_DATA = 'CRM_MY_TEAM_GET_DATA';
export const CRM_MY_TEAM_SET_DATA = 'CRM_MY_TEAM_SET_DATA';
export const CRM_MY_TEAM_ISFETCHING = 'CRM_MY_TEAM_ISFETCHING';

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
        type: CRM_MY_TEAM_GET_DATA,
        params,
    }
};

/**
 * 接受table数据
 * @param params {Object} 参数
 */
export const dataReceived:action = (params) => {
    return {
        type: CRM_MY_TEAM_SET_DATA,
        params,
    }
}

/**
 * 是否请求中
 * @param params {Object} 参数
 */
export const isFetching:action = (params) => {
    return {
        type: CRM_MY_TEAM_ISFETCHING,
        params,
    }
}