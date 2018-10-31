//政策大全查询列表

export const SPINNING_LOADING_RECIEVE = 'SPINNING_LOADING_RECIEVE'
export const spiningLoading = (params) => {
    return {
        type: SPINNING_LOADING_RECIEVE,
        params,
    }
};

export const TABLE_LOADING = 'TABLE_LOADING'
export const tableLoading = (params) => {
    return {
        type: TABLE_LOADING,
        params,
    }
};

export const SPINNING_AUDIT_LOADING_RECIEVE = 'SPINNING_AUDIT_LOADING_RECIEVE'
export const spiningAuditLoading = (params) => {
    return {
        type: SPINNING_AUDIT_LOADING_RECIEVE,
        params,
    }
};

//政策大全查询列表
export const ALL_ENCYCLE_DIS = 'ALL_ENCYCLE_DIS'
export const ALL_ENCYCLE_RECIEVE = 'ALL_ENCYCLE_RECIEVE'
export const allEncycleDis = (params) => {
   
    return {
        type: ALL_ENCYCLE_DIS,
        params,
    }
};
export const allEncycleRecieved = (params) => {
    return {
        type: ALL_ENCYCLE_RECIEVE,
        params,
    }
};

export const LOADING_ENCYCLE_RECIREV = 'LOADING_ENCYCLE_RECIREV'
export const loadingEncycle = (params) => {
    return {
        type: LOADING_ENCYCLE_RECIREV,
        params,
    }
};

//新增政策大全接口
export const ALL_ENCYCLE_ADD_DIS = 'ALL_ENCYCLE_ADD_DIS'
export const allEncycleAddDis = (params) => {
    return {
        type: ALL_ENCYCLE_ADD_DIS,
        params,
    }
};

//编辑政策大全接口
export const ALL_ENCYCLE_EDITOR_DIS = 'ALL_ENCYCLE_EDITOR_DIS'
export const ALL_ENCYCLE_EDITOR_RECIEVE = 'ALL_ENCYCLE_EDITOR_RECIEVE'
export const allEncycleEditorDis = (params,callback) => {
    return {
        type: ALL_ENCYCLE_EDITOR_DIS,
        params,
        callback
    }
};
export const allEncycleEditorRecieved = (params) => {
    return {
        type: ALL_ENCYCLE_EDITOR_RECIEVE,
        params,
    }
};
//逻辑删除政策大全接口
export const ALL_ENCYCLE_DELETE_DIS = 'ALL_ENCYCLE_DELETE_DIS'
export const ALL_ENCYCLE_DELETE_RECIEVE = 'ALL_ENCYCLE_DELETE_RECIEVE'
export const allEncycleDelteDis = (params,callback?) => {
    return {
        type: ALL_ENCYCLE_DELETE_DIS,
        params,
        callback
    }
};
export const allEncycleDelteRecieved = (params) => {
    return {
        type: ALL_ENCYCLE_DELETE_RECIEVE,
        params,
    }
};
//审核政策大全列表接口：
export const ALL_ENCYCLE_AUDITLIST_DIS = 'ALL_ENCYCLE_AUDITLIST_DIS'
export const ALL_ENCYCLE_AUDITLIST_RECIEVE = 'ALL_ENCYCLE_AUDITLIST_RECIEVE'
export const allEncycleAuditeDis = (params) => {
    return {
        type: ALL_ENCYCLE_AUDITLIST_DIS,
        params,
    }
};
export const allEncycleAuditRecieved = (params) => {
    return {
        type: ALL_ENCYCLE_AUDITLIST_RECIEVE,
        params,
    }
};
//新增政策分类接口：
export const POLICY_ENCYCLE_ADD_DIS = 'POLICY_ENCYCLE_ADD_DIS'
export const POLICY_ENCYCLE_ADD_RECIEVE = 'POLICY_ENCYCLE_ADD_RECIEVE'
export const policyEncycleAddDis = (params,callback?) => {
    return {
        type: POLICY_ENCYCLE_ADD_DIS,
        params,
        callback
    }
};
export const policyEncycleAddRecieved = (params) => {
    return {
        type: POLICY_ENCYCLE_ADD_RECIEVE,
        params,
    }
};

export const IS_CHANGE_COLOR_DIS = 'IS_CHANGE_COLOR_DIS'
export const IS_CHANGE_COLOR_RECIEVE = 'IS_CHANGE_COLOR_RECIEVE'
export const isChangeColorDis = (params,callback?)=>{
    return {
        type: IS_CHANGE_COLOR_DIS,
        params,
        callback,
    }
}
export const isChangeColorRecieved = (params) => {
    return {
        type: IS_CHANGE_COLOR_RECIEVE,
        params,
    }
};
//类目列表接口
export const CATEGORY_FORM_LIST_DIS = 'CATEGORY_FORM_LIST_DIS'
export const CATEGORY_FORM_LIST_RECIEVE = 'CATEGORY_FORM_LIST_RECIEVE'
export const categoryFormlistDis = (params,callback?) => {
    return {
        type: CATEGORY_FORM_LIST_DIS,
        params,
        callback
    }
};
export const categoryFormlistRecieved = (params) => {
    return {
        type: CATEGORY_FORM_LIST_RECIEVE,
        params,
    }
};

