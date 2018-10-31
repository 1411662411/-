import * as Immutable from 'immutable';

import {
    OUTPUT_ACCOUNTANT_SAGA,
    DATA_RECEIVED,
    ISFETCHING,
    UPDATE_SEARCH_PARAMS,
    OUT_PUT_RECEIVED,
    UPDATA_PROGRESS,
    TAB_PANE_CHANGE,
} from '../../action/financialManagement/outputAccountantAction';

const sessionInitalState = JSON.parse(sessionStorage.getItem('earningAccountant') !);
const initialState = Immutable.fromJS({
    index: 1,
    progress: {
        percent: 0,
        message: '',
        url: '',
        status: 'active',
        visible: false,
        buttonDisabled: true,
    },
    isFetching: true,
    pane1: {
        dataSource: [],
        total: 0,
        pageSize: 20,
        currentPage: 1,
        startTime: '',
        endTime: '',
        accountName: null,
        prepaymentsCode:null,
        cashoutMoney:null,
        isFirstLoad: true,
   },
   pane2: {
        dataSource: [],
        total: 0,
        pageSize: 20,
        currentPage: 1,
        startTime: '',
        endTime: '',
        accountName: '',
        prepaymentsCode:'',
        cashoutMoney:'',
        isFirstLoad: true,
   },
   pane3: {
        dataSource: [],
        total: 0,
        pageSize: 20,
        currentPage: 1,
        startTime: '',
        endTime: '',
        accountName: '',
       prepaymentsCode:'',
        isFirstLoad: true,
   },
   pane4: {
    dataSource: [],
    // total: 0,
    // pageSize: 20,
    // currentPage: 1,
    // startTime: '',
    // endTime: '',
    // accountName: '',
    isFirstLoad: false,
},
   ...sessionInitalState,
});



const parseData = (data) => {
    const total = data.recordsTotal;
    const index = data.index;
    const paneState = initialState.getIn([`pane${index}`]);
    const { 
        pageSize = initialState.getIn([`pane${index}`,'pageSize']),
        currentPage = initialState.getIn([`pane${index}`,'currentPage']),
    } = data;


    const data2 = data.data;
    if(data2 && data2.length) {
        const obj = {
            ...paneState.toJS(),
            total,
            dataSource: data2,
            currentPage,
            pageSize,
        };
        switch (Number(index)) {
           
             default : {
                const {
                    startTime,
                    endTime,
                    accountName,
                    prepaymentsCode,
                    cashoutMoney,
                } = data;
                return {
                    ...obj,
                    startTime,
                    endTime,
                    accountName,
                    prepaymentsCode,
                    cashoutMoney,
                }
            }  
        }
    }
    
    switch (Number(index)) {
            
        default : {
            const {
                startTime = initialState.getIn([`pane${index}`, 'startTime']),
                endTime = initialState.getIn([`pane${index}`, 'endTime']),
                accountName = initialState.getIn([`pane${index}`, 'accountName']),
                prepaymentsCode = initialState.getIn([`pane${index}`, 'prepaymentsCode']),
                cashoutMoney = initialState.getIn([`pane${index}`, 'cashoutMoney']),
            } = data;
            return {
                ...paneState.toJS(),
                startTime,
                endTime,
                accountName,
                prepaymentsCode,
                cashoutMoney,
            }
        }
            
    }
}

const eachUpdateIn = (state, data, parent: Array<string> = []) => {
    for(var k in data) {
        if(Object.prototype.hasOwnProperty.call(data, k)) {
            state = state.updateIn(parent.concat([k]), () => 
                Array.isArray(data[k]) ?  Immutable.fromJS(data[k]): data[k]
            );
        }
    }
    return state;
}


export const outputAccountant = (state = initialState, action) => {
    const {
        params = {} as any
    } = action;
    const {
        index,
        isFetching,
    } = params;
    switch (action.type) {

        case DATA_RECEIVED :
            
            const data = parseData(action.params);
            return eachUpdateIn(state, data, [`pane${params.index}`]).updateIn([`pane${params.index}`, 'isFirstLoad'], () => false );
        case OUT_PUT_RECEIVED : {
            const data = params.data;
            const {
                url,
            } = data;
            return state.updateIn(['progress', 'url'], () => {
                return url;
            });
        }
        case TAB_PANE_CHANGE : 
            return state.updateIn(['index'], () => index);
        case ISFETCHING :
            return state.updateIn(['isFetching'], (val)=> {
                return isFetching;
            });
        case UPDATE_SEARCH_PARAMS : 
            return eachUpdateIn(state, action.params, [`pane${params.index}`]);
        case UPDATA_PROGRESS : 
            return eachUpdateIn(state, action.params, ['progress']);
        default :
            return state;
    }
}