import {DOMAIN_OXT} from "../../global/global";
import { fetchFn } from '../../util/fetch';

const CASHOUT_MANAGEMENT_BILL_API = `${DOMAIN_OXT}/apiv3_/v1/sppay/manMonthList`;


export const cashoutManagementBillApi = (data) => {
    return fetchFn(CASHOUT_MANAGEMENT_BILL_API, data).then(data => data);
}


