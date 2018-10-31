import { DOMAIN_OXT } from '../../../global/global';
import { fetchFn } from '../../../util/fetch';

const CRM_MY_TEAM_GET_DATA_API = `${DOMAIN_OXT}/apiv2_/permission/v1/account/getMyTeamOfSales`;

export const getMyTeamList = (data) => {
	return fetchFn(CRM_MY_TEAM_GET_DATA_API, data).then(data => data);
}