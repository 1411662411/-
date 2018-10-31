import * as Immutable from 'immutable';
import {
    WORKBENCH_SET_SALEKIT,
    WORKBENCH_SET_TODAY_TODO_LIST,
    WORKBENCH_SET_WEEK_TODO_LIST,
    WORKBENCH_SET_WILL_AUDIT_LIST,
    WORKBENCH_SET_DID_AUDIT_LIST,
} from '../../../action/crm/Workbench'

const initialState = Immutable.fromJS({
    saleKitSource:[],
    salesTodayTodoList:[],
    salesWeekTodoList:[],
    willAuditList: [],
    didAuditList: [],
    collapsed: false,
    proclamationSource:[],
});

export const crmWorkbench = (state=initialState, { type, params}) => {
    switch(type){
        case WORKBENCH_SET_SALEKIT: {
            return state.update('saleKitSource', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_SET_TODAY_TODO_LIST: {
            return state.update('salesTodayTodoList', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_SET_WEEK_TODO_LIST: {
            return state.update('salesWeekTodoList', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_SET_WILL_AUDIT_LIST: {
            return state.update('willAuditList', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_SET_DID_AUDIT_LIST: {
            return state.update('didAuditList', () => {
                return Immutable.fromJS(params);
            })
        }
        default: return state;
    }
}