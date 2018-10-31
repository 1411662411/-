export const ROUTER_PERMISSION_SAGA = 'ROUTER_PERMISSION_SAGA';
export const ROUTER_PERMISSION_ISFETCHING = 'ROUTER_PERMISSION_ISFETCHING';
export const ROUTER_PERMISSION_DATA_RECEIVED = 'ROUTER_PERMISSION_DATA_RECEIVED';

export const getPermission = (params) => {
    return {
        type: ROUTER_PERMISSION_SAGA,
        params,
    }
}

export const isFetching = (params) => {
    return {
        type: ROUTER_PERMISSION_ISFETCHING,
        params,
    }
}

export const routerPermissionDataReceived = (params) => {
    return {
        type: ROUTER_PERMISSION_DATA_RECEIVED,
        params,
    }
}