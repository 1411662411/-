import {
    DOMAIN_OXT,
} from '../../global/global';
import { fetchFn } from '../../util/fetch';
import * as _ from 'lodash';

const EIVABLE_SUBSIDIARY_API = `${DOMAIN_OXT}/apiv2_/finance/finance/receipt/query`; /* 到款明细列表 */
const OUT_PUT_RECORD_API_1 = `${DOMAIN_OXT}/apiv2_/finance/finance/receipt/export`; /* 到款明细列表导出 */

const EIVABLE_SINGLE_SUBSIDIARY_API = `${DOMAIN_OXT}/apiv2_/finance/finance/receipt/query/unite`; /* 单笔到款明细列表 */
const OUT_PUT_RECORD_API_2 = `${DOMAIN_OXT}/apiv2_/finance/finance/receipt/export/unite`; /* 单笔单款明细列表导出 */
const MEMBER_FEE_API = `${DOMAIN_OXT}/apiv2_/finance/finance/memberReceiptInfo/list`; /* 会员费到款列表 */
const OUT_PUT_RECORD_API_3 = `${DOMAIN_OXT}/apiv2_/finance/finance/memberReceiptInfo/export`; /* 会员费到款列表导出 */
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


export const getEivableSubsidiaryList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(EIVABLE_SUBSIDIARY_API, data).then(data => data);
}

export const getSingleEivableSubsidiaryList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(EIVABLE_SINGLE_SUBSIDIARY_API, data).then(data => data);
}
export const getMemberFeeList = (data) => {
    data = _.assign({}, tableParams, parseData(data));
    return fetchFn(MEMBER_FEE_API, data).then(data => data);
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