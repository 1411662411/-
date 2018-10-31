import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    DUODUO_ORDER_DETAIL_SAGA,
    DUODUO_LIST_DETAIL_SAGA
} from '../../action/socialManagement/importBillReviewAction';

import { eachUpdateIn } from '../../util/immutableUtil';
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy: 'DEADLINE',
};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
  order:{},
  confirmInfos:[],
  orderList:[],
  operaterTime:'',
  operaterUser:''
});

export const importBillDetail = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case DUODUO_ORDER_DETAIL_SAGA: {
            
            return state.update('order', () => Immutable.fromJS(data.data.order))
            .update('confirmInfos', () => Immutable.fromJS(data.data.confirmInfos))
            .update('operaterTime', () => Immutable.fromJS(data.data.operaterTime))
            .update('operaterUser', () => Immutable.fromJS(data.data.operaterUser))
        }
        case DUODUO_LIST_DETAIL_SAGA: {
           
            const socialBillData = {
                list: data.data.list,
                total: data.data.jdWagesBillDto
            }
            return state.update('orderList', () => Immutable.fromJS(socialBillData));
        }
        default: return state
    }
}




