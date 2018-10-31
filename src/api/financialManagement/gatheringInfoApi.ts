import {
    DOMAIN_OXT,
} from '../../global/global';
import { fetchFn } from '../../util/fetch';
import * as _ from 'lodash';

const GET_GATHERING_INFO_LIST_API = `${DOMAIN_OXT}/apiv2_/finance/finance/order/getExcelRecords`;

const parseData = ({ currentPage, pageSize, }) => {
    if(currentPage !== undefined && pageSize !== undefined) {
        return {
            start: (Number(currentPage) > 0 ? Number(currentPage) - 1 : Number(currentPage)) * Number(pageSize),
            length: pageSize,
        }
    }
    return { };
}



const tableParams = {
    start: 0,
    length: 20,
}
export const getGatheringInfoList = (data) => {
    data = _.assign(tableParams, parseData(data));
    return fetchFn(GET_GATHERING_INFO_LIST_API, data).then(data => data);
}
