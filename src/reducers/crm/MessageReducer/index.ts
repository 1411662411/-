import * as Immutable from 'immutable';
import {
    CRM_WORKBENCH_MESSAGE_SET_DATA,
    CRM_WORKBENCH_MESSAGE_ISFETCHING,
} from '../../../action/crm/MessageAction/'
import {
    PAGINATION_PARAMS
} from '../../../global/global';

const searchParams = {
    ...PAGINATION_PARAMS,
    status: ''
};
const initialState = Immutable.fromJS({
	searchParams,
	isFetching: true,
	dataSource: [],
	total: 0,
});

export const crmWorkbenchMessage = (state=initialState, action) => {
    switch(action.type){
        case CRM_WORKBENCH_MESSAGE_SET_DATA: {
            const data = action.params;
            return state.update('dataSource', () => 
                    Immutable.fromJS(data.result)
                ).update('total', () => data.total)
                .updateIn(['searchParams', 'currentPage'], () => data.current)
                .updateIn(['searchParams', 'pageSize'], () => data.pagesize)
		}
		case CRM_WORKBENCH_MESSAGE_ISFETCHING: {
            return state.update('isFetching', () => {
                return action.params;
            });
        }
		default:
			return state;
    }
}