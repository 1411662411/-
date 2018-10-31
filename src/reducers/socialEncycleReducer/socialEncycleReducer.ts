import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
   ALL_ENCYCLE_RECIEVE,
   CATEGORY_FORM_LIST_RECIEVE,
   IS_CHANGE_COLOR_RECIEVE,
   ARTICLE_ENCYLE_LIST_RECIEVE,
   ARTICLE_ENCYLE_AUDIT_LIST_RECIEVE,
   ARTICLE_AA_DIS,
   LOADING_ENCYCLE_RECIREV,
   SPINNING_LOADING_RECIEVE,
   SPINNING_AUDIT_LOADING_RECIEVE,
   TABLE_LOADING
} from '../../action/socialEncycleAction/socialEncycleAction';

/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    allEncycleList:{
        total:0,
        result:[]
    },
    articleList:{},
    categoryList:[],
    isChangeColor:[
         {classic:'oneCategory',index:0,id:''},
           {classic:'twoCategory',index:0,id:''},
           {classic:'threeCategory',index:0,id:''},
           {classic:'fourCategory',index:0,id:''},
            {classic:'fiveCategory',index:0,id:''}
    ],
    aduitList:{},
    Acument:{},
    buttonLoading:false,
    spinLoading:false,
    aDuitspinLoading:false,
    tableloading:false
});

export const socialEncycleListReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case IS_CHANGE_COLOR_RECIEVE: {
            return state.update('isChangeColor', () => Immutable.fromJS(data))
        }
        case ALL_ENCYCLE_RECIEVE: {
            return state.update('allEncycleList', () => Immutable.fromJS(data))
        }
        case CATEGORY_FORM_LIST_RECIEVE: {
            return state.update('categoryList', () => Immutable.fromJS(data))
        } 
        case ARTICLE_ENCYLE_LIST_RECIEVE: {
            return state.update('articleList', () => Immutable.fromJS(data))
        }
        case ARTICLE_ENCYLE_AUDIT_LIST_RECIEVE: {
            return state.update('aduitList', () => Immutable.fromJS(data))
        }
        case ARTICLE_AA_DIS: {
            return state.update('Acument', () => Immutable.fromJS(data))
        }
        case LOADING_ENCYCLE_RECIREV: {
            return state.update('buttonLoading', () => Immutable.fromJS(data))
        }
        case SPINNING_LOADING_RECIEVE:{
            return state.update('spinLoading', () => Immutable.fromJS(data))
        }
        case SPINNING_AUDIT_LOADING_RECIEVE: {
            return state.update('aDuitspinLoading', () => Immutable.fromJS(data))
        }
        case TABLE_LOADING: {
            return state.update('tableloading', () => Immutable.fromJS(data))
        }
        default: return state
    }
}




