import {
    DATA_RECEIVED,
    GATHERING_INFO_ENTRY_SAGA,
    ISFETCHING,
    UPLOADING,
} from '../../action/financialManagement/gatheringInfoAction';

import * as Immutable from 'immutable';

const initialState = Immutable.fromJS({
    dataSource: [],
    total: 0,
    pageSize: 20,
    currentPage: 1,
    listIsFetching: true,
    uploading: false,
});

const parseData = (data) => {
    const total = data.recordsTotal;
    const { pageSize = initialState.getIn(['pageSize']), 
        currentPage = initialState.getIn(['currentPage']),
    } = data;
    data = data.data;
   
    if(data && data.records && data.records.length) {
        return {
            total,
            dataSource: data.records,
            currentPage,
            pageSize,
        }
    }
    
    return {
        dataSource: [],
        total: 0,
        currentPage,
        pageSize,
    }
}



export const gatheringInfo = (state = initialState, action) => {
    switch (action.type) {
        case DATA_RECEIVED:
            const {
                dataSource,
                total,
                currentPage,
                pageSize,
            } = parseData(action.params);
            
            return state.updateIn(['dataSource'], () => {
                return Immutable.fromJS(dataSource);
            }).updateIn(['total'], () => {
                return total;
            }).updateIn(['currentPage'], () => {
                return currentPage;
            }).updateIn(['pageSize'], () => {
                return pageSize;
            });
        case ISFETCHING: 
            const {
                listIsFetching,
            } = action.params;
            return state.updateIn(['listIsFetching'], () => {
                return listIsFetching;
            });
        case UPLOADING :
            const {
                uploading,
            } = action.params;
            return state.updateIn(['uploading'], () => {
                return uploading;
            });
        default: 
            return state;
    }
}