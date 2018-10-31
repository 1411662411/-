import * as Immutable from 'immutable';
import {
    WORKBENCH_CONFIG_SET_PROCLAMATION, 
    LOADING, 
    WORKBENCH_CONFIG_SET_ANNOUNCEMENT,
    WORKBENCH_CONFIG_SET_WELCOME_CONTENT,
    WORKBENCH_CONFIG_SET_CONFIG_LIST,
    WORKBENCH_CONFIG_SET_POSITION_LIST,
    WORKBENCH_CONFIG_SET_POSITION_LOADING,
} from '../../../action/crm/WorkbenchConfig'

const initialState = Immutable.fromJS({
    iconSource:[],
    configSource:[],
    proclamationSource:[],
    proclamationPagination: {
        total:0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        defaultPageSize: 10,
        pageSize: 10,
        defaultCurrent:1,
        current:1,
        showSizeChanger: true,
        showQuickJumper: true,
        size: "small",
        pageSizeOptions:['10','20','50','100'],
    },
    configPagination: {
        total:0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        defaultPageSize: 50,
        pageSize: 50,
        defaultCurrent:1,
        current:1,
        showSizeChanger: true,
        showQuickJumper: true,
        size: "small",
        pageSizeOptions:['50','100'],
    },
    iconPagination: {
        total:0,
        showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
        defaultPageSize: 18,
        pageSize: 18,
        defaultCurrent:1,
        current:1,
    },
    loading: true,
    announcement:{},
    welCome:{
        content:'',
        title:'',
    },
    position:[],
    configLoading:false,
});

export const crmWorkbenchConfig = (state=initialState, { type, params}) => {
    switch(type){
        case LOADING: {
            return state.update('loading', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_CONFIG_SET_PROCLAMATION: {
            return state.update('proclamationSource', () => {
                return Immutable.fromJS(params.result);
            }).updateIn(['proclamationPagination', 'defaultCurrent'], () => {
                return Immutable.fromJS(params.current);
            }).updateIn(['proclamationPagination', 'current'], () => {
                return Immutable.fromJS(params.current);
            }).updateIn(['proclamationPagination', 'defaultPageSize'], () => {
                return Immutable.fromJS(params.pagesize);
            }).updateIn(['proclamationPagination', 'pageSize'], () => {
                return Immutable.fromJS(params.pagesize);
            }).updateIn(['proclamationPagination', 'total'], () => {
                return Immutable.fromJS(params.total);
            })
        }
        case WORKBENCH_CONFIG_SET_CONFIG_LIST:{
            return state.update('configSource', () => {
                return Immutable.fromJS(params.result);
            }).updateIn(['configPagination', 'defaultCurrent'], () => {
                return Immutable.fromJS(params.current);
            }).updateIn(['configPagination', 'current'], () => {
                return Immutable.fromJS(params.current);
            }).updateIn(['configPagination', 'defaultPageSize'], () => {
                return Immutable.fromJS(params.pagesize);
            }).updateIn(['configPagination', 'pageSize'], () => {
                return Immutable.fromJS(params.pagesize);
            }).updateIn(['configPagination', 'total'], () => {
                return Immutable.fromJS(params.total);
            })
        }
        case WORKBENCH_CONFIG_SET_ANNOUNCEMENT:{
            return state.update('announcement', (value) => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_CONFIG_SET_WELCOME_CONTENT:{
            return state.update('welCome', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_CONFIG_SET_POSITION_LIST:{
            return state.update('position', () => {
                return Immutable.fromJS(params);
            })
        }
        case WORKBENCH_CONFIG_SET_POSITION_LOADING:{
            return state.update('configLoading', () => {
                return Immutable.fromJS(params);
            })
        }
        default: return state;
    }
}

// export default crmWorkbenchConfig