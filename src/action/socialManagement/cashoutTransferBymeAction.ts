export const CASHOUT_TRANSFER_BYME_SAGA = 'CASHOUT_TRANSFER_BYME_SAGA';
export const CASHOUT_TRANSFER_BYME_REDUCERS = 'CASHOUT_TRANSFER_BYME_REDUCERS';
export const CASHOUT_REJECT_REASON_SAGA = 'CASHOUT_REJECT_REASON_SAGA';
export const CASHOUT_REJECT_REASON_REDUCERS = 'CASHOUT_REJECT_REASON_REDUCERS';
export const CASHOUT_CANCEL_SAGA = 'CASHOUT_CANCEL_SAGA';
export const CASHOUT_CANCEL_REDUCERS = 'CASHOUT_CANCEL_REDUCERS';
export const USER_BY_ORGANIZATIONS_SAGA = 'TRANSFER_USER_BY_ORGANIZATIONS_SAGA';
export const USER_BY_ORGANIZATIONS_DATA = 'TRANSFER_USER_BY_ORGANIZATIONS_DATA';
export const USER_MAP_SAGA = 'TRANSFER_USER_MAP_SAGA';
export const USER_MAP_DATA = 'TRANSFER_USER_MAP_DATA';
export const PAYENTRYINFO_SAGA ='PAYENTRYINFO_SAGA';
export const PAYENTRYINFO_REDUCERS ='PAYENTRYINFO_REDUCERS';

export const FETCHING = 'CASHOUT_TRANSFER_BYME_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'CASHOUTTRANSFER_UPDATE_SEARCH_PARAMS';
export const UPDATE_CACHE_SEARCH_PARAMS = 'CASHOUTTRANSFER_UPDATE_CACHE_SEARCH_PARAMS';

export const GET_INFO_COUNT_SAGA = 'GET_INFO_COUNT_SAGA'
/**
 * 打款图片 get
 */
export const PROVE_SAGA = `CASHOUT_TRANSFER_BYME_PROVE_SAGA`;

/**
 * 打款图片 set
 */ 
export const PROVE_DATA = `CASHOUT_TRANSFER_BYME_PROVE_DATA`;

export const COUNT_REDUCER = 'COUNT_REDUCER';
export const COUNT_SAGA = 'COUNT_SAGA';

export const countNumber = (params) =>{
    return{
       type: COUNT_SAGA,
             params,
    } 
}
export const countNumberReducers = (params) => {
    return {
        type: COUNT_REDUCER,
        params,
    }
};


export const cashoutTransferBymeSaga = (params) => {
    return {
        type: CASHOUT_TRANSFER_BYME_SAGA,
        params,
    }
};
export const cashoutTransferBymeReducers = (params) => {
    return {
        type: CASHOUT_TRANSFER_BYME_REDUCERS,
        params,
    }
};
export const cashoutRejectReasonSaga = (params) => {
    return {
        type: CASHOUT_REJECT_REASON_SAGA,
        params,
    }
};
export const cashoutRejectReasonReducers = (params) => {
    return {
        type: CASHOUT_REJECT_REASON_REDUCERS,
        params,
    }
};
export const cashoutCancelSaga = (params) => {
    return {
        type: CASHOUT_CANCEL_SAGA,
        params,
    }
};
export const cashoutCancelReducers = (params) => {
    return {
        type: CASHOUT_CANCEL_REDUCERS,
        params,
    }
};
export const userByOrganizationsSaga = (params) => {
    return {
        type: USER_BY_ORGANIZATIONS_SAGA,
        params,
    }
};
export const userByOrganizationsData = (params) => {
    return {
        type: USER_BY_ORGANIZATIONS_DATA,
        params,
    }
};
export const useMapSaga = (params) => {
    return {
        type: USER_MAP_SAGA,
        params,
    }
};
export const userMapData = (params) => {
    return {
        type: USER_MAP_DATA,
        params,
    }
};

export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}
export const updateSearchParams = (params) => {
    return {
        type: UPDATE_SEARCH_PARAMS,
        params,
    }
}

export const updateCacheSearchParams = (params) => {
    return {
        type: UPDATE_CACHE_SEARCH_PARAMS,
        params,
    }
}

export const payentryinfoSaga = (params) => ({
    type: PAYENTRYINFO_SAGA,
    params,
});

export const payentryinfoReducers = (params) => ({
    type: PAYENTRYINFO_REDUCERS,
    params,
});

/**
 * 打款证明图片 get
 * @param params {Object} 参数
 */
export const getProve = (params) => ({
    type: PROVE_SAGA,
    params,
});

export const setProve = (params) => ({
    type: PROVE_DATA,
    params,
});

