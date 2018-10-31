import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';

const GETBRANCHLIST_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/getBranchList`;
const DELBRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/delBranch`;
const ADDBRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/addBranch`;
const UPDATEBRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/updateBranch`;
const PAYEESOURCE_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/sbjbjg/list`;

/**
 * 获取分公司列表
 * @param branchName 分公司名称
 * @param provinceId 省 
 * @param cityId 市 
 * @param districtId 区 
 * @param financeAgain 是否二次请款 1首次 2二次
 * @param financeType 请款类型 默认为1分公司 2社保局 3公积金
 */
export const payeeManagementApi = (data) => {
    switch (data.type) {
        case 'query': {
            return fetchFn(GETBRANCHLIST_API, data).then(data => data);
        }
        case 'del': {
            return fetchFn(DELBRANCH_API, data).then(data => data);
        }
        case 'edit': {
            return fetchFn(UPDATEBRANCH_API, data).then(data => data);
        }
        case 'save': {
            return fetchFn(ADDBRANCH_API, data).then(data => data);
        }
    }
}
/**
 * 获取分公司列表
 */
export const payeesourceApi = ()=> {
    return fetchFn(GETBRANCHLIST_API,{financeAgain:1,length:-1}).then(data => data);
    // return fetchFn(PAYEESOURCE_API,{}).then(data => data);
}