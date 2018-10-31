import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const CASHOUT_MANAGEMENT_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/splist/finance/payList`;


export const cashoutManagementApi = (data) => {
    return fetchFn(CASHOUT_MANAGEMENT_API, data).then(data => data);
}


