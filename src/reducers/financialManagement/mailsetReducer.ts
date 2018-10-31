import * as Immutable from 'immutable';
import * as _ from 'lodash';
import {
    PAGINATION_PARAMS
} from '../../global/global';
import {
    MAILSET_REDUCERS,
    FETCHING,
    USER_BY_ORGANIZATIONS_REDUCERS,

} from '../../action/financialManagement/mailsetAction';
/**
 * 初始化数据
 */
const initialState = Immutable.fromJS({
    fetching: true,
    dataSource:[],
    setData:{},
    userByOrganizationsData:[],
})
export const mailsetReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        case MAILSET_REDUCERS: {
            // 查询
            if(data.type == 'query'){
                let dataSource:Array<any> = [];
                data.data.map(function (item) {
                    dataSource.push({
                        ...item,
                        userNameData:{
                            editable:false,
                            value:{
                                userName:item.userName||'',
                                userId:item.userId,
                            },
                        },
                        mailData:{
                            value:item.mail,
                        },
                        phoneData:{
                            value:item.phone,
                        }
                    }
                        
                    )
                })
            
                return state.update('dataSource', () => Immutable.fromJS(dataSource));
            }else{
                
                return state.update('setData', () => Immutable.fromJS(data));
            }
            
        }
        case USER_BY_ORGANIZATIONS_REDUCERS: {
            return state.update('userByOrganizationsData', () => Immutable.fromJS(data));
        }
        case FETCHING: {
            return state.update('fetching', () => {
                return data;
            });

        }
        
        default: return state
    }
}