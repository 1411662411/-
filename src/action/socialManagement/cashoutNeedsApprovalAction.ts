export const CASHOUT_NEEDS_APPROVAL_SAGA = 'CASHOUT_NEEDS_APPROVAL_SAGA';
export const CASHOUT_NEEDS_APPROVAL_DATA = 'CASHOUT_NEEDS_APPROVAL_DATA';
export const CASHOUT_SUBMITTER_DATA = 'CASHOUT_SUBMITTER_DATA';
export const APPROVAL_HANDLER_DATA = 'APPROVAL_HANDLER_DATA';
export const CASHOUT_SELECTED_ROW_DATA = 'CASHOUT_SELECTED_ROW_DATA';
export const CASHOUT_BATCH_EXPORT_PAYMENT_SAGA = 'BATCH_EXPORT_PAYMENT_SAGA';
export const CASHOUT_BATCH_EXPORT_PAYMENT_DATA = 'BATCH_EXPORT_PAYMENT_DATA';
export const CASHOUT_MASTER_APPROVE_SAGA = 'CASHOUT_MASTER_APPROVE_SAGA';
export const CASHOUT_MASTER_APPROVE_DATA = 'CASHOUT_MASTER_APPROVE_DATA';
export const USER_BY_ORGANIZATIONS_SAGA = 'USER_BY_ORGANIZATIONS_SAGA';
export const USER_BY_ORGANIZATIONS_DATA = 'USER_BY_ORGANIZATIONS_DATA';
export const USER_MAP_SAGA = 'CASHOUT_USER_MAP_SAGA';
export const USER_MAP_DATA = 'CASHOUT_USER_MAP_DATA';

export const FETCHING = 'FUNDCONFIRM_FETCHING';
export const UPDATE_SEARCH_PARAMS = 'FUNDCONFIRM_UPDATE_SEARCH_PARAMS';
export const UPDATE_CACHE_SEARCH_PARAMS = 'FUNDCONFIRM_UPDATE_CACHE_SEARCH_PARAMS';

/**审批列表 */
export const cashoutNeedsApprovalSaga = (params) => {
    return {
        type: CASHOUT_NEEDS_APPROVAL_SAGA,
        params,
    }
};
export const cashoutNeedsApprovalData = (params) => {
    return {
        type: CASHOUT_NEEDS_APPROVAL_DATA,
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

/**请款提交人 */
export const cashoutSubmitterData = (params) => {
    return {
        type: CASHOUT_SUBMITTER_DATA,
        params,
    }
};
/**审批经手人 */
export const approvalHandlerData = (params) => {
    return {
        type: APPROVAL_HANDLER_DATA,
        params,
    }
};
/**审批选中列 */
export const cashoutSelectedRowData = (params) => {
    return {
        type:CASHOUT_SELECTED_ROW_DATA,
        params,
    }
}
export const batchExportPaymentSaga = (params) => {
    return {
        type:CASHOUT_BATCH_EXPORT_PAYMENT_SAGA,
        params,
    }
}
export const batchExportPaymentData = (params) => {
    return {
        type:CASHOUT_BATCH_EXPORT_PAYMENT_DATA,
        params,
    }
}
export const masterApproveSaga = (params) => {
    return {
        type:CASHOUT_MASTER_APPROVE_SAGA,
        params,
    }
}
export const masterApproveData = (params) => {
    return {
        type:CASHOUT_MASTER_APPROVE_DATA,
        params,
    }
}
    

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