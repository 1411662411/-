
import Immutable from 'immutable';
import {
    FETCHING,
    DATA_SET,
} from '../../action/socialManagement/importSocialNumberAction';

const initialState = Immutable.fromJS({
    dataSource: [],
    fetching: true,
    total: 0
});


export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case FETCHING: {
            return state.update('fetching', () => params);
        }
        case DATA_SET: {
            return state.update('dataSource', () => Immutable.fromJS(params.data))
                .update('total', () => params.recordsTotal);
        }
        default:
            return state;
    }
}
