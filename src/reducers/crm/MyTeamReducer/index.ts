import * as Immutable from 'immutable';
import {
    CRM_MY_TEAM_SET_DATA,
    CRM_MY_TEAM_ISFETCHING,
} from '../../../action/crm/MyTeamAction/'
import {
    PAGINATION_PARAMS
} from '../../../global/global';

const searchParams = {
    ...PAGINATION_PARAMS,
};
const initialState = Immutable.fromJS({
	searchParams,
	isFetching: true,
	dataSource: [],
	total: 0,
});

export const crmMyTeam = (state=initialState, action) => {
    switch(action.type){
        case CRM_MY_TEAM_SET_DATA: {
            const data = action.params;
            return state.update('dataSource', () => 
                    Immutable.fromJS(data.records)
                ).update('total', () => data.rowCount)
                .updateIn(['searchParams', 'currentPage'], () => data.pageNow)
                .updateIn(['searchParams', 'pageSize'], () => data.pageSize)
		}
		case CRM_MY_TEAM_ISFETCHING: {
            return state.update('isFetching', () => {
                return action.params;
            });
        }
		default:
			return state;
    }
}