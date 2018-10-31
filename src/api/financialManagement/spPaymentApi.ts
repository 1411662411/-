import { fetchFn } from '../../util/fetch';
import {DOMAIN_OXT} from "../../global/global";
import { message } from 'antd';
const GET_SPTABLEDATA_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/waitFroPay`;
const GET_OUTTABLEDATA_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/payList`;


export const getSpTableDataAPI = (params) => {

   return fetchFn(GET_SPTABLEDATA_API, params).then(data => data);
}
export const getOutTableDataAPI = (params) => {

    return fetchFn(GET_OUTTABLEDATA_API, params).then(data => data);
}

