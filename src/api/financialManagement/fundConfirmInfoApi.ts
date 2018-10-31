
import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';
import { message } from 'antd';
const GET_ORDER_INFO = `${DOMAIN_OXT}/api/crm/background/financeset/financedetail`;
const GET_ORDER_LIST_API = `${DOMAIN_OXT}/apiv2_/finance/finance/cbs/list`;
const CONFIRM_ORDER_SEARCH = `${DOMAIN_OXT}/php/v1/order/order/search`;
const CONFIRM_ORDER = `${DOMAIN_OXT}/apiv2_/finance/finance/order/orderSuccess`;
const REJECT_ORDER = `${DOMAIN_OXT}/apiv2_/finance/finance/order/rejectOrder`;

export function getOrderInfoAPI(data) {
    return fetchFn(GET_ORDER_INFO, data).then(data => data);
}

export const getOrderTableAPI = (listParam) => {
    return fetchFn(GET_ORDER_LIST_API, listParam).then(data => data);
};

export const confirmOrderSearch = (params) => {
    return fetchFn(CONFIRM_ORDER_SEARCH, params).then(data => data);
}

export const confirmOrder = (params) => {
    return fetchFn(CONFIRM_ORDER, params).then(data => data);
}

export const rejectOrder = (params) => {
    return fetchFn(REJECT_ORDER, params).then(data => data);
}