import {
    DOMAIN_OXT,
} from '../../global/global';
import { fetchFn } from '../../util/fetch';
import * as _ from 'lodash';

const GET_BRANCH_LIST_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/getBranchList`;
const UPDA_TEBRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/updateBranch`;
const ADD_BRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/addBranch`;
const DEL_BRANCH_API = `${DOMAIN_OXT}/apiv2_/permission/v1/branchoffice/del`;




const parseData = ({ currentPage, pageSize, branchName }) => {
    if(currentPage !== undefined && pageSize !== undefined) {
        return {
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
            branchName: branchName,
        }
    }
    return { };
}





/**
 * 分公司信息列表接口
 */
const tableParams = {
    start: 0,
    length: 20,
}
export const getBranchList = (data) => {
    data = _.assign(tableParams, parseData(data));
    return fetchFn(GET_BRANCH_LIST_API, data).then(data => data);
}


export const updateData = (data) => {
     
    return fetchFn(UPDA_TEBRANCH_API, data).then(data => data);
}

export const addBranch = (data) => {
    return fetchFn(ADD_BRANCH_API, data).then(data => data);
}
export const delBranch = (data) => {
    return fetchFn(DEL_BRANCH_API, data).then(data => data);
}