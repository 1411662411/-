import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const RES_PYYMENTLIST_API = `${DOMAIN_OXT}/apiv2_/newpleasepay/jyPaymentInfo/getPaymentList`;
const START_MERGE_PAYMENT_API = `${DOMAIN_OXT}/apiv2_/newpleasepay/jyPaymentInfo/startMergePayment`;
const GET_PAYMENT_DATEIL_API = `${DOMAIN_OXT}/apiv2_/newpleasepay/jyPaymentInfo/getPaymentDetail`;



export const resPaymentListApi = (data) => {
    return fetchFn(RES_PYYMENTLIST_API, data).then((data) => {
        return data;
    });
}

export const startMergePaymentApi = (data) => {
    return fetchFn(START_MERGE_PAYMENT_API, data).then((data) => {
        return data;
    });
}

export const getPaymentDetailApi = (data) => {
    return fetchFn(GET_PAYMENT_DATEIL_API, data).then((data) => {
        return data;
    });
}


