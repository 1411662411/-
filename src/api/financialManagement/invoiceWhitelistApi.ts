import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';
// 白名单列表
const INVOICEWHITELIST_API = `${DOMAIN_OXT}/apiv2_/order/invoice/white/find-list`;
// 白名单编辑
const INVOICEWHITELIST_EDIT_API = `${DOMAIN_OXT}/apiv2_/order/invoice/white/save`;
const INVOICEWHITELIST_DELETE_API = `${DOMAIN_OXT}/apiv2_/order/invoice/white/delete`;


export const invoiceWhitelistApi = (data) => {
    return fetchFn(INVOICEWHITELIST_API, data).then(data => data);
}
export const invoiceWhitelistEditApi = (data) => {
    return fetchFn(INVOICEWHITELIST_EDIT_API, data).then(data => data);
}
export const invoiceWhitelistDeleteApi = (data) => {
    return fetchFn(INVOICEWHITELIST_DELETE_API, data).then(data => data);
}