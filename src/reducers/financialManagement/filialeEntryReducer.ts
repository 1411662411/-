import * as _ from 'lodash';
import {
    EDIT_TABLE_DATA,
    CANCEL_EDIT_TABLE_DATA,
    SAVE_TABLE_DATA,
    START_STOP_TABLE_DATA,
    DATA_RECEIVED,
    PAGE_SIZE_CHANGE,
    ADD_ISFETCHING,
    ISFETCHING,
    INPUT_CHANGE,
} from '../../action/financialManagement/filialeEntryAction';


const initialState = {
    dataSource: [],
    total: 0,
    pageSize: 20,
    currentPage: 1,
    branchName: '',
    listIsFetching: true,
    searchListFetching: false,
    addIsFetching: false,
    addFilialeSearchName: '',
    branchType:1,
    addDepositName: '',
    addDepositAccount: '',
    bankTypeName:'',
    bankType:'',
    cityName:'',
    provinceId:'',
    cityId:'',
    districtId:'',

};

const parseData = (data) => {
    const total = data.recordsTotal;
    const { pageSize = initialState.pageSize, 
        currentPage = initialState.currentPage, 
        branchName = initialState.branchName,
        branchType = initialState.branchType,
    } = data;
    data = data.data;
    if(data && data.records && data.records.length) {
        return {
            total,
            dataSource: data.records,
            currentPage,
            pageSize,
            branchName,
            branchType,
        }
    }
    return {
        dataSource: [],
        total: 0,
        currentPage,
        pageSize,
        branchName,
        branchType,
    }
}

const setEditStatus = ({ dataSource, id, index, isEdit }) => {
    if(dataSource && dataSource.length && dataSource[index] && dataSource[index].id === id) {
        dataSource[index].isEdit = isEdit;
        return {
            dataSource: _.cloneDeep(dataSource),
        }
    }
    return  {
        dataSource,
    }
}


export const filialeEntry = (state = initialState, action) => {
    switch (action.type) {
        case CANCEL_EDIT_TABLE_DATA:
            return {
                ...state,
                dataSource: action.params.dataSource,
            }
        case EDIT_TABLE_DATA:
            return {
                ...state,
                ...setEditStatus(action.params)
            }
        case INPUT_CHANGE:
            return {
                ...state,
                ...action.params,
            }
        case DATA_RECEIVED: 
            return {
                ...state,
                ...parseData(action.data),
                listIsFetching: false,
                addIsFetching: false,
                searchListFetching: false,
            }
        case　ADD_ISFETCHING: 
            return {
                ...state,
                addIsFetching: action.addIsFetching,
            }

        case START_STOP_TABLE_DATA: 
            return {
                ...state,
                dataSource: action.params.dataSource,
                listIsFetching: false,
            }
        case ISFETCHING:
            return {
                ...state,
                listIsFetching: action.listIsFetching,
                searchListFetching: action.searchListFetching,
            }
        default:
            return state;
    }
}

