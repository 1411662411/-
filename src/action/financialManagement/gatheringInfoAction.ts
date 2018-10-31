export const GATHERING_INFO_ENTRY_SAGA = 'GATHERING_INFO_ENTRY_SAGA';
export const ISFETCHING = 'GATHERING_INFO_ISFETCHING';
export const DATA_RECEIVED = 'GATHERING_INFO_DATA_RECEIVED';
export const UPLOADING = 'GATHERING_INFO_UPLOADING';



export const isFetching = (params) => {
    return {
        type: ISFETCHING,
        params,
    }
}

export const gatheringInfoEntry = (params) => {
    return {
        type: GATHERING_INFO_ENTRY_SAGA,
        params,
    }
}

export const gatheringInfoReceived = (params) => {
    return {
        type: DATA_RECEIVED,
        params,
    }
}

export const uploading = (params) => {
    return {
        type: UPLOADING,
        params,
    }
}