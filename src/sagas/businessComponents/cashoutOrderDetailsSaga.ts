import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import {
    ROUTER_PATH,
} from '../../global/global';
import {
    getCashoutDetail,
    getAdvancedetails,
    getPaymentbill,
    getPaymentschedule,
    submit,
    getPersonInfo,
    getApproved,
    getPersonInfoBatch,
} from '../../api/businessComponents/cashoutOrderDetailsApi';
import {
    setCashoutorderdetails,
    setAdvancedetails,
    setPaymentbill,
    setPaymentschedule,
    baseFetching,
    submitfetching,
    CASHOUTORDERDETAILS_ADVANCEDETAILS_SAGA,
    CASHOUTORDERDETAILS_SAGA,
    CASHOUTORDERDETAILS_PAYMENTBILL_SAGA,
    CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA,
    CASHOUTORDERDETAILS_SUBMIT_SAGA,
    GET_APPROVED_SAGA,
    setApproved,
    exceptionModal,
} from '../../action/businessComponents/cashoutOrderDetailsAction';

/**
 * 是否能弹窗
 * @param userDepartmentId {Number} 用户id
 * @param ceoOrganizationId {NUmber} ceoid 
 * @param csoPositionId {NUmber} csoid 
 */
const hasShow = (userId,userData, ceoOrganizationId, csoPositionId ) =>  {
    let userDetail:any = {};
    if (userData && Object.prototype.hasOwnProperty.call(userData, userId)) {
        userDetail = userData[userId];
    }
    const positionId = userDetail.positionId;
    // ceo 或 cso 不弹窗
    if(positionId === ceoOrganizationId||positionId === csoPositionId) return false;
    return true;
} 

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
 * 截取最后的total
 * @param data {Array} 数据
 */
