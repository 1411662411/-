import * as Immutable from 'immutable';
import { SINGLE_INFO_RECIEVE, SINGLE_INFO_EDITOR_RECIEVE, FETCH_LOADING} from '../../action/singleInfomation/singleInfoAction'
const initialState = Immutable.fromJS({
    singleInfoData: {
        
            "id": null,
            "customerId": null,
            // （包含以下字段：businessLicense\shorterForm\telephone\zipCode\address\开户银行openBank\银行对公账号BankAccount）
            "companyInfoOfFront": null,
            "companyInfoOfCustomer": '',
            "socialOpenData": null,
            "fundOpenData": null,
            "isDelete": null,
            "deleteTime": null,
            "createTime": null,
            "createUser": null,
            "updateTime": null,
            "updateUser": null,
            "remark": null,
            "openBank":null,
            "bankAccount":null
        
    },
    saveData:null,
    Fetchloading:false,
})
const singleInfoReducer = (state = initialState, action) => {
    const data = action.params;

    switch (action.type) {
        case SINGLE_INFO_RECIEVE:
            return state.update('singleInfoData', () => Immutable.fromJS(data.data))
        case SINGLE_INFO_EDITOR_RECIEVE:
            return state.update('saveData', () => Immutable.fromJS(data))
        case FETCH_LOADING:
            return state.update('Fetchloading', () => Immutable.fromJS(data))
        default:
            return state
    }
}

export default singleInfoReducer