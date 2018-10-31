import { DOMAIN_OXT } from '../../global/global';

import * as _ from 'lodash';
import { fetchFn } from '../../util/fetch';

export const SINGLE_INFO_LIST = `${DOMAIN_OXT}/apiv2_/policy/singletonSocialInfo/getSocialAccountDetail`;//列表
export const SINGLE_INFO_EDITOR = `${DOMAIN_OXT}/apiv2_/policy/singletonSocialInfo/updateCompanyInfo`;//编辑

export const getSingleInfoListFetch = (data) => {
    return fetchFn(SINGLE_INFO_LIST, data).then(data => data);
}

export const getSingleInfoEditor= (data) => {
    return fetchFn(SINGLE_INFO_EDITOR, data).then(data => data);
}