import {
    INVOICE_INVOICING,
    INVOICE_INVOICING_LOADING,
    INVOICE_GET_DATA,
    INVOICE_FETCHING,
    INVOICE_UPDATE_SEARCH_PARAMS,
    INVOICE_UPDATE_CACHE_SEARCH_PARAMS,
    INVOICE_MODAL_VISIBLE,
} from '../../action/financialManagement/invoiceAction';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import * as Immutable from 'immutable';
import * as _ from 'lodash';
import { eachUpdateIn } from '../../util/immutableUtil'; 



const searchParams = {
    ...PAGINATION_PARAMS,
    invoiceNumber: '',
    invoiceTitle: '',
    startTime: '',
    endTime: '',
    orderType: '0', // 0全部 1会员订单 2社保费订单
    invoiceStatus: '', //1代开发票 2已开发票 ''所有发票
}
const initialState = Immutable.fromJS({
    fetching: true,
    dataSource: [],
    total: 0,
    tableLoading: true,
    invoicingIsLoading: false,
    visible: false,
    modalData: {},
    cacheSearchParams: _.assign({}, searchParams),  /* 用于只是改变组件状态的参数 */
    searchParams,
});

export const invoiceReducer = (state=initialState, action) => {
    switch (action.type) {
        case INVOICE_GET_DATA: {
            const data = action.params;
            return state.update('dataSource', () => 
                    Immutable.fromJS(data.data.records)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'currentPage'], () => data.currentPage
                ).updateIn(['cacheSearchParams', 'pageSize'], () => data.pageSize
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize);
        }
        case INVOICE_UPDATE_SEARCH_PARAMS: {
            return eachUpdateIn(state, action.params, ['searchParams']);
        }
        case INVOICE_UPDATE_CACHE_SEARCH_PARAMS: {
            return eachUpdateIn(state, action.params, ['cacheSearchParams']);
        }
        case INVOICE_FETCHING: {
            return state.update('fetching', () => {
                return action.params;
            });
        }
        case INVOICE_INVOICING : {
            return state.update('modalData', () => action.params
            ).update('visible', () => true);
        }
        case INVOICE_MODAL_VISIBLE: {
            return state.update('visible', () => false);
            // 修改弹窗状态
        }
        default:
            return state
    }
};