
import Immutable from 'immutable';
import {
    PAT_IMPORT_EXPORT_RECORDS_SET
} from '../../action/businessComponents/payGetInfoRecordsAction';
// import {
//     USER_MAP_SAGA,
// } from '../../action/socialManagement/cashoutTransferBymeAction';
const initialState = Immutable.fromJS({
    setPayImportExportRecords: [],
    total:0
});
export const getPayInfo = (state = initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case PAT_IMPORT_EXPORT_RECORDS_SET: {
            return state.update('setPayImportExportRecords', () => Immutable.fromJS(params.data)).update('total', () => Immutable.fromJS(params.recordsTotal));
            
        }
        // case USER_MAP_SAGA:{
        //     return state.update('cashoutTransferByme', () => Immutable.fromJS(params));
        // }
        default:
            return state;
    }
}
