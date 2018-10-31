import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';
// 订单信息接口
const ORDER_DETAIL_API = `${DOMAIN_OXT}/apiv2_/order/order/search`;
// 发票信息接口
const INVOICE_DETAIL_API = `${DOMAIN_OXT}/apiv2_/order/invoice/detail`;
// 快递信息接口
const INVOICEEXPRESS_DETAIL_API = `${DOMAIN_OXT}/apiv2_/finance/order/invoiceExpress/list`;
// 参保详情接口
const SOCIAL_ORDER_DETAIL_API = `${DOMAIN_OXT}/apiv2_/social/list/details`;
// 更新备注
const UPDATE_ORDER_REMARK_API = `${DOMAIN_OXT}/apiv2_/order/sp/order/update-order-remark`
// 多多订单详情接口
const DUODUO_ORDER_DETAIL_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/wages/query/detail`;


export const orderDetailApi = (data) => {
    return fetchFn(ORDER_DETAIL_API, data).then(data => data);
}
export const invoiceDetailApi = (data) => {
    return fetchFn(INVOICE_DETAIL_API, data).then(data => data);
}
export const invoiceExpressDetailApi = (data) => {
    return fetchFn(INVOICEEXPRESS_DETAIL_API, data).then(data => data);
}
export const updateOrderRemarkApi = (data) => {
    return fetchFn(UPDATE_ORDER_REMARK_API, data).then(data => data);
}
export const socialOrderDetailApi = (data) => {
    const {
        orderType 
    } = data;
    if(orderType === 6){
        // 多多查询参数是code 
        return fetchFn(DUODUO_ORDER_DETAIL_API, {code:data.orderCode}).then(data => data);
    }else{
        return fetchFn(SOCIAL_ORDER_DETAIL_API, data).then(data => data);
    }
    
}



