export const OUTPUT_ACCOUNTANT_SAGA = 'OUTPUT_ACCOUNTANT_SAGA';
export const DATA_RECEIVED = 'OUTPUT_ACCOUNTANT_DATA_RECEIVED';
export const ISFETCHING = 'OUTPUT_ACCOUNTANT_ISFETCHING';
export const UPDATE_SEARCH_PARAMS = 'OUTPUT_ACCOUNTANT_UPDATE_SEARCH_PARAMS';
export const OUT_PUT_RECORD_SAGA = 'OUTPUT_ACCOUNTANT_OUT_PUT_RECORD_SAGA';
export const OUT_PUT_RECEIVED = 'OUTPUT_ACCOUNTANT_OUT_PUT_RECEIVED';
export const UPDATA_PROGRESS = 'OUTPUT_ACCOUNTANT_UPDATA_PROGRESS';
export const TAB_PANE_CHANGE = 'OUTPUT_ACCOUNTANT_TAB_PANE_CHANGE';


export const outputAccountant = (params) => {
    return {
        type: OUTPUT_ACCOUNTANT_SAGA,
        params,
    };
}

export const outputAccountantReceived = (params) => {
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

export const updateSearchParams = (params) => {
    return {
        type: UPDATE_SEARCH_PARAMS,
        params,
    }
}

export const outPutRecord = (params) => {
    return {
        type: OUT_PUT_RECORD_SAGA,
        params,
    }
}

export const outPutRecordReceived = (params) => {
    return {
        type: OUT_PUT_RECEIVED,
        params,
    }
}

export const updataProgress = (params) => {
    return {
        type: UPDATA_PROGRESS,
        params,
    }
}

export const tabPaneChange = (params) => {
    return {
        type: TAB_PANE_CHANGE,
        params,
    }
}