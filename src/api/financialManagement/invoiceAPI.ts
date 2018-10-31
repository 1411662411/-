import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
import * as _ from 'lodash';
import { message } from 'antd';
const INVOICE_SEARCH_API = `${DOMAIN_OXT}/php/v1/order/orderinvoice/search`;
const INVOICE_UPDATE_API = `${DOMAIN_OXT}/php/v1/order/orderinvoice/update`;



export const invoiceSearchData = (params) => {
    const searchParam = {
        invoice_number  : params.invoiceNumber || '',
        invoice_title  : params.invoiceTitle || '',
        order_type  : params.orderType || '',
        start_time  : params.startTime || '',
        end_time  : params.endTime || '',
        invoice_status  : params.invoiceStatus || '',
        start: params.start,
        length: params.length,
    };


    return fetchFn(INVOICE_SEARCH_API, searchParam).then(data => data)
};

export const invoiceUpdate = (params) => {
    return fetchFn(INVOICE_UPDATE_API, params).then(data => data);
}
