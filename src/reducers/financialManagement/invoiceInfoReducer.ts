import {
    INVOICEINFO_DATA_RECEIVED,
    INVOICEINFO_FETCHING,
} from '../../action/financialManagement/invoiceInfoAction';
import * as Immutable from 'immutable';
import { eachUpdateIn } from '../../util/immutableUtil'; 

const initialState = Immutable.fromJS({
    fetching: true,
    dataSource: {}
});

export const invoiceInfo = (state=initialState, action) => {
    switch (action.type) {
        case INVOICEINFO_DATA_RECEIVED: {
            const data = action.params;
            return state.update('dataSource', () => 
                Immutable.fromJS({
                    invoice: data.invoice,
                    order: data.order,
                })
            );
        }
        case INVOICEINFO_FETCHING: {
            return state.update('fetching', () => action.params);
        }
        default:
            return state
    }
};