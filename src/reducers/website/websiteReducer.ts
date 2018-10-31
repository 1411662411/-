import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    ACTIVITY_LIST_RECIV,
    ACTIVITY_CHECK_RECIV,
    ACTIVITY_SIGNUP_RECIV,
    ACTIVITY_ADD_RECIV,
    ACTIVITY_AREA_RECIV,
    ACTIVITY_CREATOR_RECIV,
    ACTIVITY_ISRELEASESTATUS_RECIV,
    ACTIVITY_LOADING_RECIV,
    ACTIVITY_DATALISTLOADING_RECIV
} from '../../action/website/websiteAction';
import { eachUpdateIn } from '../../util/immutableUtil';
const searchParams = {
    ...PAGINATION_PARAMS,
    sortBy: 'DEADLINE',

};

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    list:{
        isRelease:'',	// 是否发布(1: 发布, 0: 未发布
        subject	:'',// 活动主题
        type:'',// 活动类型
        actStartTime:''	,// 活动开始时间
        actEndTime:'',// 活动结束时间
        cityId:'',// 活动省市id
        signStatus	:'',// 报名状态(1: 报名中 2: 报名结束)
        createUser:'', // 创建者
    },
    check:{
        "id": '',
        "subject": "",
        "type": '',
        "actStartTime": '',
        "actEndTime": '',
        "provinceId": null,
        "cityId": null,
        "areaName": "",
        "address": "",
        "signEndTime": null,
        "cover": "",
        "content": "",
        "guests": '',
        "flow": ""
    },
    signUp:{
        "msg": "",
        "recordsFiltered": 0,
        "data": [],
        "recordsTotal": 0,
    },
    areaData:[],
    creator:[],
    isRealeaseStatus:'',
    singupLoading:false,
    dataListLoading:false
    
    

});

export const websiteActivityListReducer = (state = initialState, action) => {
    const data = action.params;
    
    switch (action.type) {
        case ACTIVITY_LIST_RECIV: {
            return state.update('list', () => Immutable.fromJS(data))
        }
        case ACTIVITY_CHECK_RECIV: {
            return state.update('check', () => Immutable.fromJS(data))
        } 
        case ACTIVITY_SIGNUP_RECIV: {
            return state.update('signUp', () => Immutable.fromJS(data))
        }
        case ACTIVITY_AREA_RECIV: {
            return state.update('areaData', () => Immutable.fromJS(data))
        }
        case ACTIVITY_CREATOR_RECIV: {
            return state.update('creator', () => Immutable.fromJS(data))
        }
        case ACTIVITY_ISRELEASESTATUS_RECIV: {
            return state.update('isRealeaseStatus', () => Immutable.fromJS(data))
        }
        case ACTIVITY_LOADING_RECIV:{
            return state.update('singupLoading', () => Immutable.fromJS(data))
        }
        case ACTIVITY_DATALISTLOADING_RECIV: {
            return state.update('dataListLoading', () => Immutable.fromJS(data))
        }
        default: return state
    }
}




