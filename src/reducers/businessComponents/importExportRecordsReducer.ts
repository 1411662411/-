import {
    IMPORT_EXPORT_RECORDS_FETCHING,
    IMPORT_EXPORT_RECORDS_SET,
} from '../../action/businessComponents/importExportRecordsAction';
import Immutable from 'immutable';


const initialState = Immutable.fromJS({
    fetching: true,
    dataSource: [],
    total: 0,
});

export const importExportRecords = (state=initialState, action) => {
    const {
        type,
        params,
    } = action;
    switch (type) {
        case IMPORT_EXPORT_RECORDS_SET: {
            return state.update('dataSource', () => Immutable.fromJS(params.data)).update('total', () => params.recordsTotal);
        }
        case IMPORT_EXPORT_RECORDS_FETCHING: {
            return state.update('fetching', () => params);
        }
        default:
            return state
    }
};