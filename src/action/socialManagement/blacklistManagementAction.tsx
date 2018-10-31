export const BLACKLISTMANAGEMENT_SAGA = 'BLACKLISTMANAGEMENT_SAGA';
export const BLACKLISTMANAGEMENT_REDUCERS = 'BLACKLISTMANAGEMENT_REDUCERS';

export const BLACKLISTMANAGEMENT_EDIT_SAGA = 'BLACKLISTMANAGEMENT_EDIT_SAGA';
export const BLACKLISTMANAGEMENT_EDIT_REDUCERS = 'BLACKLISTMANAGEMENT_EDIT_REDUCERS';



export const FETCHING = 'BLACKLISTMANAGEMENT__FETCHING';

export const blacklistSaga = (params) => {
    return {
        type: BLACKLISTMANAGEMENT_SAGA,
        params,
    }
};
export const blacklistReducers = (params) => {
    return {
        type: BLACKLISTMANAGEMENT_REDUCERS,
        params,
    }
};
export const blacklistEditSaga = (params) => {
    return {
        type: BLACKLISTMANAGEMENT_EDIT_SAGA,
        params,
    }
};
export const blacklistEditReducers = (params) => {
    return {
        type: BLACKLISTMANAGEMENT_EDIT_REDUCERS,
        params,
    }
};


export const fetching = (params) => {
    return {
        type: FETCHING,
        params,
    }
}


