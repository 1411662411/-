import { DOMAIN_OXT } from '../../global/global';

import * as _ from 'lodash';
import { fetchFn } from '../../util/fetch';
/**
 * 政策包查询
 */
export const POLICY_SEARCH_LIST = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/list`;
export const POLICY_SEARCH_SEARCH = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policy/updateinsured`;
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
export const getPolicyListFetch = (data) => {
    return fetchFn(POLICY_SEARCH_LIST, parseData(data)).then(data => data);
}

export const getPolicyListSearch = (data) =>{
    return fetchFn(POLICY_SEARCH_SEARCH, data).then(data => data);
}