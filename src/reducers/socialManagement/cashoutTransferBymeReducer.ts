import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    CASHOUT_TRANSFER_BYME_REDUCERS,
    FETCHING,
    CASHOUT_REJECT_REASON_REDUCERS,
    USER_BY_ORGANIZATIONS_DATA,
    USER_MAP_DATA,
    PROVE_DATA,
    PAYENTRYINFO_REDUCERS,
    COUNT_REDUCER,
} from './../../action/socialManagement/cashoutTransferBymeAction';

import { eachUpdateIn } from '../../util/immutableUtil';
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy: 'DEADLINE',
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: [],
    userByOrganizationsData: [],
    userMapData: [],
    cashoutSubmitterData: [],
    approvalHandlerData: [],
    masterSelectedRowData: [],
    masterApproveResult: [],
    waitApproval: 0,
    waitPay: 0,
    rejectReasonData: {
        files: [],
        reason: ''
    },
    payInfoEntryData:null,
    fetching: true,

    searchStatus: true, /*用于判断是否点击了搜索按钮 */
    searchParams,
    cacheSearchParams: _.assign({}, searchParams),  /* 用于只是改变组件状态的参数 */
    prove: '', /* 打款证明图片 */
    dataNumber:'',
});

export const cashoutTransferByme = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case CASHOUT_TRANSFER_BYME_REDUCERS: {
            return state.update('dataSource', () => Immutable.fromJS(data.data)
                ).update('total', () => data.recordsTotal
                ).update('waitApproval', () => data.waitApprove
                ).update('waitPay', () => data.waitPay
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize
                );
        }
        case USER_BY_ORGANIZATIONS_DATA: {
            return state.update('userByOrganizationsData', () => Immutable.fromJS(data.data));
        }
        case USER_MAP_DATA: {
            return state.update('userMapData', () => Immutable.fromJS(data.data));
        }
        case CASHOUT_REJECT_REASON_REDUCERS: {
            return state.update('rejectReasonData', () => Immutable.fromJS(data.rejectReasonData)
                ).update('payInfoEntryData', () => Immutable.fromJS(data.payInfoEntryData)
                );

        }
        case PROVE_DATA: {
            return state.update('prove', () =>　data.ossKey);
        }
        case COUNT_REDUCER: {
            return state.update('dataNumber', () => 　data.data);
        }
        case PAYENTRYINFO_REDUCERS: {
            // return state.update('payentryinfoFetching', () => data);
        }
        default: return state
    }
}




