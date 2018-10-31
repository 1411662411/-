import * as Immutable from 'immutable';
import {
    RECEIVE_POLICY_LIST_SAGA,
    GET_POLICY_LIST_SAGA,
    DISPATCH_POLICY_SAGA,
    RESET_INFO_SEARCH_SAGA,
    DISPATCH_POLICY_SAGA_FETCHING,
} from '../../action/policyMaintenance/policyListAction';

const initialState = Immutable.fromJS({ 
    policyData: {
        policyId:'', //政策包id
        provinceName: '', //省         
        cityName:'', //市
        districtName:'', //区（政策包名）
        allowInsured: '',//allowInsured
        allowSocialBill:'',//是否允许社保账单启用
        wSocialAttritionTime: '',//平台时间截止日
        calHidden:'',//社保计算器是否启用
        serviceType:'',//服务类型
        wFundStuffTime: '',//平台参保材料收集截止时间
        allowAdviser: '',//社保顾问是否启用
        allowMaterialTourists:'',//材料是否开放给游客
        allowMaterialCustomer:'',//材料是否开放给客户
        allowMaterialAdviser:'',//材料是否开放给社保顾问
        spWFundStuffTime:'',
   },
   recordsTotal: '',
   fetching: false,
   loading:false,
   isOk:0
})

 const policyListReducer = (state = initialState, action) => {
    const data = action.params;
    switch (action.type) {
        
        case GET_POLICY_LIST_SAGA:
            return state.update('policyData', () => Immutable.fromJS(data.data)).update('recordsTotal', () => Immutable.fromJS(data.recordsTotal))
            
           
        case RESET_INFO_SEARCH_SAGA:
            // { data, index, oldData }
             
                // const newData = data.data.data
                // const index = data.index
                // const oldData = data.oldData[index]
                // for (let i in newData) {
                //     if (newData[i] !== null && newData[i] !== ' ') {
                //         if (i == 'wFundStuffTime') {
                //             oldData.w_fund_stuff_time = newData[i]
                //         } else if (i == 'allowMaterialTourists') {
                //             oldData.allow_material_tourists = newData[i]
                //         } else if (i == 'allowMaterialCustomer') {
                //             oldData.allow_material_customer = newData[i]
                //         } else if (i == 'allowMaterialAdviser') {
                //             oldData.allow_material_adviser = newData[i]
                //         }
                //     }
                // }
            return state.update('isOk', () => Immutable.fromJS(data.errcode))
           
        case DISPATCH_POLICY_SAGA_FETCHING : {
            return state.update('fetching', () => data)
        }
        default:
            return state
    }
}

export default policyListReducer