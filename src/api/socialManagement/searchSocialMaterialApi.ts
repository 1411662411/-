import { DOMAIN_OXT } from "../../global/global";
import { fetchFn } from '../../util/fetch';

const POLICYDATALIST_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policy/material-adviser-list`;
const POLICYDATAPOLICYLIST_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/policies/materials`;
const POLICYDATAPOLICYEXPORT_API = `${DOMAIN_OXT}/apiv2_/policy/policypackage/policymaterial/policies/materials-excel`;
export const getPolicyDataListApi = (data) => {

    return fetchFn(POLICYDATALIST_API, data).then(data => data);
}
export const getPolicyDedtailDataListApi = (data) => {

    return fetchFn(POLICYDATAPOLICYLIST_API, data).then(data => data);
}
export const getPolicyDedtailDataExportApi = (data)=>{
    return fetchFn(POLICYDATAPOLICYEXPORT_API, data).then(data => data);
}