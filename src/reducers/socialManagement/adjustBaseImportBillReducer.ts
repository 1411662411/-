import * as Immutable from 'immutable';
import {
    SET_LIST_DATA,
    LIST_FETCHING,
} from './../../action/socialManagement/adjustBaseImportBillAction';


/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: [],
    listFetching: true,
});

export default (state = initialState, action) => {
    const {
        params,
        type,
        callback,
    } = action;
    switch (type) {
        case SET_LIST_DATA: {
            return state.update('dataSource', () => Immutable.fromJS(params.data || [])).update('total', () => params.recordsTotal);
        }
        case LIST_FETCHING: {
            return state.update('listFetching', () => params);
        }
        default: return state;
    }
}




