import {
    INVOICE_EDIT_SUBMIT_FETCHING,
    INVOICE_EDIT_RESET_STATE,
} from '../../action/saleWorkbench/invoiceEditAction';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
    invoiceEditSubmitFetching: false,
});

export const invoiceEdit = (state=initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case INVOICE_EDIT_SUBMIT_FETCHING: {
            return state.update('invoiceEditSubmitFetching', () => Immutable.fromJS(params));
        }
        case INVOICE_EDIT_RESET_STATE: {
            return initialState;
        }
        default:
            return state
    }
};