export const DUODUO_ORDER_DETAIL_DIS = 'DUODUO_ORDER_DETAIL_DIS';
export const DUODUO_ORDER_DETAIL_SAGA = 'DUODUO_ORDER_DETAIL_SAGA';

export const DUODUO_LIST_DETAIL_DIS = 'DUODUO_LIST_DETAIL_DIS';
export const DUODUO_LIST_DETAIL_SAGA = 'DUODUO_LIST_DETAIL_SAGA';

export const DUODUO_EXPORT_DETAIL_DIS = 'DUODUO_EXPORT_DETAIL_DIS';
export const DUODUO_EXPORT_DETAIL_SAGA = 'DUODUO_EXPORT_DETAIL_SAGA';

export const DUODUO_UPLOAD_DETAIL_DIS = 'DUODUO_UPLOAD_DETAIL_DIS';
export const DUODUO_UPLOAD_DETAIL_SAGA = 'DUODUO_UPLOAD_DETAIL_SAGA';

export const DUODUO_UPLOAD_STATUS_DIS = 'DUODUO_UPLOAD_STATUS_DIS';
export const DUODUO_UPLOAD_STATUS_SAGA = 'DUODUO_UPLOAD_STATUS_SAGA';

export const duoduoUploadStatusDis = (params) => {
    return {
        type: DUODUO_UPLOAD_STATUS_DIS,
        params,
    }
}
export const duoduoUploadStatusSaga = (params) => {
    return {
        type: DUODUO_UPLOAD_STATUS_SAGA,
        params,
    }
}

export const duoduoUploadDetailDis = (params,calback?) => {
    return {
        type: DUODUO_UPLOAD_DETAIL_DIS,
        params,
        calback
    }
}
export const duoduoUploadDetailSaga = (params) => {
    return {
        type: DUODUO_UPLOAD_DETAIL_SAGA,
        params,
    }
}

export const duoduoExportDetailDis = (params) => {
    return {
        type: DUODUO_EXPORT_DETAIL_DIS,
        params,
    }
}
export const duoduoExportDetailSaga = (params) => {
    return {
        type: DUODUO_EXPORT_DETAIL_SAGA,
        params,
    }
}

export const duoduoListDetailDis = (params) => {
    return {
        type: DUODUO_LIST_DETAIL_DIS,
        params,
    }
}
export const duoduoListDetailSaga = (params) => {
    return {
        type: DUODUO_LIST_DETAIL_SAGA,
        params,
    }
}

export const duoduoOrderDetailDis = (params) => {
    return {
        type: DUODUO_ORDER_DETAIL_DIS,
        params,
    }
}
export const duoduoOrderDetailSaga = (params) => {
    return {
        type: DUODUO_ORDER_DETAIL_SAGA,
        params,
    }
}