import { takeEvery } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { DOMAIN_OXT } from '../../global/global';
import * as moment from 'moment';
import {
    ORDER_INFO_SAGA,
    fetching,
    setOrderInfo,
} from '../../action/socialManagement/cashoutApproveReSubmitAction';
import {
    getOrderInfo,
    getPersonInfoBatch,
} from '../../api/socialManagement/cashoutApproveReSubmitApi';

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
 * 
 * @param userDepartmentId {Number} 用户部门id
 * @param ceoOrganizationId {NUmber} ceoid 
 */
const hasShow = (userDepartmentId, ceoOrganizationId) => {
    if (userDepartmentId === ceoOrganizationId) return false;
    return true;
}


function* incrementAsync(obj) {
    const {
        type,
        params,
    } = obj;
    switch (type) {
        case ORDER_INFO_SAGA: {
            yield put(fetching(true));
            let data = yield getOrderInfo(params);

            if (Number(data.error) === 0 || Number(data.status) === 0) {
                data = data.data;
                let {
                    jsSpPayeeDetail,
                    jsSpPayDetail,
                    jsSpRequestFundVerifyRecordDto,
                    jsSpRequestFundVerifyRecordDtoList,
                    ceoOrganizationId,

                    existNoDetail, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount, /** 无明细款项金额 */
                    noDetailRemark, /** 无明细款项备注*/
                } = data;
                jsSpPayDetail = jsSpPayDetail ? jsSpPayDetail : {}
                const newData: any = {
                    socialMonth: data.socialPaymentMonth, /* 社保缴费月（操作月）*/
                    socialNature: data.socialPayType, /* 社保请款性质 */
                    recipientType: data.payeeType, /* 收款方类型 */
                    recipientName: jsSpPayeeDetail.payeeName, /* 收款方名称 */
                    recipientId: jsSpPayeeDetail.outerId,/* 收款方id */
                    deadline: moment(jsSpPayeeDetail.requestCutOffTime * 1000).format('YYYY-MM-DD HH:mm'), /* 本次请款付款截止时间 */
                    billStatus: data.billStatus, /* 付款清单（客户维度）的状态 */
                    remark: data.remark, /* 备注 */
                    approvalPerson: data.fristSubmit, /* 审批人 */
                    recordsDataSource: jsSpRequestFundVerifyRecordDtoList, /* 请款记录 */
                    openBank: jsSpPayeeDetail.openBank, /* 开户行 */
                    account: jsSpPayeeDetail.account, /* 开户账号 */
                    orderStatus: data.status, /* 订单状态 */

                    existNoDetail: existNoDetail ? Number(existNoDetail) : 0, /** 是否存在无明细请款金额: 0:不存在，1:存在 */
                    noDetailAmount: noDetailAmount ? Number(noDetailAmount) : 0, /** 无明细款项金额 */
                    noDetailRemark: noDetailRemark || '', /** 无明细款项备注*/
                }

                /**
                 * 注入用户详细信息
                 */
                if (jsSpRequestFundVerifyRecordDtoList && jsSpRequestFundVerifyRecordDtoList.length > 0) {
                    const userIds = unique(jsSpRequestFundVerifyRecordDtoList.map(({ userId }) => userId));
                    const userData = yield getPersonInfoBatch(userIds);
                    if (Number(userData.status === 0) || Number(userData.errcode === 0)) {
                        newData.recordsDataSource = newData.recordsDataSource.map((data) => ({ ...data, userDetail: getUserDetail(data.userId, userData.data), hasShow: hasShow(data.userDepartmentId, ceoOrganizationId) }))
                    }
                }


                if (jsSpRequestFundVerifyRecordDto) {
                    newData.rejectReasonData = {
                        reason: jsSpRequestFundVerifyRecordDto.rejectReason,
                        files: jsSpRequestFundVerifyRecordDto.jsSpAccessoryFileList.map(({ name, url }) => ({ name, link: url})),
                    }




                }

                yield put(setOrderInfo(newData));
            }
            yield put(fetching(false));
            break;
        }

    }
}

export default function* watchCashoutApproveReSubmit() {
    yield takeEvery([
        ORDER_INFO_SAGA,
    ], incrementAsync);
}