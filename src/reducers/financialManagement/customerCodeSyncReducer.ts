import * as Immutable  from 'immutable';
import {
	DATA_RECEIVED,
	ISFETCHING,
	RECEIVE_DATA_CONFIRM,
	UPDATE_ID,
	UPDATE_IDS
} from '../../action/financialManagement/customerCodeSyncAction';
import {
    PAGINATION_PARAMS
} from '../../global/global';
// const sessionInitalState = sessionStorage.getItem('customerCodeSync');
// console.log('sessionInitalState', sessionInitalState)
const searchParams = {
	...PAGINATION_PARAMS,
	buttJointStatus: '',
	dataType: '',
	cName: '',
};
const initalState = Immutable.fromJS({
	searchParams,
	isFetching: true,
	dataSource: [],
	total: 0,
	id: '',
	ids: '',
});

export const customerCodeSync = (state = initalState, action) => {
	switch(action.type) {
		case DATA_RECEIVED: {
			const data = action.params;
            return state.update('dataSource', () => 
                    Immutable.fromJS(data.data.records)
                ).update('total', () => data.data.rowCount
                ).updateIn(['searchParams', 'currentPage'], () => data.currentPage
                ).updateIn(['cacheSearchParams', 'pageSize'], () => data.pageSize
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
			).updateIn(['searchParams', 'buttJointStatus'], () => data.buttJointStatus)
				.updateIn(['searchParams', 'dataType'], () => data.dataType)
                .updateIn(['searchParams', 'cName'], () => data.cName)
		}
		case ISFETCHING: {
            return state.update('isFetching', () => {
                return action.params;
            });
        }
		case UPDATE_ID: {
			return state.updateIn(['id'], () => action.params.id)
		}
		case UPDATE_IDS: {
			return state.updateIn(['ids'], () => action.params.ids)
		}
		default:
			return state;
	}
}