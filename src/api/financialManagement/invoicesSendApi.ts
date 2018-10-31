import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const INVOICES_SEND_LIST_API = `${DOMAIN_OXT}/apiv2_/order/invoice/search`;
const  INVOICES_EXPORTDATACOUNT_API= `${DOMAIN_OXT}/apiv2_//order/invoice/exportdatacount`


export const invoicesSendListApi = (data) => {
    return fetchFn(INVOICES_SEND_LIST_API, {...data,examineStatus:'2,4'}).then(data => data);
}
export const invoicesExportdatacountApi = (data) => {
    return fetchFn(INVOICES_EXPORTDATACOUNT_API, data).then(data => data);
}

