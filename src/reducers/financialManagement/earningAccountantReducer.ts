import * as Immutable from 'immutable';

import {
    EARNING_ACCOUNTANT_SAGA,
    DATA_RECEIVED,
    ISFETCHING,
    UPDATE_SEARCH_PARAMS,
    OUT_PUT_RECEIVED,
    UPDATA_PROGRESS,
    TAB_PANE_CHANGE,
} from '../../action/financialManagement/earningAccountantAction';

const sessionInitalState = JSON.parse(sessionStorage.getItem('earningAccountant')!);
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
        bankAccount: '',
        customerName: '',
        orderType: '',
        isFirstLoad: true,
        minAmount: '',
        maxAmount: '',
    },
    pane2: {
        dataSource: [],
        total: 0,
        pageSize: 20,
        currentPage: 1,
        startTime: '',
        endTime: '',
        bankAccount: '',
        isFirstLoad: true,
    },
    pane3: {
        dataSource: [],
        total: 0,
        pageSize: 20,
        currentPage: 1,
        startTime: '',
        endTime: '',
        customerName: '',
        isFirstLoad: true,
    },
    ...sessionInitalState,
});



const parseData = (data) => {
    const total = data.recordsTotal;
    const index = data.index;
    const paneState = initialState.getIn([`pane${index}`]);
    const {
        pageSize = initialState.getIn([`pane${index}`, 'pageSize']),
        currentPage = initialState.getIn([`pane${index}`, 'currentPage']),
    } = data;


    const data2 = data.data;
    const obj = {
        ...paneState.toJS(),
        total,
        dataSource: data2.records,
        currentPage,
        pageSize,
    };
    switch (Number(index)) {
        case 1: {
            const {
                    startTime,
                endTime,
                bankAccount,
                customerName,
                orderType,
                minAmount,
                maxAmount,
                } = data;
            return {
                ...obj,
                startTime,
                endTime,
                bankAccount,
                customerName,
                orderType,
                minAmount,
                maxAmount,
            }
        }
        case 2: {
            const {
                    startTime,
                endTime,
                bankAccount,
                } = data;
            return {
                ...obj,
                startTime,
                endTime,
                bankAccount,
            }
        }

        case 3: {
            const {
                    startTime,
                endTime,
                customerName,
                } = data;
            return {
                ...obj,
                startTime,
                endTime,
                customerName,
            }
        }
    }

    // switch (Number(index)) {
    //     case 1 : {
    //         const {
    //             startTime = initialState.getIn([`pane${index}`, 'startTime']),
    //             endTime = initialState.getIn([`pane${index}`, 'endTime']),
    //             bankAccount = initialState.getIn([`pane${index}`, 'bankAccount']),
    //             customerName = initialState.getIn([`pane${index}`, 'customerName']),
    //         } = data;
    //         return {
    //             ...paneState.toJS(),
    //             startTime,
    //             endTime,
    //             bankAccount,
    //             customerName,
    //         }
    //     }
    //     case 2 : {
    //         const {
    //             startTime = initialState.getIn([`pane${index}`, 'startTime']),
    //             endTime = initialState.getIn([`pane${index}`, 'endTime']),
    //             bankAccount = initialState.getIn([`pane${index}`, 'bankAccount']),
    //         } = data;
    //         return {
    //             ...paneState.toJS(),
    //             startTime,
    //             endTime,
    //             bankAccount,
    //         }
    //     }
    //     case 3 : {
    //         const {
    //             startTime = initialState.getIn([`pane${index}`, 'startTime']),
    //             endTime = initialState.getIn([`pane${index}`, 'endTime']),
    //             customerName = initialState.getIn([`pane${index}`, 'customerName']),
    //         } = data;
    //         return {
    //             ...paneState.toJS(),
    //             startTime,
    //             endTime,
    //             customerName,
    //         }
    //     }

    // }
}

const eachUpdateIn = (state, data, parent: Array<string> = []) => {
    for (var k in data) {
        if (Object.prototype.hasOwnProperty.call(data, k)) {
            state = state.updateIn(parent.concat([k]), () =>
                Array.isArray(data[k]) ? Immutable.fromJS(data[k]) : data[k]
            );
        }
    }
    return state;
}


export const earningAccountant = (state = initialState, action) => {
    const {
        params = {} as any
    } = action;
    const {
        index,
        isFetching,
    } = params;
    switch (action.type) {
        case DATA_RECEIVED:
            const data = parseData(action.params);
            
            return eachUpdateIn(state, data, [`pane${params.index}`]).updateIn([`pane${params.index}`, 'isFirstLoad'], () => false);
        case OUT_PUT_RECEIVED: {
            const data = params.data;
            const {
                url,
            } = data;
            return state.updateIn(['progress', 'url'], () => {
                return url;
            });
        }
        case TAB_PANE_CHANGE:
            return state.updateIn(['index'], () => index);
        case ISFETCHING:
            return state.updateIn(['isFetching'], (val) => {
                return isFetching;
            });
        case UPDATE_SEARCH_PARAMS:
            return eachUpdateIn(state, action.params, [`pane${params.index}`]);
        case UPDATA_PROGRESS:
            return eachUpdateIn(state, action.params, ['progress']);
        default:
            return state;
    }
}