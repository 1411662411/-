import Immutable from 'immutable'
import { 
    CHAPTER_INFO_DETAIL_SET,
    FETCHING,
} from '../../../action/businessComponents/chapter/chapterInfoEnterAction';

const initialState = Immutable.fromJS({
    data: [],
    fetching: true,
})

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case CHAPTER_INFO_DETAIL_SET:
            return state.update('data', () => Immutable.fromJS(params.data));
        case FETCHING:
            return state.update('fetching', () => params)
        default:
            return state
    }
}