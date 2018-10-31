import Immutable from 'immutable'
import {
    LIST_FETCHING,
    LIST_SET,
} from '../../../action/businessComponents/chapter/chapterHandleRecordAction'

const initialState = Immutable.fromJS({
    dataSource: [],
    fetching: true,
    total: 0,
})

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case LIST_SET: {
            return state.update('dataSource', () => Immutable.fromJS(params.data))
            .update('total', () => params.recordsTotal);
        }
        case LIST_FETCHING:
            return state.update('fetching', () => params);
        default:
            return state
    }
}