import {
    DOMAIN_OXT,
} from '../../global/global';
import { fetchFn } from '../../util/fetch';
import * as _ from 'lodash';

const SP_PAYMENT_DETAIL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/JsSpPayDetailOutput/list`; /* sp付款明细列表 */
const TW_PAYMENT_DETAIL_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/financePaymentInfo/getPaymentInfoList`; /* 天吴付款明细列表 */
const OUT_PUT_RECORD_API_1 = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/financePaymentInfo/export`; /* 付款明细列表导出 */
const OUT_PUT_RECORD_API_2 = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/financePaymentInfoUnite/export`; /* 单笔单款明细列表导出 */
const OUT_PUT_RECORD_API_3 = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/financePaymentInfoUnite/export`; /* 单笔单款明细列表导出 */

const SINGLE_PAYMENT_DETAIL_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/financePaymentInfoUnite/getPaymentInfoList`; /* 单笔付款明细列表 */

const GET_PROGRESS_API = `${DOMAIN_OXT}/apiv2_/finance/finance/redis/getValue`; /* 导出进度条 */
const tableParams = {
    start: 0,
    length: 20,
};

const parseData = (data) => {
    const { currentPage, pageSize} = data;
    if(currentPage !== undefined && pageSize !== undefined) {
        return {
            ...data,
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
        }
    }
    return data;
}


export const twgetPaymentDetailList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(TW_PAYMENT_DETAIL_API, data).then(data => data);
}
export const spgetPaymentDetailList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(SP_PAYMENT_DETAIL_API, data).then(data => data);
}

export const getSinglePaymentDetailList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(SINGLE_PAYMENT_DETAIL_API, data).then(data => data);
}

export const outPutRecord = (data) => {
    let api;
    switch (Number(data.index)) {
        case 1 :
            api = OUT_PUT_RECORD_API_1;
            break;
        case 2 :
            api = OUT_PUT_RECORD_API_2;
            break;
        case 3 :
            api = OUT_PUT_RECORD_API_3;
            break;
        default : 
            throw new Error("'index' can't find in data");
    }
    return fetchFn(api, data).then(data => data);
}

export const getProgress = (data) => {
    return fetchFn(GET_PROGRESS_API, data).then(data => data);
}