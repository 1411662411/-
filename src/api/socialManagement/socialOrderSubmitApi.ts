import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const SOCIAL_ORDER_BILL_API = `${DOMAIN_OXT}/apiv2_/social/sp-bill/find-detail-sp`;
const SOCIAL_ORDER_BILL_DUODUO_API = `${DOMAIN_OXT}/apiv2_/duoduo/v1/duoduo/import/cache`;
const SOCIAL_ORDER_SUBMIT_API = `${DOMAIN_OXT}/api/sp/create`;
const SOCIAL_ORDER_SUBMIT_DUODUO_API = `${DOMAIN_OXT}/api/duoduo/create`;


export const socialOrderBillApi = (data) => {
    const {
        type 
    } = data;
    if(type === 5){
        return fetchFn(SOCIAL_ORDER_BILL_API, data).then(data => data);
    }
    if(type === 6){
        return fetchFn(SOCIAL_ORDER_BILL_DUODUO_API, data).then(data => data);
    }
}
export const socialOrderSubmitApi = (data) => {
    const {
        type 
    } = data;
    if(type === 5){
        return fetchFn(SOCIAL_ORDER_SUBMIT_API, data).then(data => data);
    }
    if(type === 6){
        return fetchFn(SOCIAL_ORDER_SUBMIT_DUODUO_API, data).then(data => data);
    }
    
}

