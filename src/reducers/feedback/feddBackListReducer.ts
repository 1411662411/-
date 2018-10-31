import Immutable from 'immutable'
import {
    LIST_FETCHING,
    LIST_SET,
    REPLY_FETCHING,
    REPLY_LIST_SET,
    REPLY_LIST_FETCHING,
} from '../../action/feedback/feedBackListAction'

const initialState = Immutable.fromJS({
    dataSource: [],
    fetching: true,
    replyFetching: false,
    replylistSource: [],
    replylistFetching: true,
    total: 0,
})

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case LIST_SET: {
            return state.update('dataSource', () => Immutable.fromJS(mergeArr(params.listData.data.result, params.likeData.data.result)))
            .update('total', () => params.likeData.data.total);
        }
        case LIST_FETCHING:
            return state.update('fetching', () => params);
        case REPLY_FETCHING:
            return state.update('replyFetching', () => params);
        case REPLY_LIST_FETCHING: {
            return state.update('replylistFetching', () => params);
        }
        case REPLY_LIST_SET: {
            return state.update('replylistSource', () => Immutable.fromJS(params.data));
        }
        default:
            return state
    }
}

const mergeArr = (arr1, arr2) => {
    if(!arr1 || arr1.length <= 0) {
        return [];
    }
    var arr2Map = {};

    arr2.forEach(element => arr2Map[element.id] = element);
    arr1.forEach((element, index) => {
        element.status = arr2Map[element.id].status;
    });
    return arr1;
}