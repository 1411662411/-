import * as Immutable from 'immutable';
import * as _ from 'lodash';
import * as moment from 'moment';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    CASHOUT_NEEDS_APPROVAL_DATA,
    USER_BY_ORGANIZATIONS_DATA,
    FETCHING,
    UPDATE_SEARCH_PARAMS,
    UPDATE_CACHE_SEARCH_PARAMS,
    CASHOUT_SUBMITTER_DATA,
    APPROVAL_HANDLER_DATA,
    CASHOUT_SELECTED_ROW_DATA,
    CASHOUT_BATCH_EXPORT_PAYMENT_DATA,
    CASHOUT_MASTER_APPROVE_DATA,
    USER_MAP_DATA,
   
} from './../../action/socialManagement/cashoutNeedsApprovalAction';
import { eachUpdateIn } from '../../util/immutableUtil'; 
const searchParams = {
    ...PAGINATION_PARAMS,
    cashoutSubmitter:'',   //请款提交人
    approvalHandler:'',    //审批经手人
    planTime:'',           //计划支付时间
    orderCode:'',          //请款单号
    endTime:'',            //付款截止时间倒计时
    exportStatus:'',       //导出状态
    cashoutType:'',        //社保业务请款性质
    payeeType:'',          //收款方类型
    payeeName:'',          //收款方名称
    cashoutMoney:'',       //请款总金额
    role:0,
    isBatchApprove:false,
    // sortBy:'DEADLINE',
    
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    total: 0,
    dataSource: [],
    // cashoutSubmitterData:[],
    // approvalHandlerData:[],
    userByOrganizationsData:[],
    userMapData:[],
    selectedRowData:[],
    masterSelectedRowData:[],
    batchExportUrl:'',
    masterApproveResult:[],
    fetching: true,
    searchStatus: true, /*用于判断是否点击了搜索按钮 */
    searchParams,
    cacheSearchParams: _.assign({}, searchParams),  /* 用于只是改变组件状态的参数 */
});

export const cashoutNeedsApproval = (state = initialState, action) => {
    const data = action.params;
    
    switch (action.type) {
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });
        }
        case CASHOUT_NEEDS_APPROVAL_DATA: {
            
            let tempRecords = data.data;
            let newRecords:Array<any> = [];
            tempRecords.map(function (records) {
                newRecords.push({
                    ...records,
                    planTimeObj:{
                        editable:false,
                        value:moment(records.payTime*1000).format('YYYY-MM-DD hh:mm'),
                    }
                }
                    
                )
            })
            
            return state.update('dataSource', () => 
                    Immutable.fromJS(newRecords)
                // ).update('cashoutSubmitterData', () => Immutable.fromJS(data.data.cashoutSubmitter)
                // ).update('approvalHandlerData', () => Immutable.fromJS(data.data.approvalHandler)
                ).update('total', () => data.recordsTotal
                ).updateIn(['searchParams', 'currentPage'], () => data.currentPage
                ).updateIn(['cacheSearchParams', 'pageSize'], () => data.pageSize
                ).updateIn(['searchParams', 'pageSize'], () => data.pageSize);
        }
        case USER_MAP_DATA: {
            return state.update('userMapData', () => Immutable.fromJS(data.data));
        }
        case USER_BY_ORGANIZATIONS_DATA: {
            return state.update('userByOrganizationsData', () => Immutable.fromJS(data.data));
        }
        case UPDATE_SEARCH_PARAMS: {
            state = state.update('searchStatus', () => data.searchStatus);
            delete data.searchStatus;
            return eachUpdateIn(state, data, ['searchParams']);
        }
        case UPDATE_CACHE_SEARCH_PARAMS: {
            state = state.update('searchStatus', () => data.searchStatus);
            delete data.searchStatus;
            return eachUpdateIn(state, data, ['cacheSearchParams']);
        }
        case CASHOUT_SELECTED_ROW_DATA: {
            
            return state.update('selectedRowData', () => Immutable.fromJS(data.selectedRowKeys));
        }
        case CASHOUT_BATCH_EXPORT_PAYMENT_DATA: {
            
            return state.update('batchExportUrl', () => data.data.url
            // 清空选中项
            ).update('selectedRowData', () => Immutable.fromJS([]));
            
        }
        case CASHOUT_MASTER_APPROVE_DATA: {
            return state.update('selectedRowData', () => Immutable.fromJS([])
            ).update('isBatchApprove',() => false);
        }
        
        default: return state
    }
}




