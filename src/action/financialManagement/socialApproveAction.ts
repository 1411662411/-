export const SOCIAL_APPROVE_SAGA = 'SOCIAL_APPROVE_SAGA';
export const DATA_RECEIVED = 'SOCIAL_APPROVE_DATA_RECEIVED';
export const ISFETCHING = 'GATHERING_INFO_ISFETCHING';


export const socialApprove = (params) => {
    return {
        type: SOCIAL_APPROVE_SAGA,
        params,
    };
}

export const socialApproveReceived = (params) => {
    return {
        type: DATA_RECEIVED,
        params,
    }
}

export const isFetching = (params) => {
    return {
        type: ISFETCHING,
        params,
    }
}