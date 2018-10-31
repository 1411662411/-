import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

const CRM_WORKBENCH_MESSAGE_GET_DATA_API = `${DOMAIN_OXT}/apiv2_/crm/api/module/message/list`;

export const getMessageList = (data) => {
	return fetchFn(CRM_WORKBENCH_MESSAGE_GET_DATA_API, data).then(data => data);
}