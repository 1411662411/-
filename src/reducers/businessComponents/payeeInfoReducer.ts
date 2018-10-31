import Immutable from 'immutable';
import {
    SECONDCASHOUTNAMESOURCE_SET,
    SECONDCASHOUTINFO_SET,
    SECONDCASHOUTINFO_FETCHING,
} from '../../action/businessComponents/payeeInfoAction';

const initialState = Immutable.fromJS({
    secondCashoutNameSource: [],
    secondCashoutInfo: {},
    secondCashoutInfoFetching: false,
});

export const payeeInfo = (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case SECONDCASHOUTNAMESOURCE_SET: {
            return state.update('secondCashoutNameSource', () => Immutable.fromJS(params));
        }
        case SECONDCASHOUTINFO_SET: {
            return state.update('secondCashoutInfo', () => Immutable.fromJS(params));
        }
        case SECONDCASHOUTINFO_FETCHING : {
            return state.update('secondCashoutInfoFetching', () => params);
        }
        default:
            return state;
    }
}
