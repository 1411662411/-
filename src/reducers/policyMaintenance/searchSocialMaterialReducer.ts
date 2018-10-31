import * as Immutable from 'immutable';
import {
    SEARCH_SOCIAL_MATERIAL_PLICY_RECEIVED,
    SEARCH_SOCIAL_MATERIAL_LIST_RECEIVED,
    SEARCH_SOCIAL_MATERIAL_EXPORT_RECEIVED,
    SEARCH_SOCIAL_MATERIAL_LOADING_RECEIVED,
    SEARCH_SOCIAL_MATERIAL_FETCHING_RECEIVED
} from '../../action/socialManagement/searchSocialMaterialAction'

const initialState = Immutable.fromJS({
    polociList:[],
    dataList:[],
    loading:false,
    fetching:false,
    exportUrl:''
})

const policyDataListReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {

        case SEARCH_SOCIAL_MATERIAL_PLICY_RECEIVED:
            return state.update('polociList', () => Immutable.fromJS(data.data))
        case SEARCH_SOCIAL_MATERIAL_LIST_RECEIVED:

            if(data!=''){
                return state.update('dataList', () => Immutable.fromJS(data.data))
            }else{
                return state.update('dataList', () => Immutable.fromJS(data.data))
            }
        case SEARCH_SOCIAL_MATERIAL_LOADING_RECEIVED:
            return state.update('loading', () => data)
        case SEARCH_SOCIAL_MATERIAL_FETCHING_RECEIVED:
            return state.update('fetching', () => data)
        case SEARCH_SOCIAL_MATERIAL_EXPORT_RECEIVED:
            return state.update('exportUrl', () => Immutable.fromJS(data.data))
        default:
            return state
    }
}

export default policyDataListReducer