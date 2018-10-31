import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const IMPORT_BILL_SP_DETAIL_API = `${DOMAIN_OXT}/apiv2_/social/sp-bill/find-first-company-contact`;
const IMPORT_BILL_SP_SUBMIT_API = `${DOMAIN_OXT}/apiv2_/social/sp-bill/submit-confirm`;
const IMPORT_BILL_SP_SUBMIT_DUODUO_API = `${DOMAIN_OXT}/api/duoduo/submit-confirm`;
const COPYINVOICEFROMSP_API = `${DOMAIN_OXT}/apiv2_/order/invoice/copyinvoicefromsp `;
const GETUSERLISTBYORGNAME = `${DOMAIN_OXT}/api/duoduo/getUserListByOrgName`


export const importBillSpDetailApi = (data) => {
    return fetchFn(IMPORT_BILL_SP_DETAIL_API, data).then(data => data);
}
export const importBillSpSubmitApi = (data) => {
    const {
        type 
    } = data;
    if(type === 5){
        return fetchFn(IMPORT_BILL_SP_SUBMIT_API, data).then(data => data);
    }
    if(type === 6){
        return fetchFn(IMPORT_BILL_SP_SUBMIT_DUODUO_API, data).then(data => data);
    }
}

export const copyinvoicefromspApi = (data) => {
    return fetchFn(COPYINVOICEFROMSP_API, data).then(data => data);
}
export const getUserListByOrgNameApi = (data) => {
    return fetchFn(GETUSERLISTBYORGNAME, data).then(data => data);
}


