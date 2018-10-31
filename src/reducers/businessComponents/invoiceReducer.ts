import {
    INVOICE_BASE_INFO_SET,
    INVOICE_BASE_FETCHING,
} from '../../action/businessComponents/invoiceAction';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
    invoiceBaseInfoFetching: true,
    invoiceBaseInfo : {
        baseInfo: {
        },
        expressInfo: [],
        orderInfo: {},
    },
});

export const invoice = (state=initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case INVOICE_BASE_INFO_SET: {
            return state.update('invoiceBaseInfo', () => Immutable.fromJS(params));
        }
        case INVOICE_BASE_FETCHING: {
            return state.update('invoiceBaseInfoFetching', () => params);
        }
        default:
            return state
    }
};