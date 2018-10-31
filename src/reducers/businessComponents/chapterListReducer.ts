import {
    CHAPTERLIST_SET,
    PERSONSOURCE_SET,
    CHAPTERLIST_COMPARE_DATASOURCE_SET,
    FETCHING,
    TOTAL,
} from '../../action/businessComponents/chapterListActions';
import Immutable from 'immutable';

var a = 0;
const state = {
    dataSource: [],
    compareDataSource: [],
    personSource: [],
    fetching: true,
    total: 0,
}
const initialState:Immutable.Map<keyof typeof state, any> = Immutable.fromJS(state);

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case CHAPTERLIST_SET: {
            return state.update('dataSource', () => params);
        }
        case TOTAL: {
            return state.update('total', () => params);
        }
        case PERSONSOURCE_SET: {
            return state.update('personSource', () => params);
        }
        case CHAPTERLIST_COMPARE_DATASOURCE_SET: {
            return state.update('compareDataSource', () => params);
        }
        case FETCHING : {
            return state.update('fetching', () => params);
        }
        default:
            return state
    }
};