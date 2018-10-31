import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { DOMAIN_OXT } from '../../global/global';
import {
    message
} from 'antd';
import * as moment from 'moment';
import {
    CASHOUT_TRANSFER_BYME_SAGA,
    cashoutTransferBymeReducers,
    CASHOUT_REJECT_REASON_SAGA,
    cashoutRejectReasonReducers,
    CASHOUT_CANCEL_SAGA,
    cashoutCancelReducers,
    USER_BY_ORGANIZATIONS_SAGA,
    userByOrganizationsData,
    USER_MAP_SAGA,
    userMapData,
    fetching,
    PROVE_SAGA,
    setProve,
    PAYENTRYINFO_SAGA,
    payentryinfoReducers,
    COUNT_SAGA,
    countNumberReducers,
} from '../../action/socialManagement/cashoutTransferBymeAction';

import {
    getCashoutTransferApi,
    getCashoutRejectReasonApi,
    cashoutCancelApi,
    userByOrganizationsApi,
    userMapApi,
    getProve,
    payentryinfoApi,
    getCountApi,
} from '../../api/socialManagement/cashoutTransferBymeApi';

import { mapCurrentPageToStart } from '../../util/pagination';


        
    


export function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    /**去除为空的参数给后台 */

    yield put(fetching(true));
    const newParams = mapCurrentPageToStart(removeEmpty(params));
    switch (type) {
        case COUNT_SAGA:
            let data = yield getCountApi(removeEmpty(params));
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                // sessionStorage.setItem('CASHOUT_TRANSFER_BYME_SESSIONSTORAGE', JSON.stringify(newParams))
                yield put(countNumberReducers(data));
            }
            break;
        case CASHOUT_TRANSFER_BYME_SAGA: {
            // 时间格式后台要秒数
            // const planPayTime = newParams['planPayTime'];
            // if(planPayTime){
            //     newParams['planPayTime'] = moment(planPayTime).valueOf()/1000;
            // }
            let data = yield getCashoutTransferApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                sessionStorage.setItem('CASHOUT_TRANSFER_BYME_SESSIONSTORAGE', JSON.stringify(newParams))
                yield put(cashoutTransferBymeReducers(data));
            }
            // yield put(cashoutTransferBymeReducers(data));
            break;
        }
        case USER_BY_ORGANIZATIONS_SAGA: {
            let data = yield userByOrganizationsApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(userByOrganizationsData(data));
            }
            break;
        }
        case USER_MAP_SAGA: {
            let data = yield userMapApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(userMapData(data));
            }
            break;
        }
        case CASHOUT_REJECT_REASON_SAGA: {
            let data = yield getCashoutRejectReasonApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                let {
                    jsSpPayeeDetail,
                    jsSpPayDetail,   
                    jsSpRequestFundVerifyRecordDto,
                    jsSpRequestFundVerifyRecordDtoList,
                } = data.data;
                //该对象后台可能不返回
                jsSpPayDetail = jsSpPayDetail||{}

                const payInfoEntryData = {
                    socialMonth: data.socialPaymentMonth, /* 社保缴费月（操作月）*/
                    socialNature: data.socialPayType, /* 社保请款性质 */
                    recipientType: data.payeeType, /* 收款方类型 */
                    recipientName: jsSpPayeeDetail.payeeName, /* 收款方名称 */
                    deadline: jsSpPayeeDetail.requestCutOffTime, /* 本次请款付款截止时间 */
                    billStatus: data.pbcRelationGuid ? 2 : 1　, /* 1: 无垫款， 2：有垫款*/
                    submitPerson: data.submitterId, /* 请款提交人姓名 */
                    submitPersonPhone: '', /* 请款提交人手机 */
                    recordsDataSource: jsSpRequestFundVerifyRecordDtoList, /* 请款记录 */
                    type: jsSpPayDetail.type,/*信息类型 1：银行转账，2：支票 */
                    bank: jsSpPayDetail.payBankName, /* 打款银行名称 */
                    serialNumber: jsSpPayDetail.serialNumber, /* 流水号 */
                    paytime: jsSpPayDetail.payTime, /* 计划支付时间 */
                    payBankAccount:jsSpPayDetail.payBankAccount,
                    attachment: {
                        name: '',
                        ossKey: jsSpPayDetail.ossKey,
                        value: jsSpPayDetail.httpsUrl,
                    }, /* 附件 */
                    payer: jsSpPayDetail.payerName,/* 付款方名称 */
                    accountNumber: jsSpPayDetail.drawerAccount,/* 出票人账号 */
                    checkNumber: jsSpPayDetail.checkNumber,/* 支票号 */
                    invoicingTime: jsSpPayDetail.openTicketTime,/* 开票时间 */
                    // payer: '2',/* 付款方名称 */
                }
                
                /**
                * 注入用户详细信息
                */
                // 不要查人员接口
                
                if(params.type != 'single'){

                
                    if (jsSpRequestFundVerifyRecordDtoList && jsSpRequestFundVerifyRecordDtoList.length > 0) {
                        const userIds = unique(jsSpRequestFundVerifyRecordDtoList.map(({ userId }) => userId));
                        const data = yield userMapApi(userIds);
                        const userData = data.data;
                        if (Number(data.status === 0) || Number(data.errcode === 0)) {

                            payInfoEntryData.recordsDataSource = payInfoEntryData.recordsDataSource.map((data) => {
                                /**
                                 * 注入当前请款单的操作人姓名，手机号
                                 */
                                if (userData && Object.prototype.hasOwnProperty.call(userData, payInfoEntryData.submitPerson)) {
                                    const currentUser = userData[payInfoEntryData.submitPerson];
                                    payInfoEntryData.submitPerson = currentUser.name;
                                    payInfoEntryData.submitPersonPhone = currentUser.phone;
                                }
                                return { ...data, userDetail: getUserDetail(data.userId, userData) }
                            })
                        }
                    }
                    else {
                        const data = yield userMapApi([payInfoEntryData.submitPerson]);
                        const userData = data.data;
                        if (Number(data.status === 0) || Number(data.errcode === 0)) {

                            /**
                             * 注入当前请款单的操作人姓名，手机号
                             */
                            if (userData && Object.prototype.hasOwnProperty.call(userData, payInfoEntryData.submitPerson)) {
                                const currentUser = userData[payInfoEntryData.submitPerson];
                                payInfoEntryData.submitPerson = currentUser.name;
                                payInfoEntryData.submitPersonPhone = currentUser.phone;
                            }
                        }
                    }
                }
                // 组装驳回原因
                let rejectReasonData = {}
                if (jsSpRequestFundVerifyRecordDto) {
                    rejectReasonData = {
                        reason: jsSpRequestFundVerifyRecordDto.rejectReason,
                        files: jsSpRequestFundVerifyRecordDto.jsSpAccessoryFileList.map(({ name, url }) => ({ name, link: url })),
                    }
                }
                
                if(params.callback){
                    
                    params.callback();
                }
                const newData = { rejectReasonData, payInfoEntryData }
                yield put(cashoutRejectReasonReducers(newData));
     
            }
            break;
        }
        case CASHOUT_CANCEL_SAGA: {
            let data = yield cashoutCancelApi(newParams);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                message.success('取消成功');
                params.callback();
                yield put(cashoutCancelReducers(data));
            }
            break;
        }
        case PROVE_SAGA: {
           

            const data = yield getProve({
                code: params.code,
            });
            if (data.errcode === 0 || data.status === 0) {
                yield put(setProve(data.data));
                if (params.resolve) {
                    params.resolve();
                }
            }
            break;
        }
        case PAYENTRYINFO_SAGA: {
            const data = yield payentryinfoApi(params);
            if (data.errcode === 0 || data.status === 0) {
                message.success('保存成功');
                if(params.callback){
                    params.callback();
                }
                
                yield put(payentryinfoReducers(data.data));
            }
            break;
        }

    }
    yield put(fetching(false));
}
/**
 * Array去重
 * @param arr {Array} 旧数组
 */
