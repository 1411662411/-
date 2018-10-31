import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
//政策大全查询列表
const ALL_ENCYCLE_LIST = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaManage/list`;
//新增政策大全接口
const ALL_ENCYCLE_ADD = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaManage/add`;
//编辑政策大全接口
const ALL_ENCYCLE_EDITOR = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaManage/update`;
//逻辑删除政策大全接口
const ALL_ENCYCLE_DELETE = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaManage/logicDelete`;
//新增政策分类接口
const POLICY_ENCYCLE_ADD = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaCategory/add`;
//编辑政策分类接口
const POLICY_ENCYCLE_EDITOR = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaCategory/update`;
//逻辑删除政策分类接口
const POLICY_ENCYCLE_DELETE = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaCategory/logicDelete`;
//单级政策分类排序接口
const POLICY_ENCYCLE_SORT = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaCategory/categorySort`;
//新增政策文章接口
const ARTICLE_ENCYCLE_ADD = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaArticle/add`;
//编辑政策文章接口
const ARTICLE_ENCYCLE_EDITOR = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaArticle/update`;
//政策文章列表接口
const ARTICLE_ENCYCLE_LIST = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaArticle/list`;
//删除文章
const ARTICLE_ENCYCLE_DELETE = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaArticle/logicDelete`;
//审核政策文章接口
const ARTICLE_ENCYCLE_CHECK = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaArticle/auditArticle`;
//类目列表接口
const CATEGORY_FORM_LIST = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaCategory/categoryForm`;
//审核政策大全列表接口
const ARTICLE_ENCYCLE_CHECK_LIST = `${DOMAIN_OXT}/apiv2_/encyclopedia/api/encyclopediaManage/auditList`;


export const articleEncycleAuditList = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_CHECK_LIST, data).then(data => {
        return data
    });
}
//审核政策文章接口
export const articleEncycleAuditte = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_CHECK, data).then(data => {
        return data
    });
}


export const articleEncycleDelete = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_DELETE, data).then(data => {
        return data
    });
}


export const articleEncycleEditor = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_EDITOR, data).then(data => {
        return data
    });
}

export const articleEncycleList = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_LIST, data).then(data => {
        return data
    });
}


export const articleEncycleAdd = (data) => {
    return fetchFn(ARTICLE_ENCYCLE_ADD, data).then(data => {
        return data
    });
}

export const policyEncycleSort = (data) => {
    return fetchFn(POLICY_ENCYCLE_SORT, data).then(data => {
        return data
    });
}

export const policyEncycleDelete = (data) => {
    return fetchFn(POLICY_ENCYCLE_DELETE, data).then(data => {
        return data
    });
}


export const policyEncycleEditor = (data) => {
    return fetchFn(POLICY_ENCYCLE_EDITOR, data).then(data => {
        return data
    });
}

export const categoryFormList = (data) => {
    return fetchFn(CATEGORY_FORM_LIST, data).then(data => {
        return data
    });
}
export const policyEncycleAdd = (data) => {
    return fetchFn(POLICY_ENCYCLE_ADD, data).then(data => {
        return data
    });
}



const parseData = (data) => {

    const { currentPage, pageSize } = data;
    if (currentPage !== undefined && pageSize !== undefined) {
        return {
            ...data,
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
        }
    }
    return data;
}
export const allEncycleList = (data) => {
    return fetchFn(ALL_ENCYCLE_LIST, data).then(data => {
        return data
    });
}
export const allEncycleAdd = (data) => {
    return fetchFn(ALL_ENCYCLE_ADD, data).then(data => {
        return data
    });
}
export const allEncycleEditor = (data) => {
    return fetchFn(ALL_ENCYCLE_EDITOR, data).then(data => {
        return data
    });
}
export const allEncycleDelete = (data) => {
    return fetchFn(ALL_ENCYCLE_DELETE, data).then(data => {
        return data
    });
}