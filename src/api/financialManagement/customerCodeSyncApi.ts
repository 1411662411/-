import { DOMAIN_OXT } from '../../global/global';
import { fetchFn } from '../../util/fetch';
import { message } from 'antd';

const CUSTOMER_CODE_LIST_API = `${DOMAIN_OXT}/apiv2_/crm/api/transmitDataForNc/getTransmitDataInfo`;
const CUSTOMER_CODE_CONFIRM = `${DOMAIN_OXT}/apiv2_/crm/api/transmitDataForNc/confirmTransmitData`

export const getCustomerCodeList = (data) => {
	return fetchFn(CUSTOMER_CODE_LIST_API, data).then(data => data);
}

export const confirmTransmitData = (data) => {
	return fetchFn(CUSTOMER_CODE_CONFIRM, data).then(data => data)
}