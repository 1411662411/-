import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';

//代发工资订单详情
const DUODUO_ORDER_DETAIL_API = `${DOMAIN_OXT}/api/crm/background/financeset/financedetail`;
const DUODUO_LIST_DETAIL_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/wages/query/detail`;
const DUODUO_EXPORT_DETAIL_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/wages/query/download`;
const DUODUO_UPLOAD_DETAIL_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/order/rejectAtt`;

const DUODUO_UPDATE_DETAIL_API = `${DOMAIN_OXT}/apiv2_/order/duo-duo-order/update-status`;

export const orderUpdateDetailApi = (data) => {
    return fetchFn(DUODUO_UPDATE_DETAIL_API, data).then(data => data);
}

export const orderDetailApi = (data) => {
    return fetchFn(DUODUO_ORDER_DETAIL_API, data).then(data => data);
}
export const orderListDetailApi = (data) => {
    return fetchFn(DUODUO_LIST_DETAIL_API, data).then(data => data);
}

export const orderExportDetailApi = (data) => {
    return fetchFn(DUODUO_EXPORT_DETAIL_API, data).then(data => data);
}
export const orderUploadDetailApi = (data) => {
    return fetchFn(DUODUO_UPLOAD_DETAIL_API, data).then(data => data);
}