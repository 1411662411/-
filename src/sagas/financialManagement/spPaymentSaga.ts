import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';

import {message} from 'antd';
import * as moment from 'moment';
import {
    getSpTableDataAPI,
    getOutTableDataAPI,
} from '../../api/financialManagement/spPaymentApi'

import {
    GET_SP_TABLE_DATA,
    GET_OUT_TABLE_DATA,
    receiveSpTableData,
    receiveOutTableData,
} from '../../action/financialManagement/spPaymentAction';
import { mapCurrentPageToStart } from '../../util/pagination'; 

function * getSpTableData(param){
    try {
        
        return yield getSpTableDataAPI(mapCurrentPageToStart(param))
    } catch (error) {
        message.error(error.toString())
    }
}
function * getOutTableData(params){
    try {
        // 时间格式后台要秒数
        const factplanPayTimeStart = params['factplanPayTimeStart'];
        if(factplanPayTimeStart){
            params['factplanPayTimeStart'] = moment(factplanPayTimeStart+' 00:00:00').valueOf()/1000;
        }
        const factplanPayTimeEnd = params['factplanPayTimeEnd'];
        if(factplanPayTimeEnd){
            params['factplanPayTimeEnd'] = moment(factplanPayTimeEnd+' 23:59:59').valueOf()/1000;
        }
        return yield getOutTableDataAPI(mapCurrentPageToStart(params))
    } catch (error) {
        message.error(error.toString())
    }
}

function * getSpPaymentAsync(obj){
    const {type, params} = obj;
    switch(type){
        case GET_SP_TABLE_DATA:{
           
            
            let data = yield getSpTableData(removeEmpty(params));
            if(data.status === 0){
                yield put(receiveSpTableData(data));
            }
            break;
        }  
        case GET_OUT_TABLE_DATA:{
            
            
            let data = yield getOutTableData(removeEmpty(params));
            if(data.status === 0){
                yield put(receiveOutTableData(data));
            }
            break;
        }
           
    }
}
const removeEmpty = (obj:any) => {
    let newObj ={};
    for (var key in obj) {
        if (obj[key]!=='') {
            newObj[key] = obj[key];
            
        }
    }
    return newObj;
}
export default function * watchSpPayment (){
    yield takeEvery([GET_SP_TABLE_DATA, GET_OUT_TABLE_DATA], getSpPaymentAsync)
}