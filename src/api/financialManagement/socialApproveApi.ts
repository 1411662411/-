import {
    DOMAIN_OXT,
} from '../../global/global';
import * as _ from 'lodash';
import { fetchFn } from '../../util/fetch';
const SOCIAL_APPROVE_LIST_API = `${DOMAIN_OXT}/apiv2_/finance/finance/v1/prepayments/list`;

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

const tableParams = {
    start: 0,
    length: 20,
}
export const getSocialApproveList = (data) => {
    data = _.assign({ }, tableParams, parseData(data));
    return fetchFn(SOCIAL_APPROVE_LIST_API, data).then(data => data);
}
