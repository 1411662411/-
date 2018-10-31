/**查询政策包列表 get */
export const SINGLEACCOUNT_LIST_SAGA = 'businessComponents/policyPackage/SINGLEACCOUNT_LIST_SAGA';
/** 查询政策包列表 set */
export const SINGLEACCOUNT_LIST_REDUCERS = 'SINGLEACCOUNT_LIST_REDUCERS';
/** 查询数据字典里的客户需提供材料名称 */
export const SINGLEACCOUNT_DICTIONARY_NAME_SAGA = 'SINGLEACCOUNT_DICTIONARY_NAME_SAGA';
export const SINGLEACCOUNT_DICTIONARY_NAME_REDUCERS = 'SINGLEACCOUNT_DICTIONARY_NAME_REDUCERS';
/**政策包上下线 get */
export const SINGLEACCOUNT_UPORDOWNPOLICY_SAGA = 'businessComponents/policyPackage/SINGLEACCOUNT_UPORDOWNPOLICY_SAGA';
export const SINGLEACCOUNT_UPDATE_VETTED_SAGA = 'businessComponents/policyPackage/SINGLEACCOUNT_UPDATE_VETTED_SAGA';
/**根据政策包地区查询具体政策包id和名称 get */
export const SINGLEACCOUNT_POLICYLIST_SAGA = 'businessComponents/policyPackage/SINGLEACCOUNT_POLICYLIST_SAGA';

/** 根据政策包地区查询具体政策包id和名称 set */
export const SINGLEACCOUNT_POLICYLIST_REDUCERS = 'SINGLEACCOUNT_POLICYLIST_REDUCERS';
/** 信息详情 get */
export const SINGLEACCOUNT_DETAIL_SAGA = 'SINGLEACCOUNT_DETAIL_SAGA';

/** 信息详情 set */
export const SINGLEACCOUNT_DETAIL_REDUCERS = 'SINGLEACCOUNT_DETAIL_REDUCERS';
/**删除材料类型 */
export const SINGLEACCOUNT_DELETE_TYPE_SAGA = 'SINGLEACCOUNT_DELETE_TYPE_SAGA';
/** 提交 */
export const SINGLEACCOUNT_SUBMIT_SAGA = 'SINGLEACCOUNT_SUBMIT_SAGA';
export const SINGLEACCOUNT_SUBMIT_REDUCERS = 'SINGLEACCOUNT_SUBMIT_REDUCERS';
/** 编辑 */
export const SINGLEACCOUNT_EDIT_SAGA = 'businessComponents/policyPackage/SINGLEACCOUNT_EDIT_SAGA';
export const SINGLEACCOUNT_EDIT_REDUCERS = 'businessComponents/policyPackage/SINGLEACCOUNT_EDIT_REDUCERS';
/** 审核 */
export const SINGLEACCOUNT_AUDIT_SAGA = 'SINGLEACCOUNT_AUDIT_SAGA';
export const SINGLEACCOUNT_AUDIT_REDUCERS = 'SINGLEACCOUNT_AUDIT_REDUCERS';




/** FETCHING */
export const FETCHING = 'businessComponents/policyPackage/SINGLEACCOUNT_FETCHING';

export const SUBMITING = 'businessComponents/policyPackage/SINGLEACCOUNT_SUBMITING';
/**
 * 列表 get
 * @param params {Object} 参数
 */
export const singleaccountPolicylistSaga = (params) => ({
    type: SINGLEACCOUNT_POLICYLIST_SAGA,
    params,
})

/**
 * 列表 set
 * @param params {Object} 参数
 */
export const singleaccountPolicylistReducers = (params) => ({
    type: SINGLEACCOUNT_POLICYLIST_REDUCERS,
    params,
});
/**
 * 列表 get
 * @param params {Object} 参数
 */
export const singleaccountDictionaryNameSaga = (params) => ({
    type: SINGLEACCOUNT_DICTIONARY_NAME_SAGA,
    params,
})
export const singleaccountDictionaryNameReducers = (params) => ({
    type: SINGLEACCOUNT_DICTIONARY_NAME_REDUCERS,
    params,
});
/**
 * 列表 get
 * @param params {Object} 参数
 */
export const singleaccountListSaga = (params) => ({
    type: SINGLEACCOUNT_LIST_SAGA,
    params,
})

export const singleaccountUpordownpolicySaga = (params) => ({
    type: SINGLEACCOUNT_UPORDOWNPOLICY_SAGA,
    params,
})
export const singleaccountUpdateVettedSaga = (params) => ({
    type: SINGLEACCOUNT_UPDATE_VETTED_SAGA,
    params,
})

export const singleaccountDeleteTypeSaga = (params) => ({
    type: SINGLEACCOUNT_DELETE_TYPE_SAGA,
    params,
})

/**
 * 列表 set
 * @param params {Object} 参数
 */
export const singleaccountListReducers = (params) => ({
    type: SINGLEACCOUNT_LIST_REDUCERS,
    params,
});

/**
 * 信息详情 get
 * @param params {Object} 参数
 */
export const singleaccountDetailSaga = (params) => ({
    type: SINGLEACCOUNT_DETAIL_SAGA,
    params,
})

/**
 * 信息详情 set
 * @param params {Object} 参数
 */
export const singleaccountDetailReducers = (params) => ({
    type: SINGLEACCOUNT_DETAIL_REDUCERS,
    params,
});
/**
 * 提交 get
 * @param params {Object} 参数
 */
export const singleaccountSubmitSaga = (params) => ({
    type: SINGLEACCOUNT_SUBMIT_SAGA,
    params,
})

/**
 * 提交 set
 * @param params {Object} 参数
 */
export const singleaccountSubmitReducers = (params) => ({
    type: SINGLEACCOUNT_SUBMIT_REDUCERS,
    params,
});
/**
 * 编辑 get
 * @param params {Object} 参数
 */
export const singleaccountEditSaga = (params) => ({
    type: SINGLEACCOUNT_EDIT_SAGA,
    params,
})

/**
 * 编辑 set
 * @param params {Object} 参数
 */
export const singleaccountEditReducers = (params) => ({
    type: SINGLEACCOUNT_EDIT_REDUCERS,
    params,
});
/**
 * 审核 get
 * @param params {Object} 参数
 */
export const singleaccountAuditSaga = (params) => ({
    type: SINGLEACCOUNT_AUDIT_SAGA,
    params,
})

/**
 * 审核 set
 * @param params {Object} 参数
 */
export const singleaccountAuditReducers = (params) => ({
    type: SINGLEACCOUNT_AUDIT_REDUCERS,
    params,
});
/**
 * 加载中 
 * @param params {Object} 参数
 */
export const fetching = (params) => ({
    type: FETCHING,
    params,
});
/**
 * 提交中
 * 
 */
export const submiting = (params) => ({
    type : SUBMITING,
    params,
})









