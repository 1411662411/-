import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const GET_DATA_SEARCH = `${DOMAIN_OXT}/apiv2_/finance/finance/confirm`;
const GET_SWITCH_DATA = `${DOMAIN_OXT}/apiv2_/finance/finance/claim/query`;
const SET_SWITCH =  `${DOMAIN_OXT}/apiv2_/finance/finance/claim/update`; 
const BADGE_API = `${DOMAIN_OXT}/apiv2_/order/order/unconfirmed-remind`; 
export const getTableData = (data) => {
    return fetchFn(GET_DATA_SEARCH, data).then(data => data);
}

/**
 * 获取红点
 * @param data {Object} 参数
 */
export const getBadge = (data) => {
    return fetchFn(BADGE_API, data).then(data => data);
}

/**
 * 获取开关
 * @param data {Object} 参数
 */
export const getSwitchData = (data?) => {
    return fetchFn(GET_SWITCH_DATA, data).then(data => data);
}

/**
 * 更新开关
 * @param data {Object} 参数
 */
export const setSwitchData = (data?) => fetchFn(SET_SWITCH, data).then(data => data);