////编辑政策分类接口
export const PLOCIY_ENCYLE_EDITOR_DIS = 'PLOCIY_ENCYLE_EDITOR_DIS'
export const PLOCIY_ENCYLE_EDITOR_RECIEVE = 'PLOCIY_ENCYLE_EDITOR_RECIEVE'
export const poicyEncycleEditorDis = (params) => {
    return {
        type: PLOCIY_ENCYLE_EDITOR_DIS,
        params,
    }
};
export const poicyEncycleEditorRecieved = (params) => {
    return {
        type: PLOCIY_ENCYLE_EDITOR_RECIEVE,
        params,
    }
};
//逻辑删除政策分类接口
export const PLOCIY_ENCYLE_DELETE_DIS = 'PLOCIY_ENCYLE_DELETE_DIS'
export const PLOCIY_ENCYLE_DELETE_RECIEVE = 'PLOCIY_ENCYLE_DELETE_RECIEVE'
export const poicyEncycleDeleteDis = (params,callback?) => {
    return {
        type: PLOCIY_ENCYLE_DELETE_DIS,
        params,
        callback
    }
};
export const poicyEncycleDeleteRecieved = (params) => {
    return {
        type: PLOCIY_ENCYLE_DELETE_RECIEVE,
        params,
    }
};
//单级政策分类排序接口
export const PLOCIY_ENCYLE_SORT_DIS = 'PLOCIY_ENCYLE_SORT_DIS'
export const PLOCIY_ENCYLE_SORT_RECIEVE = 'PLOCIY_ENCYLE_SORT_RECIEVE'
export const poicyEncycleSortDis = (params) => {
    return {
        type: PLOCIY_ENCYLE_SORT_DIS,
        params,
    }
};
//新增政策文章接口
export const ARTICLE_ENCYLE_ADD_DIS = 'ARTICLE_ENCYLE_ADD_DIS'
export const articleEncycleAddDis = (params) => {
    return {
        type: ARTICLE_ENCYLE_ADD_DIS,
        params,
    }
};

export const ARTICLE_ENCYLE_EDITOR_DIS = 'ARTICLE_ENCYLE_EDITOR_DIS'
export const articleEncycleEditorDis = (params,callback?) => {
    return {
        type: ARTICLE_ENCYLE_EDITOR_DIS,
        params,
        callback,
    }
};

export const ARTICLE_ENCYLE_DELETE_DIS = 'ARTICLE_ENCYLE_DELETE_DIS'
export const articleEncycleDeleteDis = (params,callback) => {
    return {
        type: ARTICLE_ENCYLE_DELETE_DIS,
        params,
        callback,
    }
};

//政策文章列表接口
export const ARTICLE_ENCYLE_LIST_DIS = 'ARTICLE_ENCYLE_LIST_DIS'
export const ARTICLE_ENCYLE_LIST_RECIEVE = 'ARTICLE_ENCYLE_LIST_RECIEVE'
export const articleEncycleListDis = (params) => {
    return {
        type: ARTICLE_ENCYLE_LIST_DIS,
        params,
    }
};
export const articleEncycleListRecieved = (params) => {
    return {
        type: ARTICLE_ENCYLE_LIST_RECIEVE,
        params,
    }
};

//审核政策文章接口
export const ARTICLE_ENCYLE_AUDIT_DIS = 'ARTICLE_ENCYLE_AUDIT_DIS'
export const ARTICLE_ENCYLE_AUDIT_RECIEVE = 'ARTICLE_ENCYLE_AUDIT_RECIEVE'
export const articleEncycleAudittDis = (params) => {
    return {
        type: ARTICLE_ENCYLE_AUDIT_DIS,
        params,
    }
};
export const articleEncycleAuditRecieved = (params) => {
    return {
        type: ARTICLE_ENCYLE_AUDIT_RECIEVE,
        params,
    }
};


export const ARTICLE_ENCYLE_AUDIT_LIST_DIS = 'ARTICLE_ENCYLE_AUDIT_LIST_DIS'
export const ARTICLE_ENCYLE_AUDIT_LIST_RECIEVE = 'ARTICLE_ENCYLE_AUDIT_LIST_RECIEVE'
export const articleEncycleAuditListDis = (params) => {
    return {
        type: ARTICLE_ENCYLE_AUDIT_LIST_DIS,
        params,
    }
};
export const articleEncycleAuditListRecieved = (params) => {
    return {
        type: ARTICLE_ENCYLE_AUDIT_LIST_RECIEVE,
        params,
    }
};

export const ARTICLE_AA_DIS = 'ARTICLE_AA_DIS'
export const ARTICLE_AA_RECIEVE = 'ARTICLE_AA_RECIEVE'
export const articleAaDis = (params) => {
    return {
        type: ARTICLE_AA_DIS,
        params,
    }
};
export const articleAaRecieved = (params) => {
    return {
        type: ARTICLE_AA_DIS,
        params,
    }
};