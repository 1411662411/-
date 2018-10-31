import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';
// 黑名单列表
const BLACKLIST_API = `${DOMAIN_OXT}/apiv2_/social/usersocial/black-list`;
// 黑名单编辑
const BLACKLIST_EDIT_API = `${DOMAIN_OXT}/apiv2_/social/usersocial/black-add-editor`;


export const blacklistApi = (data) => {
    return fetchFn(BLACKLIST_API, data).then(data => data);
}
export const blacklistEditApi = (data) => {
    return fetchFn(BLACKLIST_EDIT_API, data).then(data => data);
}