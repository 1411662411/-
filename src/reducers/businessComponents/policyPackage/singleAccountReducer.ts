import Immutable from 'immutable';
import {
    SINGLEACCOUNT_DETAIL_REDUCERS,
    SINGLEACCOUNT_LIST_REDUCERS,
    SINGLEACCOUNT_POLICYLIST_REDUCERS,
    SINGLEACCOUNT_DICTIONARY_NAME_REDUCERS,
    FETCHING,
    SUBMITING,
} from '../../../action/businessComponents/policyPackage/singleAccountAction';
const initialState = Immutable.fromJS({
    data: [],
    dataSource: [],
    // originalMaterials:{},
    activeTimeList:[],
    selectDictionaryData:[],
    fetching: false,
    submiting: false,
})

export default (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case SINGLEACCOUNT_POLICYLIST_REDUCERS:
            return state.update('activeTimeList', () => Immutable.fromJS(params.data));
        case SINGLEACCOUNT_DICTIONARY_NAME_REDUCERS:
            return state.update('selectDictionaryData', () => Immutable.fromJS(params.data));
        case SINGLEACCOUNT_LIST_REDUCERS:
            return state.update('data', () => Immutable.fromJS(params.data.records)).update('total', () => params.recordsTotal);
        case SINGLEACCOUNT_DETAIL_REDUCERS:
            return state.update('dataSource', () => Immutable.fromJS(params.data));
        case FETCHING:
            return state.update('fetching', () => params);
        case SUBMITING:
            return state.update('submiting', () => params)
        default:
            return state
    }
}