/**
 * Array去重
 * @param arr {Array} 旧数组
 */
const unique = (arr: any[]) => {
    const newArr: typeof arr = [];
    let obj:{
        [ propsName : string ] : number
    } = {};
    for (var i = 0; i < arr.length; i++) {
        if (!obj[arr[i]]) {
            newArr.push(arr[i]);
            obj[arr[i]] = 1;
        }
    }
    return newArr;
}
/**
 * 
 * @param id {Number} 用户id
 * @param users  {Object} 用户集合
 * @return userDetail {Object} 单个用户信息
 */
const getUserDetail = (id, users) => {
    let userDetail = {};
    if (users && Object.prototype.hasOwnProperty.call(users, id)) {
        userDetail = users[id];
    }
    return userDetail;
}
/**
 * 去除空值对象给后台
 * @param obj{any} 对象
 * @return 
 */
const removeEmpty = (obj: any) => {
    let newObj = {};
    for (var key in obj) {
        if (obj[key] !== '') {
            newObj[key] = obj[key];

        }
    }
    return newObj;
}
// Our watcher Saga: 在每个 INCREMENT_ASYNC action 调用后，派生一个新的 incrementAsync 任务
export default function* watchCashoutTransferByme() {
    yield takeEvery([
        CASHOUT_TRANSFER_BYME_SAGA,
        CASHOUT_REJECT_REASON_SAGA,
        CASHOUT_CANCEL_SAGA,
        USER_BY_ORGANIZATIONS_SAGA,
        USER_MAP_SAGA,
        PROVE_SAGA,
        PAYENTRYINFO_SAGA,
        COUNT_SAGA,
    ], incrementAsync)
}
