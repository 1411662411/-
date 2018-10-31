import {
    CHARGEOFFBYFILIALE_SET,
    FETCHING,
} from '../../action/financialManagement/chargeOffByFilialeAction';
import Immutable, { fromJS} from 'immutable';

const state = {
    dataSource: [],
    compareDataSource: [],
    personSource: [],
    fetching: true,
    total: 0,
    retrieveTotal: 0,
}
const initialState:Immutable.Map<keyof typeof state, any> = Immutable.fromJS(state);

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case CHARGEOFFBYFILIALE_SET: {
            return state.update('dataSource', () => fromJS(params.data.records))
                    .update('total', () => params.recordsTotal)
                    .update('retrieveTotal', () => params.retrieveTotal);
        }
        case FETCHING : {
            return state.update('fetching', () => params);
        }
        default:
            return state
    }
};