const sliceTotal = (data) => {
    const tempData = data || [];
    let dataObj = {};
    if (tempData.length >= 2) {
        dataObj = {
            dataSource: tempData.slice(0, tempData.length - 1),
            total: tempData[tempData.length - 1],
        }
    }
    else {
        dataObj = {
            dataSource: tempData.slice(0, tempData.length - 1),
            total: {},
        }
    }
    return dataObj;
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
 * 获取正确的弹窗信息
 * @param type {Number} 0已提交, 3 已取消 
 * @param role {Number} 角色控制，1 ：业务 2：财务, 3: CEO 
 * @param code {String} 订单id
 */
const exceptionModalData  = (type: 0 | 3 , role: 1 | 2 | 3, code: string ) => {
    const visible = true;
    if(type === 0) {
        let obj:any = {
            visible,
            message : '该请款单已经审批，您无需进行操作',
            sessionStorageName : 'cashoutApproveDetail',
        }
        if(role === 1) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/social/business/cashout/approve/details`;
            return obj;
        }
        else if(role === 2) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/financial/cashout/approve/details`;
            return obj;
        }
        else if (role === 3) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/ceo/cashout/approve/details`;
            return obj;
        }
    }
    else {
        let obj:any = {
            visible,
            message : '该请款单已经取消',
            sessionStorageName : 'cashoutApproveDetail',
        }
        if(role === 1) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/social/cashout/approve/needme`;
            return obj;
        }
        else if(role === 2) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`;
            return obj;
        }
        else if (role === 3) {
            obj.redirectUrl = `${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`;
            return obj;
        }
    }


    return {
        visible: false,
    }
}

function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case CASHOUTORDERDETAILS_SAGA: {
            yield put(baseFetching(true));
            let data = yield getCashoutDetail(params);
            if (Number(data.status === 0) || Number(data.errcode === 0)) {
                data = data.data;
                const {
                    jsSpPayeeDetail,
                    jsSpRequestFundVerifyRecordDtoList,
                    ceoOrganizationId,
                    csoPositionId,
                    approval,
                    status,

                    existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount, /** 无明细款项金额 */
                    noDetailRemark, /** 无明细款项备注*/
                } = data;
                const newData = {
                    isApproval: approval, /* 是否已经审批 */
                    socialMonth: data.socialPaymentMonth, /* 社保缴费月（操作月）*/
                    socialNature: data.socialPayType, /* 社保请款性质 */
                    recipientType: data.payeeType, /* 收款方类型 */
                    recipientName: jsSpPayeeDetail.payeeName, /* 收款方名称 */
                    deadline: jsSpPayeeDetail.requestCutOffTime, /* 本次请款付款截止时间 */
                    billStatus: data.billStatus , /* 1: 无垫款， 2：有垫款*/
                    submitPerson: data.submitterId, /* 请款提交人姓名 */
                    submitPersonPhone: '', /* 请款提交人手机 */
                    recordsDataSource: jsSpRequestFundVerifyRecordDtoList, /* 请款记录 */
                    payTime: data.payTime, /* 计划支付时间 */
                    openBank:jsSpPayeeDetail.openBank, /* 开户行 */
                    account: jsSpPayeeDetail.account, /* 开户账号 */

                    existNoDetail: existNoDetail ? Number(existNoDetail) : 0, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount: noDetailAmount ? Number(noDetailAmount) : 0, /** 无明细款项金额 */
                    noDetailRemark: noDetailRemark || '', /** 无明细款项备注*/
                }

                /**
                 * 注入用户详细信息
                 */
                if (jsSpRequestFundVerifyRecordDtoList && jsSpRequestFundVerifyRecordDtoList.length > 0) 　{
                    const userIds = unique(jsSpRequestFundVerifyRecordDtoList.map(({ userId }) => userId));
                    const data = yield getPersonInfoBatch(userIds);
                    const userData = data.data;
                    if (Number(data.status === 0) || Number(data.errcode === 0)) {
                        newData.recordsDataSource = newData.recordsDataSource.map((data) => {
                            /**
                             * 注入当前请款单的操作人姓名，手机号
                             */
                            if (userData && Object.prototype.hasOwnProperty.call(userData, newData.submitPerson)) {
                                const currentUser = userData[newData.submitPerson];
                                newData.submitPerson = currentUser.name;
                                newData.submitPersonPhone = currentUser.phone;
                            }
                            return { ...data, userDetail: getUserDetail(data.userId, userData), hasShow:hasShow(data.userId,userData, ceoOrganizationId,csoPositionId) }
                        });
                    }
                }
                else {
                    const data = yield getPersonInfoBatch([newData.submitPerson]);
                    const userData = data.data;
                    if (Number(data.status === 0) || Number(data.errcode === 0)) {
                        
                        /**
                         * 注入当前请款单的操作人姓名，手机号
                         */
                        if (userData && Object.prototype.hasOwnProperty.call(userData, newData.submitPerson)) {
                            const currentUser = userData[newData.submitPerson];
                            newData.submitPerson = currentUser.name;
                            newData.submitPersonPhone = currentUser.phone;
                        }
                    }
                }


                yield put(setCashoutorderdetails(newData));

                /**
                 * 已取消
                 */
                if(status === 3) {
                    yield put(exceptionModal(exceptionModalData(3, params.role, params.id )))
                }
                /**
                 * 已重新提交
                 */
                else if((status === 0 || status === 1 || status === 2) && approval === false) {
                     yield put(exceptionModal(exceptionModalData(0, params.role, params.id )))
                }
                
               
                /* 有垫款 */
                if (newData.billStatus === 2) {
                    const data = yield getAdvancedetails({ code: params.id});
                    if (Number(data.error) === 0 || Number(data.status) === 0) {
                        yield put(setAdvancedetails(sliceTotal(data.data)));
                    }
                }
            }
            yield put(baseFetching(false));
            break;
        }
        case CASHOUTORDERDETAILS_SUBMIT_SAGA: {
            yield put(submitfetching(true));
            const data = yield submit(params);
            if (Number(data.status === 0) || Number(data.errcode === 0)) {
                const newData = data.data;

                 /**
                 * 已经提交
                 */
                if (newData && newData.status === '172014') {
                    yield put(exceptionModal(exceptionModalData(0, params.role, params.code )));
                }
                /**
                 * 已经取消
                 */
                else if (newData && newData.status === '172015') {
                    yield put(exceptionModal(exceptionModalData(3, params.role, params.code )));
                }
                else {
                    message.success('提交成功', 3, () => { 
                    //1 ：业务 2：财务, 3: CEO
                    switch(params.role) {
                        case 1: {
                            browserHistory.push(`${ROUTER_PATH}/newadmin/social/cashout/approve/needme`);
                            break;
                        }
                        case 2: {
                            browserHistory.push(`${ROUTER_PATH}/newadmin/financial/cashout/approve/needme`);
                            break;
                        }
                        case 3: {
                            browserHistory.push(`${ROUTER_PATH}/newadmin/ceo/cashout/approve/needme`);
                            break;
                        }
                        default : {
                            browserHistory.goBack();
                        }
                    }
                    
                });
                }
                
            }
            //yield put(submitfetching(false));
            break;
        }
        case CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA: {
            const data = yield getPaymentschedule(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentschedule(sliceTotal(data.data)));
            }
            break;
        }
        case CASHOUTORDERDETAILS_PAYMENTBILL_SAGA: {
            const data = yield getPaymentbill(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentbill(sliceTotal(data.data)));
            }
            break;
        }
        case GET_APPROVED_SAGA: {
            const data = yield getApproved(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setApproved(data.data));
            }
            break;
        }
        // case CASHOUTORDERDETAILS_RECORDS_SAGA: {
        //     const data = yield getRecords(params);
        //     if (Number(data.error) === 0 || Number(data.status) === 0) {
        //         yield put(setRecords(data.data));
        //     }
        //     break;
        // }
    }
}


export default function* watchCashoutOrderDetails() {
    yield takeEvery([
        CASHOUTORDERDETAILS_SAGA,
        CASHOUTORDERDETAILS_ADVANCEDETAILS_SAGA,
        CASHOUTORDERDETAILS_PAYMENTSCHEDULE_SAGA,
        CASHOUTORDERDETAILS_PAYMENTBILL_SAGA,
        CASHOUTORDERDETAILS_SUBMIT_SAGA,
        GET_APPROVED_SAGA,
    ], incrementAsync);
}