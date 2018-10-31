import Immutable from 'immutable';
import {
    SET_INVOICE_INFO,
    FETCHING,
    SET_BUTTON_NUMBER,
} from '../../action/businessManagement/invoiceInfoAction'

const state = {
    total:0,
    dataSource: [],
    fetching: false,
    buttons: [],
}
const initialState:Immutable.Map<keyof typeof state, any> = Immutable.fromJS(state);

export default (state = initialState, action) => {
    const {
        params,
        type,
    } = action;
    switch(type) {
        case SET_INVOICE_INFO: {
            return state.update('total', () => params.recordsTotal)
                        .update('dataSource', () => Immutable.fromJS(params.data.records));
        }
        case FETCHING: {
            return state.update('fetching', () => params);
        }
        case SET_BUTTON_NUMBER: {
            const list:any[] = params['data'][0]['list'];
            return state.update('buttons', () => Immutable.fromJS(list.reverse()));
        }
        default :
            return state;
    }
}

