import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/lib/effects';
import { message } from 'antd';
import { browserHistory } from 'react-router'
import { ROUTER_PATH } from '../../global/global';
import {
    getPayinfoentry,
    getAdvancedetails,
    getPaymentbill,
    getPaymentschedule,
    submit,
    remove,
    getPersonInfoBatch,
} from '../../api/businessComponents/payInfoEntryApi';
import {
    setPayinfoentry,
    setAdvancedetails,
    setPaymentbill,
    setPaymentschedule,
    baseFetching,
    PAYINFOENTRY_ADVANCEDETAILS_SAGA,
    PAYINFOENTRY_SAGA,
    PAYINFOENTRY_PAYMENTBILL_SAGA,
    PAYINFOENTRY_PAYMENTSCHEDULE_SAGA,
    PAYINFOENTRY_SUBMIT_SAGA,
    PAYINFOENTRY_REMOVE_SAGA,
    submitfetching,
    removefetching,
    exceptionModal,
} from '../../action/businessComponents/payInfoEntryAction';

/**
 * 是否能弹窗
 * @param userDepartmentId {Number} 用户部门id
 * @param ceoOrganizationId {NUmber} ceoid 
 */
const hasShow = (userDepartmentId, ceoOrganizationId) => {
    if (userDepartmentId === ceoOrganizationId) return false;
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


function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case PAYINFOENTRY_SAGA: {
            yield put(baseFetching(true));
            let data = yield getPayinfoentry(params);
            if (Number(data.status === 0) || Number(data.errcode === 0)) {
                data = data.data;
                let {
                    jsSpPayeeDetail,
                    jsSpPayDetail,
                    jsSpRequestFundVerifyRecordDtoList,
                    ceoOrganizationId,
                    status,

                    existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount, /** 无明细款项金额 */
                    noDetailRemark, /** 无明细款项备注*/
                } = data;
                jsSpPayDetail = jsSpPayDetail ? jsSpPayDetail : {};
                const newData = {
                    socialMonth: data.socialPaymentMonth, /* 社保缴费月（操作月）*/
                    socialNature: data.socialPayType, /* 社保请款性质 */
                    recipientType: data.payeeType, /* 收款方类型 */
                    recipientName: jsSpPayeeDetail.payeeName, /* 收款方名称 */
                    deadline: jsSpPayeeDetail.requestCutOffTime, /* 本次请款付款截止时间 */
                    billStatus: data.billStatus　, /* 1: 无垫款， 2：有垫款*/
                    submitPerson: data.submitterId, /* 请款提交人姓名 */
                    submitPersonPhone: '', /* 请款提交人手机 */
                    recordsDataSource: jsSpRequestFundVerifyRecordDtoList, /* 请款记录 */
                    type: jsSpPayDetail.type,/*信息类型 1：银行转账，2：支票 */
                    bank: jsSpPayDetail.payBankName, /* 打款银行名称 */
                    serialNumber: jsSpPayDetail.serialNumber, /* 流水号 */
                    paytime: jsSpPayDetail.payTime, /* 计划支付时间 */
                    payBankAccount: jsSpPayDetail.payBankAccount,
                    attachment: {
                        name: '',
                        value: jsSpPayDetail.httpsUrl,
                        ossKey: jsSpPayDetail.ossKey,
                    }, /* 附件 */
                    payer: jsSpPayDetail.payerName,/* 付款方名称 */
                    accountNumber: jsSpPayDetail.drawerAccount,/* 出票人账号 */
                    checkNumber: jsSpPayDetail.checkNumber,/* 支票号 */
                    invoicingTime: jsSpPayDetail.openTicketTime,/* 开票时间 */
                    openBank: jsSpPayeeDetail.openBank,
                    account: jsSpPayeeDetail.account,
                    // payer: '2',/* 付款方名称 */

                    existNoDetail: existNoDetail ? Number(existNoDetail) : 0, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount: noDetailAmount ? Number(noDetailAmount) : 0, /** 无明细款项金额 */
                    noDetailRemark: noDetailRemark || '', /** 无明细款项备注*/
                }
                /**
                * 注入用户详细信息
                */
                if (jsSpRequestFundVerifyRecordDtoList && jsSpRequestFundVerifyRecordDtoList.length > 0) {
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
                            return { ...data, userDetail: getUserDetail(data.userId, userData), hasShow: hasShow(data.userDepartmentId, ceoOrganizationId) }
                        })
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

                /**
                 * 已经取消
                 */
                if (status === 3) {
                    yield put(exceptionModal({
                        visible: true,
                        message: '该请款单已经取消',
                        redirectUrl: `${ROUTER_PATH}/newadmin/financial/social/spPayment`
                    }));
                }
                /**
                 * 已经提交
                 */
                else if (jsSpPayDetail.type !== undefined) {
                    yield put(exceptionModal({
                        sessionStorageName: 'spPayment',
                        visible: true,
                        message: '该请款单已经支付，您无需进行操作',
                        redirectUrl: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/check`
                    }));
                }

                yield put(setPayinfoentry(newData));

                /* 有垫款 */
                if (newData.billStatus === 2) {
                    const data = yield getAdvancedetails({ code: params.id });
                    if (Number(data.error) === 0 || Number(data.status) === 0) {
                        yield put(setAdvancedetails(sliceTotal(data.data)));
                    }
                }
            }
            yield put(baseFetching(false));
            break;
        }

        case PAYINFOENTRY_PAYMENTSCHEDULE_SAGA: {
            const data = yield getPaymentschedule(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentschedule(sliceTotal(data.data)));
            }
            break;
        }
        case PAYINFOENTRY_PAYMENTBILL_SAGA: {
            const data = yield getPaymentbill(params);
            if (Number(data.error) === 0 || Number(data.status) === 0) {
                yield put(setPaymentbill(sliceTotal(data.data)));
            }
            break;
        } 
        case PAYINFOENTRY_REMOVE_SAGA :{
            yield put(removefetching(true));
            const data = yield remove(params);
            if (Number(data.status === 0) || Number(data.errcode === 0)) {
                const newData = data.data;
                message.success('取消成功', 3, () => { browserHistory.push(`${ROUTER_PATH}/newadmin/financial/social/spPayment`) });
            }
            break;
        }
        case PAYINFOENTRY_SUBMIT_SAGA: {
            yield put(submitfetching(true));
            const data = yield submit(params);
            

            if (Number(data.status === 0) || Number(data.errcode === 0)) {
                const newData = data.data;

                /**
                * 已经提交
                */
                if (newData && newData.status === '172014') {
                    yield put(exceptionModal({
                        sessionStorageName: 'spPayment',
                        visible: true,
                        message: '该请款单已经支付，您无需进行操作',
                        redirectUrl: `${ROUTER_PATH}/newadmin/financial/cashout/payinfo/check`
                    }));
                }
                /**
                 * 已经取消
                 */
                else if (newData && newData.status === '172015') {
                    yield put(exceptionModal({
                        visible: true,
                        message: '该请款单已经取消',
                        redirectUrl: `${ROUTER_PATH}/newadmin/financial/social/spPayment`
                    }));
                }
                else {
                    message.success('提交成功', 3, () => { browserHistory.push(`${ROUTER_PATH}/newadmin/financial/social/spPayment`) });
                }
            }
            //yield put(submitfetching(false));
            break;
        }
    }
}

export default function* watchPayInfoEntry() {
    yield takeEvery([
        PAYINFOENTRY_SAGA,
        PAYINFOENTRY_ADVANCEDETAILS_SAGA,
        PAYINFOENTRY_PAYMENTSCHEDULE_SAGA,
        PAYINFOENTRY_PAYMENTBILL_SAGA,
        PAYINFOENTRY_SUBMIT_SAGA,
         PAYINFOENTRY_REMOVE_SAGA,
    ], incrementAsync);
}